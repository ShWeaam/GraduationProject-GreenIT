const bcrypt = require('bcryptjs');

// methods to encrypt password and match it
module.exports = {
    hash: async pass => {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(pass, salt);
        return hashed;
    },
    compare: async (pass, hashedPassword) => {
        const result = await bcrypt.compare(pass, hashedPassword);
        return result;
    }
}