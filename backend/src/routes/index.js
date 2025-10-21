import userController from "../controllers/userController.js";
import authRoute from "./auth.route.js";
import storyRoute from "./story.route.js";
import userRouter from './user.route.js';
import chapterRouter from "./chapter.route.js";
import likeRouter from "./like.route.js";
import { verifyAdmin, verifyTokenMiddleware } from "../middlewares/authMiddleware.js";

function route(app) {

    app.use("/api/test", verifyTokenMiddleware, verifyAdmin, userController.getAll);
    app.use("/auth", authRoute);

    // app.post("/api/auth/register", userController.register);
    app.use("/api/auth", userRouter);
    app.use("/api/stories", storyRoute);
    app.use("/api/chapters", chapterRouter);
    app.use("/api/like", likeRouter);

}

export default route
