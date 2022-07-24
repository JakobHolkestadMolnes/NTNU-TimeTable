import express from 'express';
import {createComment, deleteComment, getAllComments, getCommentById} from './../controllers/comments';


/**
 * Rotes for comments
 * @remarks This is the main router for comments, all routes are prefixed with http://example.domain/comments/
 * 
 */
const router = express();

/**
 * @swagger
 * /comments:
 *   get:
 *      summary: Get all comments
 *      description: Returns all comments from the database
 *      responses:
 *          200:
 *             description: A list of comments
 *             schema:
 *             type: array
 *             properties:
 *                items:
 *                  type: object
 *                  properties:
 *                   id: "Comment id"
 *                   content: "Comment content"
 *                   ip: "Comment ip"
 *                   createdAt: "Comment createdAt"
 *                   updatedAt: "Comment updatedAt"
 *                             
 */
router.get('/', getAllComments);

 /**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by id
 *     description: Returns a comment by id
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *     responses:
 *       200:
 *         description: A single comment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 0
 *                     content:
 *                       type: string
 *                       description: The comments content.
 *                       example: "This is a comment"
 * 
 *       404:
 *        description: Comment not found.
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             description: The error message.
 *             example: "Comment not found"
*/      

router.get('/:id', getCommentById);

router.delete('/:id', deleteComment);

router.post('/', createComment);


export default router;