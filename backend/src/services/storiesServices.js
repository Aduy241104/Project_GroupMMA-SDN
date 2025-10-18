import Story from "../models/story.js";

import Category from "../models/category.js";
import Author
 from "../models/author.js";
export const getMostViewedStories = async (limit = 5) => {
    return await Story.find()
        .sort({ views: -1 })
        .limit(limit)
        .populate([
            {
                path: "categoryIds",
                select: "name"
            },
            {
                path: "authorId",
                select: "name"
            }

        ]);
}