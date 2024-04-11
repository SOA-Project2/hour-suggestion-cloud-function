const request = require('supertest');
const { app } = require('./src/Server.js');

describe('GET /schedule/:day?/:time?', () => {
    // Caso de prueba para validar que se requieren los parámetros day y time
    it('should return a 400 status code for missing parameters', async () => {
        const response = await request(app).get('/schedule/');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Day and time parameters are required');
    });

    // Caso de prueba para validar que el parámetro day no sea un número
    it('should return a 400 status code for invalid day parameter', async () => {
        const response = await request(app).get('/schedule/123/14:00');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Day parameter must not be a number');
    });

    // Caso de prueba para validar que el parámetro time no contenga letras
    it('should return a 400 status code for invalid time parameter', async () => {
        const response = await request(app).get('/schedule/Monday/abc');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Time parameter must not contain alphabetic letters');
    });
});
