import Comment from '../models/comment.js';
import { StatusCodes } from 'http-status-codes';
import { createResponse } from '../utils/createResponse.js';


const createComment = async (req, res, next) => {
	try {
		const { storyId, content } = req.body;
		const userId = req.user?.id;

		if (!userId) {
			const err = new Error('User not authenticated');
			err.statusCode = StatusCodes.UNAUTHORIZED;
			return next(err);
		}

		const comment = await Comment.create({ storyId, userId, content });
		res.status(StatusCodes.CREATED).json(createResponse({ statusCode: StatusCodes.CREATED, message: 'Comment created', data: { comment } }));
	} catch (error) {
		next(error);
	}
};

const getCommentsByStory = async (req, res, next) => {
	const { storyId } = req.params;
	try {
		const comments = await Comment.find({ storyId }).populate([{ path: 'userId', select: 'name _id' }]).sort({ createdAt: -1 });
		res.status(StatusCodes.OK).json(createResponse({ data: { comments } }));
	} catch (error) {
		next(error);
	}
};

const updateComment = async (req, res, next) => {
	const { id } = req.params;
	try {
		const comment = await Comment.findById(id);
		if (!comment) {
			const err = new Error('Comment not found');
			err.statusCode = StatusCodes.NOT_FOUND;
			return next(err);
		}

		// only owner or admin can update
		const user = req.user;
		if (!user) {
			const err = new Error('User not authenticated');
			err.statusCode = StatusCodes.UNAUTHORIZED;
			return next(err);
		}

		if (user.role !== 'admin' && String(comment.userId) !== String(user.id)) {
			const err = new Error('Permission denied');
			err.statusCode = StatusCodes.FORBIDDEN;
			return next(err);
		}

		comment.content = req.body.content ?? comment.content;
		await comment.save();

		res.status(StatusCodes.OK).json(createResponse({ message: 'Comment updated', data: { comment } }));
	} catch (error) {
		next(error);
	}
};

const deleteComment = async (req, res, next) => {
	const { id } = req.params;
	try {
		const comment = await Comment.findById(id);
		if (!comment) {
			const err = new Error('Comment not found');
			err.statusCode = StatusCodes.NOT_FOUND;
			return next(err);
		}

		const user = req.user;
		if (!user) {
			const err = new Error('User not authenticated');
			err.statusCode = StatusCodes.UNAUTHORIZED;
			return next(err);
		}

		if (user.role !== 'admin' && String(comment.userId) !== String(user.id)) {
			const err = new Error('Permission denied');
			err.statusCode = StatusCodes.FORBIDDEN;
			return next(err);
		}

		await comment.remove();
		res.status(StatusCodes.OK).json(createResponse({ message: 'Comment deleted' }));
	} catch (error) {
		next(error);
	}
};

const getAllComments = async (req, res, next) => {
	try {
		const comments = await Comment.find().populate([{ path: 'userId', select: 'name' }]).sort({ createdAt: -1 });
		res.status(StatusCodes.OK).json(createResponse({ data: { comments } }));
	} catch (error) {
		next(error);
	}
};

export default {
	createComment,
	getCommentsByStory,
	updateComment,
	deleteComment,
	getAllComments
};