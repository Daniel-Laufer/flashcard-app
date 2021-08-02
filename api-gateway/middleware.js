const axios = require('axios');
const addresses = {
    "auth-server": `http://${process.env.AUTH_SERVER_IP}:5000`,
    "rest-api-server":  `http://${process.env.REST_API_SERVER_IP}:5000`
};
//

module.exports = {
    authorize: async (req, res, next) => {
        try{
            if(!req.get("authorization") || req.get("authorization").split(" ")[0] !== "Bearer" || req.get("authorization").split(" ").length !== 2) 
                return res.status(400).send("authorization header should be in the format \"Bearer <token>\"")
            
                const token = req.get("authorization").split(" ")[1];

            let config = {
                headers: {
                    "authorization": `Bearer ${token}`,
                }
            }
           
            const response = await axios.get(addresses["auth-server"].concat("/authorize"), config);
            req.authorization_details = response.data;
            next();
        }////
        catch (err){
            if(err.response){
                const status = err.response.status;
                return res.status(status).send(err.response.data);
            }
            // console.log(err);
            return res.status(500).send(err);
            
        }
    },
}