const jwt = require("jsonwebtoken");
const { appkey } = require("../config/app");

const validarJWT = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        msg: "Sesión inválida",
      });
    }

    const payload = jwt.verify(token, appkey);
    //asignar uid de usuario por si se necesita volver a generar el token
    req.user = payload;
    req.token = token;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Token inválido",
    });
  }
};

module.exports = {
  validarJWT,
};