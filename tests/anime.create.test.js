serverPort = 4503;

// const mysql = require('mysql2/promise');
const supertest = require('supertest');
const server = require('../src/index.js');
const assert = require('assert');

const api = supertest(server);

const NEW_ANIME = {
  title: 'Naruto',
  year: 2002,
  chapters: 220,
};
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5vZW1pQGdtYWlsLmNvbSIsImlhdCI6MTcwMDAxMzg5NywiZXhwIjoxNzAwMDIxMDk3fQ.k1mQSU-TBrNKSgL3tLscO-hxab02aZwjp-Pr3YPTr7k';

describe('API test to create new anime ', () => {
  test('Check if movies are in json format and an object', async () => {
    await api
      .post('/animes')
      .send(NEW_ANIME)
      .set('Authorization', TOKEN)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        console.log('Response body:', res.body);
        assert(typeof res.body === 'object', 'Response is not an object');
        assert(
          !Array.isArray(res.body),
          'Response is an array, must be an object'
        );
        assert(res.body !== null, 'Response is null');
        assert(res.body.success !== undefined, 'Must be a success field');
        assert(res.body.success, 'Success must be true');
      });
  });
});
