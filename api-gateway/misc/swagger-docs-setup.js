
module.exports = (app) => {
    // configuring swagger docs
    const swaggerUI = require("swagger-ui-express");
    // const swaggerJsDoc = require("swagger-jsdoc");
    const swaggerDoc = require('../swagger.json');


    // const swaggerOptions = {
    //     swaggerDefinition: {
    //         info: {
    //             title: "The Flashcard App's Offical API Documentation",
    //             description: "The offical documentation for the API used by the Flashcard App created by Daniel Laufer. You can view the gitub repository for this project here:  https://github.com/Daniel-Laufer/flashcard-app",
    //         },
    //     },
    //     // apis: ["index.js", "./routes/*.js"],
    //     cus
    // };

    // const swaggerDocs = swaggerJsDoc(swaggerOptions);

    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

    const apiDocsRedirectPath = "/api/".concat('/api-docs');
    app.get('/api-docs', (req, res) => {
        res.redirect(apiDocsRedirectPath);
    });
}


