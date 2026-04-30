/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();

// Request ID middleware
app.use((req, res, next) => {
	const id = req.headers['x-request-id'] || uuidv4();
	req.id = id;
	res.setHeader('X-Request-Id', id);
	next();
});

app.get('/', (req, res) => {
	res.send('Hello remote world!\n');
});

if (require.main === module) {
	app.listen(PORT, HOST);
	console.log(`Running on http://${HOST}:${PORT}`);
}

module.exports = app;