'use strict';

const assert = require('assert');
const supertest = require('supertest');
const { app, checkDatabase, setDbChecker } = require('../server');

describe('GET /health', () => {
	afterEach(() => {
		// Restore the real database checker after each test
		setDbChecker(checkDatabase);
	});

	it('returns 200 with status ok when database is healthy', async () => {
		const res = await supertest(app).get('/health');
		assert.strictEqual(res.status, 200);
		assert.strictEqual(res.body.status, 'ok');
		assert.ok(res.body.timestamp, 'timestamp should be present');
		assert.ok(!isNaN(Date.parse(res.body.timestamp)), 'timestamp should be a valid ISO-8601 date');
		assert.deepStrictEqual(res.body.checks, { database: 'ok' });
	});

	it('returns 503 with status degraded when database check fails', async () => {
		setDbChecker(() => false);
		const res = await supertest(app).get('/health');
		assert.strictEqual(res.status, 503);
		assert.strictEqual(res.body.status, 'degraded');
		assert.ok(res.body.timestamp, 'timestamp should be present');
		assert.ok(!isNaN(Date.parse(res.body.timestamp)), 'timestamp should be a valid ISO-8601 date');
		assert.deepStrictEqual(res.body.checks, { database: 'fail' });
	});
});
