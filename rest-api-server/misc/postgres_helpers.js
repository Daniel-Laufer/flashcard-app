



function query_func(client, query_text, query_payload) {
    return new Promise((resolve, reject) => {
        client.query(query_text, query_payload, (err,res) => {
            if(err) reject(err);
            resolve(res);
            
        });
    });
}


module.exports = query_func;