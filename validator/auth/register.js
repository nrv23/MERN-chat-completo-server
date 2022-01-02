const { body } = require("express-validator");

const rulesRegister = (()=> {

    return [
        body("firstName").notEmpty(),
        body("lastName").notEmpty(),
        body("gender").notEmpty(),
        body("email").isEmail(),
        body("password").isLength({min: 6}),
    ]
})()

module.exports = rulesRegister;