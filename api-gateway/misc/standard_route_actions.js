
const axios = require('axios');

module.exports = {
    standardGetRouteActions: async (api_name, resource, req, res, authorization_details={}) => {
        const config = {
            headers: {
                authorization_details: JSON.stringify(authorization_details)
            }
        }
        try{
            const response = await axios.get(`${api_name}/${resource}`, config);
            return res.status(response.status).send(response.data);
        }
        catch (err){
            if(err.response){
                const status = err.response.status;
                return res.status(status).send(err.response.data);
            }
            return res.status(500).send(err);
        }
    },
    standardPostRouteActions: async (api_name, resource, payload, req, res) => {
        try{
            const response = await axios.post(`${api_name}/${resource}`, payload);
            return res.send(response.data);
        }
        catch (err){
            if(err.response){
                const status = err.response.status;
                return res.status(status).send(err.response.data);
            }
            return res.status(500).send(err);
        }
    },
    standardPutRouteActions: async (api_name, resource, payload, req, res) => {
        try{
            const response = await axios.put(`${api_name}/${resource}`, payload);
            return res.send(response.data);
        }
        catch (err){
            if(err.response){
                const status = err.response.status;
                return res.status(status).send(err.response.data);
            }
            return res.status(500).send(err);
        }
    },
    standardDeleteRouteActions: async (api_name, resource, payload, req, res) => {
        try{
            const response = await axios.delete(`${api_name}/${resource}`, payload);
            return res.send(response.data);
        }
        catch (err){
            if(err.response){
                const status = err.response.status;
                return res.status(status).send(err.response.data);
            }
            return res.status(500).send(err);
        }
    }
    
}