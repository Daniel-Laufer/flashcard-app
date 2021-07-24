const axios = require('axios');
const addresses = {
    "auth-server": `http://${process.env.AUTH_SERVER_IP}:5000`,
    "rest-api-server":  `http://${process.env.REST_API_SERVER_IP}:5000`
};
//

module.exports = {
    /**
     * /authorize:
     *  post:
     *      tags:
     *          - auth-server-api
     *      description: authorize a user and return their respective permissions.
     *      parameters:
     *          -  name: auth-token
     *             in: header
     *             required: true
     *      responses:
     *          "200":
     *              description: success
     *          "400":
     *              description: unauthorized
     *          "401":
     *              description: invalid jwt token
     */
    authorize: async (req, res, next) => {
        try{
            const token = req.get("auth-token");
            if(!token) return res.status(401).send("Unauthorized");
            let config = {
                headers: {
                    "auth-token": token,
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
            console.log(err);
            return res.send(err);
            
        }
    },
}