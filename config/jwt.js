require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d' // duréé de validité du token
};