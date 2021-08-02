const axios = require('axios');
const addresses = {
    "auth-server": `http://${process.env.AUTH_SERVER_IP}:5000`,
    "rest-api-server":  `http://${process.env.REST_API_SERVER_IP}:5000`
};
//

module.exports = {
    authorize: async (req, res, next) => {
        try{
            const token = req.get("authorization").split(" ")[1];
            if(!token) return res.status(401).send("Unauthorized");
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
            return res.send(err);
            
        }
    },
}