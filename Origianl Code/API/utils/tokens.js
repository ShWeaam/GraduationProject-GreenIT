const jwt = require('jsonwebtoken');
require('dotenv').config();

// method to create JWT token from userID, we need it while login
module.exports = {
    getJwt: async userId => {
        try {
            const data = {userId};
            const token = jwt.sign(data, process.env.JWT_PRIVATE_KEY);
            return token;
        } catch (ex) {
            throw (ex);
        }
    }
};