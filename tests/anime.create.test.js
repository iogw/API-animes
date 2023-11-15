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
const TOKEN = '';

describe('API test to create new anime ', () => {
  test('Check if return is an success object', async () => {
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

describe('API TEST with empty data', () => {
  test('Anime without title', async () => {
    await api
      .post('/animes')
      .send({
        year: 1950,
        chapters: 1000,
      })
      .set('Authorization', TOKEN)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        console.log('Response body:', res.body);
        assert.strictEqual(
          typeof res.body,
          'object',
          'Response is not an object'
        );
        assert.ok(
          !Array.isArray(res.body),
          'Response is an array, must be an object'
        );
        assert.ok(res.body !== null, 'Response is null');

        assert.ok(res.body.success !== undefined, 'Must be a success field');
        assert.ok(res.body.success === false, 'Success must be false');

        assert.ok(
          res.body.error !== undefined && typeof res.body.error === 'string',
          'Must be an error field with a message'
        );
      });
  });
  test('Anime without year', async () => {
    await api
      .post('/animes')
      .send({
        title: 'sample title',
        chapters: 1000,
      })
      .set('Authorization', TOKEN)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        console.log('Response body:', res.body);
        assert.strictEqual(
          typeof res.body,
          'object',
          'Response is not an object'
        );
        assert.ok(
          !Array.isArray(res.body),
          'Response is an array, must be an object'
        );
        assert.ok(res.body !== null, 'Response is null');

        assert.ok(res.body.success !== undefined, 'Must be a success field');
        assert.ok(res.body.success === false, 'Success must be false');

        assert.ok(
          res.body.error !== undefined && typeof res.body.error === 'string',
          'Must be an error field with a message'
        );
      });
  });
  test('Anime without chapters', async () => {
    await api
      .post('/animes')
      .send({
        title: 'sample title',
        year: 1950,
      })
      .set('Authorization', TOKEN)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        console.log('Response body:', res.body);
        assert.strictEqual(
          typeof res.body,
          'object',
          'Response is not an object'
        );
        assert.ok(
          !Array.isArray(res.body),
          'Response is an array, must be an object'
        );
        assert.ok(res.body !== null, 'Response is null');

        assert.ok(res.body.success !== undefined, 'Must be a success field');
        assert.ok(res.body.success === false, 'Success must be false');

        assert.ok(
          res.body.error !== undefined && typeof res.body.error === 'string',
          'Must be an error field with a message'
        );
      });
  });
});

describe('API TEST with wrogn type data', () => {
  test('Anime with numbers in the title', async () => {
    await api
      .post('/animes')
      .send({
        title: 12345,
        year: 1950,
        chapters: 1000,
      })
      .set('Authorization', TOKEN)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        console.log('Response body:', res.body);
        assert.strictEqual(
          typeof res.body,
          'object',
          'Response is not an object'
        );
        assert.ok(
          !Array.isArray(res.body),
          'Response is an array, must be an object'
        );
        assert.ok(res.body !== null, 'Response is null');

        assert.ok(res.body.success !== undefined, 'Must be a success field');
        assert.ok(res.body.success === false, 'Success must be false');

        assert.ok(
          res.body.error !== undefined && typeof res.body.error === 'string',
          'Must be an error field with a message'
        );
      });
  });
  test('Anime text in year or chapters', async () => {
    await api
      .post('/animes')
      .send({
        title: 'sample title',
        year: 'abc',
        chapters: 'abc',
      })
      .set('Authorization', TOKEN)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        console.log('Response body:', res.body);
        assert.strictEqual(
          typeof res.body,
          'object',
          'Response is not an object'
        );
        assert.ok(
          !Array.isArray(res.body),
          'Response is an array, must be an object'
        );
        assert.ok(res.body !== null, 'Response is null');

        assert.ok(res.body.success !== undefined, 'Must be a success field');
        assert.ok(res.body.success === false, 'Success must be false');

        assert.ok(
          res.body.error !== undefined && typeof res.body.error === 'string',
          'Must be an error field with a message'
        );
      });
  });
  test('Anime with a year that is not between 1900 and current year plus 2', async () => {
    await api
      .post('/animes')
      .send({
        title: 'sample title',
        year: 2050,
        chapters: 50,
      })
      .set('Authorization', TOKEN)
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        console.log('Response body:', res.body);
        assert.strictEqual(
          typeof res.body,
          'object',
          'Response is not an object'
        );
        assert.ok(
          !Array.isArray(res.body),
          'Response is an array, must be an object'
        );
        assert.ok(res.body !== null, 'Response is null');

        assert.ok(res.body.success !== undefined, 'Must be a success field');
        assert.ok(res.body.success === false, 'Success must be false');

        assert.ok(
          res.body.error !== undefined && typeof res.body.error === 'string',
          'Must be an error field with a message'
        );
      });
  });
});
