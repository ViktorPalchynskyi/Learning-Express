const app = require('express')();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const JWT_SECRET = 'some_string';
const PORT = 3000;
const SALT = bcrypt.genSaltSync();
const users = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const isUserExist = users.find((u) => u.username === username);

    if (isUserExist) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT);
    const newUser = {
        username,
        password: hashedPassword,
    };

    users.push(newUser);

    res.status(200).json({ message: 'User created' });
});

app.get('/users', (req, res) => res.json({ users }));

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
