const { Router } = require("express");
const router = Router();
const { login,register,getCurrentUser,updateUserProfile } = require("../controller/UserController");
const { valudateData } = require("../helpers/Validate");
const rulesRegister = require("../validator/auth/register");
const rulesLogin = require("../validator/auth/login");
const { validarJWT } = require("../middleware/validateToken");
const rulesUser = require("../validator/user/user");
const {imageProfile} = require("../middleware/fileUpload");


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

    router.put('/update-user',
        [
            validarJWT,
            imageProfile,
            rulesUser,
            valudateData,
        ],
        updateUserProfile
    )

    return router;
}