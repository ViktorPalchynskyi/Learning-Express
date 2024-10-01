const app = require('express')();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const JWT_SECRET = 'some_string';
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', () => console.log('init route'));

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
