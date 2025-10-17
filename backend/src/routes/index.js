import userController from "../controllers/userController.js";
import authRoute  from "./auth.route.js";


function route(app) {
    app.use("/api/test", userController.getAll);
    app.use("/auth", authRoute);
}

export default route;
