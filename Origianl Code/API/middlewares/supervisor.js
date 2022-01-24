require('dotenv').config();
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const userManager = require('../managers/user');

module.exports = async (req, res, next) => {
    const token = req.header(config.tokenName);
    if (!token)
        return res.status(401).send(`Access denied. Invalid token provided.`);

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        const user = await userManager.getById(decoded.userId);
        if(user.type !== 1)
            return res.status(400).send(`Access denied. Only superusers are allowed to do this action.`);

        req.tokenData = decoded;
        next();
    } catch (ex) {
        return res.status(400).send(`Access denied. No token provided.`);
    }
}