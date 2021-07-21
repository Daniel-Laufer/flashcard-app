module.exports = {
    authorize: (req, res, next) => {
        console.log("in authorize");
        next();
    },
}

