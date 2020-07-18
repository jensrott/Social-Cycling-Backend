const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

require("dotenv").config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                res.status(403).send({ auth: false, message: 'Token is invalid' })
            } // else put user object in req.user
            req.user = user;
            next();
        })

    } else {
        res.status(401).send({ auth: false, message: 'You are not allowed to see this route' })
    }
}

module.exports = verifyToken;