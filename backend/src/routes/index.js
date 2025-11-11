import userController from "../controllers/userController.js";
import authRoute from "./auth.route.js";
import storyRoute from "./story.route.js";
import userRouter from './user.route.js';
import chapterRouter from "./chapter.route.js";
import likeRouter from "./like.route.js";
import commentRouter from './comment.route.js';
import authorRouter from './author.route.js';
import bookmarkRoute from "./bookmark.route.js";
import readingHistoryRouter from "./history.route.js";

import { verifyAdmin, verifyTokenMiddleware } from "../middlewares/authMiddleware.js";

function route(app) {
    app.use("/api/test", userController.getAll);
    app.use("/auth", authRoute);

    // User & Auth
    app.use("/api/auth", userRouter);

    // Stories & Chapters
    app.use("/api/stories", storyRoute);
    app.use("/api/chapters", chapterRouter);

    // Likes
    app.use("/api/like", likeRouter);

    // Comments
    app.use("/api/comments", commentRouter);

    // Authors
    app.use("/api/authors", authorRouter);

    // Bookmarks
    app.use("/api/bookmark", bookmarkRoute);

    // Reading History
    app.use("/api/history", readingHistoryRouter);
}

export default route;
