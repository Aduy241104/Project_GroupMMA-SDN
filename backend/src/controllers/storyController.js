import Story from "../models/story.js";
import { getAddRecently, getMostViewedStories, getUpdateRecently } from "../services/storiesServices.js";
import { StatusCodes } from "http-status-codes";
import Author from "../models/author.js";


const getAllStory = async (req, res) => {

    try {
        const result = await Story.find();
        res.status(200).json(result);
    } catch (error) {
        console.log("💥ERROR: ", error);
        res.status(500)
    }
}


const getHomeData = async (req, res) => {

    try {
        const mostViewedStories = await getMostViewedStories();
        const updatedRecentlyStories = await getUpdateRecently();
        const addedRecentlyStories = await getAddRecently();

        const responseData = {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Get main data successfully",
            data: {
                mostViewedStories: mostViewedStories,
                updatedRecentlyStories: updatedRecentlyStories,
                addedRecentlyStories: addedRecentlyStories
            }
        }

        res.status(StatusCodes.OK).json(responseData);
    } catch (error) {
        console.log("💥ERROR: ", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}


const findStory = async (req, res, next) => {
    const { type, keyword } = req.query;

    try {

        const query = {};
        const normalizeKeyword = String(keyword).toLowerCase();

        if (type === "title") {
            query.title = { $regex: normalizeKeyword, $options: "i" };
        } else if (type === "author") {
            const authorObj = await Author.findOne({ name: { $regex: normalizeKeyword, $options: "i" } });

            if (!authorObj) {
                const err = new Error("Author not found");
                err.statusCode = StatusCodes.NOT_FOUND;
                return next(err)
            }
            query.authorId = authorObj._id;
        }

        const data = await Story.find(query)
            .populate(
                [
                    { path: "authorId", select: "name" },
                    { path: "categoryIds", select: "name" }
                ]
            )
            .select("-createdBy -__v -createdAt");

        const responseData = {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Find story successfully",
            data: {
                stories: data
            }
        }
        res.status(StatusCodes.OK).json(responseData);
    } catch (error) {
        next(error);
    }
}

const updateStoryView = async (req, res, next) => {
    const { id } = req.params;
    try {

        const story = await Story.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true, runValidators: true }
        ).select("title views");


        if (!story) {
            const err = new Error("Story not found");
            err.statusCode = StatusCodes.NOT_FOUND;
            return next(err);
        }


        const responseData = {
            success: true,
            statusCode: StatusCodes.OK,
            message: "View updated successfully",
            data: {
                story: story
            }
        }

        res.status(StatusCodes.OK).json(responseData);
    } catch (error) {
        next(error);
    }
};

//Admin-them

const createStory = async (req, res, next) => {
  try {
    const { title, slug, description, authorId, categoryIds, type, status } = req.body;

    if (type !== "novel") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Only 'novel' type stories can be created by admin",
      });
    }

    const newStory = new Story({
      title,
      slug,
      description,
      authorId,
      categoryIds,
      type,
      status,
      createdBy: req.user._id, // lấy từ token admin
    });

    await newStory.save();

    // Populate dữ liệu author và category trước khi trả về
    const populatedStory = await Story.findById(newStory._id)
      .populate({ path: "authorId", select: "name bio avatarUrl" })
      .populate({ path: "categoryIds", select: "name slug description" })
      .populate({ path: "createdBy", select: "username email" });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Story created successfully",
      data: populatedStory,
    });
  } catch (error) {
    next(error);
  }
};


// Lấy chi tiết story theo id
const getStoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id)
      .populate({ path: "authorId", select: "name bio avatarUrl" })
      .populate({ path: "categoryIds", select: "name slug description" })
      .populate({ path: "createdBy", select: "username email" });

    if (!story) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Story not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Get story successfully",
      data: story,
    });
  } catch (error) {
    next(error);
  }
};


//Admin - sua

const updateStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);

    if (!story) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Story not found",
      });
    }

    if (story.type !== "novel") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Only 'novel' stories can be updated by admin",
      });
    }

    await Story.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    // Populate dữ liệu sau khi update
    const updatedPopulated = await Story.findById(id)
      .populate({ path: "authorId", select: "name bio avatarUrl" })
      .populate({ path: "categoryIds", select: "name slug description" })
      .populate({ path: "createdBy", select: "username email" });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Story updated successfully",
      data: updatedPopulated,
    });
  } catch (error) {
    next(error);
  }
};

//Admin - Xoa
const deleteStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);

    if (!story) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Story not found",
      });
    }

    if (story.type !== "novel") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Only 'novel' stories can be deleted by admin",
      });
    }

    await Story.findByIdAndDelete(id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Story deleted successfully",
      data: {
        _id: story._id,
        title: story.title,
        authorId: story.authorId,
        categoryIds: story.categoryIds
      }
    });
  } catch (error) {
    next(error);
  }
};



export default {
    getAllStory,
    getHomeData,
    findStory,
    updateStoryView,
    getStoryById,
    createStory, // admin - thêm
    updateStory, // admin - sửa
    deleteStory // admin - xóa
}