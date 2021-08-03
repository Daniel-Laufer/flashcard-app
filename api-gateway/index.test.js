const app = require("./app.js");
const request = require("supertest");




describe("login", () => {
    it("returns status code 400 if username is not provided for login", async () => {
        const payload = {
            username: "adsfasdf"
        }
        const res = await request(app).post("/user/login").send(payload);
        expect(res.statusCode).toEqual(400);
    })
})






