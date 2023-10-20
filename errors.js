const ERRORS = Object.freeze({
    dbError: new Error("Failed to POST data to DB ... "),
    idRangeError: new RangeError("User ID must be greater than zero!"),
    authError: new Error("User credentials failed validation")
});

module.exports = ERRORS;