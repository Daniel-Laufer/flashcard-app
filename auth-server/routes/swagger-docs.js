
module.exports = (app) => {
    // configuring swagger docs
    const swaggerUI = require("swagger-ui-express");
    const swaggerJsDoc = require("swagger-jsdoc");


    const swaggerOptions = {
        swaggerDefinition: {
            info: {
                title: "Auth server api documentation",
                description: "hello world"
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


