const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorResponse('Unauthorized to access this route, please login', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.APPSETTING_JWT_ACCESS_SECRET);
        if (!decoded.id) {
            return next(new ErrorResponse('Token verification failed. Authorization denied.', 401));
        }

        const user = await User.findById(decoded.id);
        if(!user) {
            return next(new ErrorResponse('User not found with this id', 404));
        }

        req.user = user;

        next();
    } catch (err) {
        next(err);
    }
};