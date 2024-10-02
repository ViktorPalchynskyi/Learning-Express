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

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const decode = jwt.decode(token, JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token is not valid' });
    }
};

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

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user) {
        return res.status(400).json({ message: 'User not found.' });
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Wrong password.' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
});

app.get('/protected', verifyToken, (req, res) => {
    res.status(200).send({ message: `Find user with name: ${req.user.username}` });
});

app.get('/users', (req, res) => res.json({ users }));

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
