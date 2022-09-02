import { NextFunction, Request, Response } from 'express';
import Logging from '../library/Logging';
import { prisma } from '../config/client';
import ical from 'node-ical';
import fetch from 'node-fetch';
import { map, object } from 'zod';

//  https://tp.educloud.no/ntnu/timeplan/ical.php?sem=22h&id%5B0%5D=IDATA2302&type=course
const getICALLink = (Semester:string,CourseCode:string) => {
    // remove everything after the first _ in the course code
    const courseCode = CourseCode.split('_')[0];

    return `https://tp.educloud.no/ntnu/timeplan/ical.php?sem=${Semester}&id%5B0%5D=${courseCode}&type=course`;
}

/**
 * Returns all comments from the database
 * @param req Request object
 * @param res Response object
 */
const getLecturesByCoureseCode = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            message: 'Missing id'
        });

    }
    const lectures = await prisma.activities.findMany({
        where: {
            CourseCode: id  
        }
    });
    if (!lectures) {
        return res.status(404).json({
            message: 'Lecture not found'
        });
    }
    if (lectures.length === 0) {
        return res.status(404).json({
            message: 'No Lectures found'
        });
    }
    return res.status(200).json(lectures);    
};


const getLectures = async (req: Request, res: Response) => {
let Lectures = await prisma.courses.findMany({});
if (!Lectures) {
    return res.status(404).json({
        message: 'Lecture not found'
    });}

    if (Lectures.length === 0) {
        return res.status(404).json({
            message: 'Lecture not found'
        });
    }
    Lectures = Lectures.map((lecture) => {
        return {
            ...lecture,
            Lectures: "/api/v1/lectures/" + lecture.CourseCode
        }
    })

return res.status(200).json(Lectures);

}


const getNewLectures = async (req: Request, res: Response) => {
    const id = req.params.id;
    const semester = req.params.semester;
    if (!id) {
        return res.status(400).json({
            message: 'Missing id'
    });
    }
    const icalLink = getICALLink(semester, id)
    const icalFile = await fetch(icalLink);
    console.log(icalFile);
    
    const icalData = await icalFile.text();

    const events = ical.parseICS(icalData);

    let lectures:any = [];
    for (const event in events) {
        const lecture = events[event];
        if (lecture.type === 'VEVENT') {
            lectures.push(lecture);
        }
    }
    
    lectures.forEach(async (lecture:any) => {
        prisma.activities.create({
            data: {
                CourseCode: id,
                StartDate: lecture.start,
                EndDate: lecture.end,
                Activity: lecture.summary,
                Room: lecture.location,

            }
        }).catch((err) => {
            console.log(err);
        });
    })
    


    return res.status(200).json(events);
}

    


    export { getLecturesByCoureseCode, getLectures, getNewLectures };
