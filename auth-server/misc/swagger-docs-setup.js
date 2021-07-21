
module.exports = (app) => {
    // configuring swagger docs
    const swaggerUI = require("swagger-ui-express");
    const swaggerJsDoc = require("swagger-jsdoc");


    const swaggerOptions = {
        swaggerDefinition: {
            info: {
                title: "Kubernetes Pizza App's Offical API Documentation",
                description: "The offical documentation for the API used by the Kubernetes Pizza App created by Daniel Laufer. A link to the github repo can be found here: https://github.com/Daniel-Laufer/kubernetes_pizza_app",
            },
        },
        apis: ["index.js"]
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);

    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

    const apiDocsRedirectPath = "/api/user/".concat('/api-docs');
    app.get('/api-docs', (req, res) => {
        res.redirect(apiDocsRedirectPath);
    });
}


