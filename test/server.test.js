'use strict';

const assert = require('assert');
const request = require('supertest');
const app = require('../server');

// Register a test route that exposes req.id in the response body
app.get('/test-req-id', (req, res) => {
	res.json({ id: req.id });
});

describe('Request ID middleware', () => {
	it('sets X-Request-Id response header for every request', async () => {
		const res = await request(app).get('/');
		assert.ok(res.headers['x-request-id'], 'X-Request-Id header should be present');
	});

	it('X-Request-Id header matches a UUID v4 format when not provided by client', async () => {
		const res = await request(app).get('/');
		const uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		assert.match(res.headers['x-request-id'], uuidV4Pattern);
	});

	it('preserves X-Request-Id sent by the client', async () => {
		const clientId = 'my-upstream-request-id-123';
		const res = await request(app).get('/').set('X-Request-Id', clientId);
		assert.strictEqual(res.headers['x-request-id'], clientId);
	});

	it('req.id is available in route handlers and matches the X-Request-Id response header', async () => {
		const res = await request(app).get('/test-req-id');
		assert.ok(res.body.id, 'req.id should be set in route handler');
		assert.strictEqual(res.body.id, res.headers['x-request-id']);
	});
});
