const { Router } = require("express");
const router = Router();

module.exports = () => {

    router.get('/login');
    router.get('/home');

    return router;
}