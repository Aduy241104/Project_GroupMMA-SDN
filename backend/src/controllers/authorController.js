import Author from '../models/author.js'
import { StatusCodes } from 'http-status-codes';
import { createResponse } from '../utils/createResponse.js';


const getAllAuthors = async (req, res, next) => {
	try {
		const authors = await Author.find().select('-__v');
		res.status(StatusCodes.OK).json(createResponse({ data: { authors } }));
	} catch (error) {
		next(error);
	}
};

const getAuthorById = async (req, res, next) => {
	const { id } = req.params;
	try {
		const author = await Author.findById(id).select('-__v');
		if (!author) {
			const err = new Error('Author not found');
			err.statusCode = StatusCodes.NOT_FOUND;
			return next(err);
		}
		res.status(StatusCodes.OK).json(createResponse({ data: { author } }));
	} catch (error) {
		next(error);
	}
};

const createAuthor = async (req, res, next) => {
	try {
		const { name, bio, avatarUrl } = req.body;
		const author = await Author.create({ name, bio, avatarUrl });
		res.status(StatusCodes.CREATED).json(createResponse({ statusCode: StatusCodes.CREATED, message: 'Author created', data: { author } }));
	} catch (error) {
		next(error);
	}
};

const updateAuthor = async (req, res, next) => {
	const { id } = req.params;
	try {
		const updated = await Author.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select('-__v');
		if (!updated) {
			const err = new Error('Author not found');
			err.statusCode = StatusCodes.NOT_FOUND;
			return next(err);
		}
		res.status(StatusCodes.OK).json(createResponse({ message: 'Author updated', data: { author: updated } }));
	} catch (error) {
		next(error);
	}
};

const deleteAuthor = async (req, res, next) => {
	const { id } = req.params;
	try {
		const deleted = await Author.findByIdAndDelete(id);
		if (!deleted) {
			const err = new Error('Author not found');
			err.statusCode = StatusCodes.NOT_FOUND;
			return next(err);
		}
		res.status(StatusCodes.OK).json(createResponse({ message: 'Author deleted' }));
	} catch (error) {
		next(error);
	}
};

export default {
	getAllAuthors,
	getAuthorById,
	createAuthor,
	updateAuthor,
	deleteAuthor
};