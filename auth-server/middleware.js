const jwt = require("jsonwebtoken"); 

module.exports = {
    validateToken: (req, res, next) => {
        const authHeaderSplit = req.header("authorization").split(" ");
        if(authHeaderSplit[0] != "Bearer") return res.status(400).send("bad token format, should be \"Bearer <token>\"");

        const token = req.header("authorization").split(" ")[1];
        
        if (!token) return res.status(401).send("Unauthorized.");
        try{
            req.verification_details = jwt.verify(token, process.env.JWT_SECRET_KEY);
            next();
        }
        catch (error){ res.status(400).send("bad token"); }
    },
}

