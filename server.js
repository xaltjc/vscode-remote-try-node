/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const express = require('express');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// Placeholder database connectivity check
function checkDatabase() {
	return true;
}

// Allows tests to inject a different database checker
let _dbChecker = checkDatabase;

// App
const app = express();
app.get('/', (req, res) => {
	res.send('Hello remote world!\n');
});

app.get('/health', (req, res) => {
	const dbOk = _dbChecker();
	if (dbOk) {
		res.status(200).json({
			status: 'ok',
			timestamp: new Date().toISOString(),
			checks: { database: 'ok' }
		});
	} else {
		res.status(503).json({
			status: 'degraded',
			timestamp: new Date().toISOString(),
			checks: { database: 'fail' }
		});
	}
});

if (require.main === module) {
	app.listen(PORT, HOST);
	console.log(`Running on http://${HOST}:${PORT}`);
}

module.exports = { app, checkDatabase, setDbChecker: (fn) => { _dbChecker = fn; } };