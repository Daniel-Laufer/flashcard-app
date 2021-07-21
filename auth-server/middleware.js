const jwt = require("jsonwebtoken"); 

module.exports = {
    validateToken: (req, res, next) => {
        const token = req.header("auth-token");
        if (!token) return res.status(401).send("Unauthorized.");
        try{
            req.verification_details = jwt.verify(token, process.env.JWT_SECRET_KEY);
            next();
        }
        catch (error){ res.status(400).send("bad token"); }
    },
}

