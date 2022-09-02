import express from 'express';
import { getLectures, getLecturesByCoureseCode, getNewLectures } from '../controllers/lectures';



/**
 * Routes for logs
 * @remarks This is the main router for comments, all routes are prefixed with http://example.domain/comments/
 * 
 */
const router = express();

router.get('/', getLectures);

router.get('/:id', getLecturesByCoureseCode);

router.get('/:id/:semester', getNewLectures);




export default router;