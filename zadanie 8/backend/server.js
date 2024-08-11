import express from 'express';
import bcrypt, { hash } from 'bcrypt';
import cache from 'memory-cache';
import cors from 'cors';
import 'dotenv/config'
import { generateToken } from './jwt_utils.js';

const app = express()
const port = 3000

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

let salt;

const tokenCache = new cache.Cache();

const database = new Map();

const fail = (res) => {
    res.status(401).json({
        success: false,
        message: 'username or password is incorrect.'
    })
}

app.post('/auth/signin', async (req, res) => {
    const {username, password} = req.body

    const hashedPassword = await database.get(username);
    if (!hashedPassword) {
        fail(res);
        return;
    }

    const result = await bcrypt.compare(password, hashedPassword);
    if (!result) {
        fail(res);
        return;
    }

    let token = tokenCache.get(username);

    if (!token) {
        token = generateToken(req.body);
        tokenCache.put(username, token, 3_600_000);
    }

    res.json({
        success: true,
        token
    })
});

app.post('/auth/signup', async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.status(400).json({
            message: 'Username/password not provided!'
        })
        return;
    }

    const hashedPassword = database.get(username);

    if (hashedPassword) {
        res.status(400).json({
            success: false,
            message: 'user already exists!'
        })
        return;
    }

    const hash = await bcrypt.hash(password, salt);
    database.set(username, hash);
    const token = generateToken(req.body);
    tokenCache.put(username, token, 3_600_000);

    res.json({
        success: true,
        token
    })
});

app.listen(port, async () => {
    salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash('123', salt);
    database.set('user', hash);
    console.log(`Example app listening on port ${port}`)
})