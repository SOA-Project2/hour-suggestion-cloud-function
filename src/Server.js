const express = require("express");
const PORT = 3000;

const app = express();
const router = express.Router();

const errorHandler = require("./errors/ErrorHandler");
router.use("/schedule/:day?/:time?", errorHandler.queryValidatorMiddleware);

const scheduleRecommendation = require("./business-logic/ScheduleRecommendation");
router.get("/schedule/:day?/:time?", scheduleRecommendation.getRecommendation);

app.use(router);

app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});

module.exports = {
    app
};