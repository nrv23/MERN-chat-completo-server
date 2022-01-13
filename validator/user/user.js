const { body } = require("express-validator");

const rulesUser = (()=> {

    return [
        body("firstName").notEmpty(),
        body("lastName").notEmpty(),
        body("gender").notEmpty(),
        body("email").isEmail(),
        body("password").optional().isLength({min: 6}), // valor opcional para password
    ]
})()

module.exports = rulesUser;