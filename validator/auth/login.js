const { body } = require("express-validator");

const rulesLogin = (()=> {

    return [
        body("email").isEmail(),
        body("password").isLength({min: 6}),
    ]
})()

module.exports = rulesLogin;