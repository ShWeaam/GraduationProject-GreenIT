const jwt = require('jsonwebtoken');
const config = require('../config.json');
require('dotenv').config();

// middleware to validate the user's JWT token
module.exports = (req, res, next) => {
    //get token from request headers
    const token = req.header(config.tokenName);
    if (!token)
        return res.status(401).send(`Access denied. Invalid token provided.`);

    try {
        // decode token with JWT private key we have in .env file
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        // setting token data to the request
        req.tokenData = decoded;
        next();
    } catch (ex) {
        return res.status(400).send(`Access denied. No token provided.`);
    }
}