import userController from "../controllers/userController.js";


function route(app) {
    app.use("/api/test", userController.getAll)
}

export default route;
