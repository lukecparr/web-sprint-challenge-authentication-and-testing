const request = require('supertest');
const db = require('../data/dbConfig.js');
const server = require('./server.js');

beforeAll(async () => {
	await db.migrate.rollback();
	await db.migrate.latest();
});

beforeEach(async () => {
	await db('users').truncate();
});

afterAll(async () => {
	await db.destroy();
});
describe('server.js', () => {
	test("that we're in the testing env", () => {
		expect(process.env.NODE_ENV).toBe('testing');
	});

	describe('GET /', () => {
		it('returns with 200 status code', async () => {
			const res = await request(server).get('/api/jokes');
			expect(res.status).toBe(200);
		});

		it('returns data', async () => {
			const res = await request(server).get('/api/jokes');
			expect(res.body).toBeTruthy();
		});
	});

	describe('POST /register', () => {
		it('returns with 201 status code', async () => {
			const creds = { username: 'luke', password: 'elastic-cat' };
			const res = await request(server).post('/api/auth/register').send(creds);

			expect(res.status).toBe(201);
		});

		it('returns user info with id', async () => {
			const creds = { username: 'luke', password: 'elastic-cat' };
			const res = await request(server).post('/api/auth/register').send(creds);

			expect(res.body).toHaveProperty('id');
		});
	});

	describe('POST /login', () => {
		const creds = { username: 'luke', password: 'elastic-cat' };
		
		beforeEach(async () => {
			await request(server).post('/api/auth/register').send(creds);
		});

		it('return with 200 status code', async () => {
			const res = await request(server).post('/api/auth/login').send(creds);

			expect(res.status).toBe(200);
			expect(res.body.token).toBeDefined();
		});

		it('fails if username or password missing', async () => {
			const creds = { username: '', password: 'elastic-cat' };
			const res = await request(server).post('/api/auth/login').send(creds);

			expect(res.status).toBe(422);
			expect(res.body).toBe('username and password required')
		});

	});
});
