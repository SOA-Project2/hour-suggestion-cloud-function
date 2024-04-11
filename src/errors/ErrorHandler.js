const STATUS_CODES = require("../constants/StatusCodes");

/**
 * Handle custom errors
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const queryValidatorMiddleware = (req, res, next) => {
    
  const { day, time } = req.params;
  
  console.log(req.params);

  // Validate day and time parameters
  if (!day || !time) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Day and time parameters are required" });
  }
  // Validate that day is not a number
  if (!isNaN(day)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Day parameter must not be a number" });
  }
  // Validate that time parameter does not contain alphabetic letters
  if (/[a-zA-Z]/.test(time)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Time parameter must not contain alphabetic letters" });
  }
  // Proceed to controllers if parameters are valid
  next();
};

module.exports = {
    queryValidatorMiddleware,
};
