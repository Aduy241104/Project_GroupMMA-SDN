import Comment from '../models/comment.js';
import { StatusCodes } from 'http-status-codes';
import { createResponse } from '../utils/createResponse.js';

// --- Lấy tất cả comment ---
const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find()
      .populate('userId', 'name username avatar')
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json(
      createResponse({ message: 'Success', data: { comments } })
    );
  } catch (error) {
    next(error);
  }
};

// --- Admin xóa comment ---
const adminDeleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      const err = new Error('Comment not found');
      err.statusCode = StatusCodes.NOT_FOUND;
      return next(err);
    }

    await comment.deleteOne(); // dùng deleteOne thay cho remove()
    res.status(StatusCodes.OK).json(
      createResponse({ message: 'Comment deleted by admin' })
    );
  } catch (error) {
    next(error);
  }
};

// --- Admin sửa comment ---
const adminUpdateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      const err = new Error('Comment not found');
      err.statusCode = StatusCodes.NOT_FOUND;
      return next(err);
    }

    comment.content = req.body.content ?? comment.content;
    await comment.save();

    res.status(StatusCodes.OK).json(
      createResponse({ message: 'Comment updated by admin', data: { comment } })
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getAllComments,
  adminDeleteComment,
  adminUpdateComment,
};
