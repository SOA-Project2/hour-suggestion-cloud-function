const fs = require("fs");
const path = require("path"); // Import the path module
const data = require("./schedule.json");
const statusCodes = require("../constants/StatusCodes");

const getRecommendation = (req, res, next) => {
    const query = req.query; // query params
    const { day, time } = req.params;

    // Validate if the day is correctly written
    if (!data[day]) {
        return res.status(statusCodes.BAD_REQUEST).json({ error: "Invalid day" });
    }

    // Find the index of the requested time in the list of available hours
    const timeIndex = data[day].indexOf(time);

    // If the requested time is not available, find the next available time
    if (timeIndex === -1) {
        // Check if there are more available hours on the same day
        if (timeIndex < data[day].length - 1) {
            const nextTime = data[day][timeIndex + 1];
            return res.status(statusCodes.OK).json({"message": "The hour requested is not available. Available time for the same day",  "day": day, "time": nextTime });
        }
        else {
            // Find the next available day and time
            let nextDay;
            for (let i = 1; i <= 6; i++) {
                const nextDayIndex = (Object.keys(data).indexOf(day) + i) % 7;
                const nextDayName = Object.keys(data)[nextDayIndex];
                if (data[nextDayName].length > 0) {
                    nextDay = nextDayName;
                    break;
                }
            }
            if (nextDay) {
                const nextTime = data[nextDay][0];
                return res.status(statusCodes.OK).json({"message": "There are no more available hours for the requested day. This is an available day and time",  "day": nextDay, "time": nextTime });
            } else {
                return res.status(statusCodes.NOT_FOUND).json({ error: "No available days" });
            }
        }
    }

    var response = {"day": day, "time": time,  "message": "The provided day and time are available for reservation" };

    return res.status(statusCodes.OK).json(response);
};

module.exports = {
    getRecommendation,
};