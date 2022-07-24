import { Request, Response } from 'express';
import Logging from '../library/Logging';
import { prisma } from '../config/client';



/**
 * Returns all comments from the database
 * @param req Request object
 * @param res Response object
 */
const getAllComments = async (req: Request, res: Response) => {
    const comments = await prisma.comments.findMany();
    res.status(200).json(comments);
};

/**
 * Gets a comment by id
 * @param req Request object
 * @param res Response object
 */
const getCommentById = async (req: Request<{ id: number }>, res: Response) => {
    const id = Number(req.params.id);
    if (!id) {
        res.status(400).json({ message: 'Missing id' });
        return;
    }
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid id' });
        return;
    }
    if(typeof id !== 'number') {
        res.status(400).json({ message: 'Invalid id NaN' });
        return;
    }

    const comment = await prisma.comments.findUniqueOrThrow({
        where: {
            id
        }
    })
        .catch((err) => {
            Logging.error(err);
            res.status(500).json({ message: 'Internal Server Error' });

        }
        );
    if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
    }
    res.status(200).json(comment);
}

/**
 * Creates a new comment
 * @param req Request object
 * @param res Response object
 */
const createComment = async (req: Request, res: Response) => {
    const { body } = req;
    const ip = req.socket.remoteAddress || '';
    const comments = await prisma.comments
        .create({
            data: {
                ip,
                content: body.content
            }
        })
        .catch((err) => {
            Logging.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        });
    res.status(201).json(comments);
};

/**
 * Deletes a comment by id
 * @param req Request object
 * @param res Response object
 */
const deleteComment = async (req: Request, res: Response) => {
    Logging.info(`Deleting comment with id: ${req.params.id}`);
    if (!req.params.id) {
        Logging.error('No id provided');
        return res.status(400).json({ message: 'Bad Request' });
    }


    // make sure id is a number
    const id = parseInt(req.params.id);

    // delete comment

    const comments = await prisma.comments
        .delete({
            where: {
                id
            }
        })
        .then(() => {
            Logging.info('Comment deleted');

            return res.status(200).json(`Comment with id: ${id} deleted`);
        })
        .catch((err) => {
            Logging.error(err);
            if (err.message.includes('Record to delete does not exist.')) {
                return res.status(404).json({ message: 'Not Found' });
            } else {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
};


export { getAllComments, getCommentById, createComment, deleteComment };
