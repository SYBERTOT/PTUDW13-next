const crypto = require('crypto');

const generateRandomToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

module.exports = generateRandomToken;
