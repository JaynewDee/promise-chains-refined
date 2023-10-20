const {
    idRangeError,
    authError,
    dbError
} = require('./errors');

const BASE_URL = "https://jsonplaceholder.typicode.com/posts/"

let dbOpen = false;

const openDB = () => dbOpen = true;
const closeDB = () => dbOpen = false;

function authenticate(data) {
    let authorized = true;
    // do some user authentication stuff
    // ...
    if (authorized) return data;
    else throw authError;
}

const resToJson = (res) => res.json();

function sanitize(data) {
    // simulate data sanitization
    const cleanData = {
        title: "",
        body: "",
        userId: 0
    }

    for (key in data) {
        const val = data[key];

        // trim string fields
        if (key === "title" || key === "body") {
            cleanData[key] = val.trim()
        } else if (key === "userId") {
            // throw error if userId out of range
            if (val < 0 || !(typeof val === "number"))
                throw idRangeError;
            else cleanData["userId"] = val;
        }
    }

    return cleanData;
}

function postToDB(data) {
    // simulate result of async database transaction
    openDB();

    let success = false;

    if (dbOpen && success) {
        console.log(`::: Transaction complete :::`);
        console.dir(data);
        console.log("=".repeat(25))
        return data;
    }

    throw dbError
}

function handleError(error) {
    // Conditionally respond to errors
    switch (error.message) {
        case "User credentials failed validation":
            console.error("Authentication error")
            break;
        case "User ID must be greater than zero!":
            console.error("User ID range error")
            break;
        case "Failed to POST data to DB ... ":
            console.error("Database transaction error")
            break;
        default:
            break;
    }
}

function cleanUp() {
    closeDB()
}

async function postTransaction(url, id) {
    const fetchOptions = {
        method: "GET",
        headers: {
            'Content-Type': "application/json; charset=UTF-8"
        }
    }

    fetch(url + id, fetchOptions)
        .then(authenticate)
        .then(resToJson)
        .then(sanitize)
        .then(postToDB)
        .catch(handleError)
        .finally(cleanUp)
}

(async () => {
    const transactions = new Array(10).fill(0)
        .map((_, i) => postTransaction(BASE_URL, i + 1))

    await Promise.all(transactions)
})()