const { Router } = require("express");
const router = Router();
const { login,register,getCurrentUser } = require("../controller/UserController");
const { valudateData } = require("../helpers/Validate");
const rulesRegister = require("../validator/auth/register");
const rulesLogin = require("../validator/auth/login");
const { validarJWT } = require("../middleware/validateToken");
 
module.exports = () => {

    router.post('/login',
        rulesLogin,
        valudateData,
        login
    );

    router.post('/register',
        rulesRegister,
        valudateData,
        register
    );

    router.get('/user/',
        validarJWT,
        getCurrentUser
    )

    return router;
}