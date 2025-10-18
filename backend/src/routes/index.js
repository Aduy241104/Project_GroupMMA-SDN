import userController from "../controllers/userController.js";
import authRoute from "./auth.route.js";
import storyRoute from "./story.route.js"
import userRouter from './user.route.js'

function route(app) {

    app.use("/api/test", userController.getAll);
    app.use("/auth", authRoute);

    // app.post("/api/auth/register", userController.register);
    app.use("/api/auth", userRouter);
    app.use("/api/story", storyRoute);

}

export default route
