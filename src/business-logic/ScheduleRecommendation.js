const fs = require("fs").promises;
const path = require("path");
const data = require("./schedule.json");
const statusCodes = require("../constants/StatusCodes");

const updateSchedule = async (day, time) => {
    // Find the index of the requested time in the list of available hours
    const timeIndex = data[day].indexOf(time);

    // Validate if the day is correctly written
    if (!data[day]) {
        throw new Error("Invalid day");
    }

    // If the requested time is not available, find the next available time
    else if (timeIndex === -1) {
        // Check if there are more available hours on the same day
        if (data[day].length > 0) {
            const nextTime = data[day][0];
            throw new Error(`The hour requested is not available. Recommended available time for the same day: ${nextTime}`);
        } else {
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
                throw new Error(`There are no more available hours for the requested day. Recommended day and time: ${nextDay} ${nextTime}`);
            } else {
                throw new Error("No available days");
            }
        }
    } else {
        // Remove the hour from the schedule
        data[day].splice(timeIndex, 1);

        // Update the schedule.json file
        const filePath = path.join(__dirname, "schedule.json");
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }
};

const getRecommendation = async (req, res, next) => {
    const query = req.query; // query params
    const { day, time } = req.params;

    try {
        await updateSchedule(day, time);
        return res.status(statusCodes.OK).json({ "message": "The provided day and time are available for reservation", "day": day, "time": time });
    } catch (error) {
        return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

module.exports = {
    getRecommendation,
};
