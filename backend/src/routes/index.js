import userController from "../controllers/userController.js";
import authRoute from "./auth.route.js";
import storyRoute from "./story.route.js";
import userRouter from './user.route.js';
import chapterRouter from "./chapter.route.js";
import likeRouter from "./like.route.js";
import categoryRouter from "./category.route.js"
import authorRouter from "./author.route.js";
import bookmarkRoute from "./bookmark.route.js";
import commentRoute from "./comment.route.js";
import readingHistoryRouter from "./history.route.js";
import adminCommentRouter from "./adminComment.route.js";
import adminAuthorRouter from "./adminAuthor.route.js";
import { verifyAdmin, verifyTokenMiddleware } from "../middlewares/authMiddleware.js";

function route(app) {

    app.use("/api/test", userController.getAll);
    app.use("/auth", authRoute);

    // app.post("/api/auth/register", userController.register);
    app.use("/api/auth", userRouter);
    app.use("/api/stories", storyRoute);
    app.use("/api/chapters", chapterRouter);
    app.use("/api/like", likeRouter);
    
    app.use("/api/categories", categoryRouter);
    app.use("/api/authors", authorRouter);
    app.use("/api/bookmark", bookmarkRoute);
    app.use("/api/comments", commentRoute);
    app.use("/api/history", readingHistoryRouter)
    app.use('/api/admin/comments', adminCommentRouter);
    app.use('/api/admin/author', adminAuthorRouter);

}

export default route
