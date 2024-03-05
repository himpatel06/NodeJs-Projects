const {check} = require('express-validator');
const validation = [
    check("email","Email is invalid").isEmail(),
    check("password","Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long")
    .isLength({min:6, max:15})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)

];

module.exports = validation;