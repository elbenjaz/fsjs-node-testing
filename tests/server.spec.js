const request = require("supertest");
const server = require("../index");
const { faker } = require('@faker-js/faker');
const { generateToken } = require('./utils/login.js');

require('dotenv').config();

describe("Coffee CRUD", () => {
    it("GET /cafes : returns code 200 and array with min 1 object", async () => {
        const response = await request(server)
            .get("/cafes")
            .send();
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toBeInstanceOf(Object);
    });

    it("DELETE /cafes : returns code 404 with not found ID", async () => {
        const jwt = generateToken(); //"token"

        const id_not_found = faker.string.alphanumeric(); //"not_found_id"
        const response = await request(server)
            .delete(`/cafes/${id_not_found}`)
            .set("Authorization", `Bearer: ${jwt}`)
            .send();

        expect(response.statusCode).toBe(404);
    });
    
    it("POST /cafes : returns code 201", async () => {
        const id = faker.string.alphanumeric(); //"new_coffee_id"
        const coffee =   {
            "id"     : id,
            "nombre" : faker.commerce.productName() //"New coffee"
        };
        
        const response = await request(server)
            .post("/cafes")
            .send(coffee);

        expect(response.statusCode).toBe(201);
        expect(response.body).toContainEqual(coffee);
    });
      
    it("PUT /cafes/:id : returns code 400 with mismatched IDs", async () => {
        const id = faker.string.alphanumeric();//"new_coffee_id"
        const coffee =   {
            "id"     : faker.string.numeric(), //"new_coffee_id2"
            "nombre" : faker.commerce.productName() //"New coffee"
        };

        const response = await request(server)
            .put(`/cafes/${id}`)
            .send(coffee);

        expect(response.statusCode).toBe(400);
    });  
});
