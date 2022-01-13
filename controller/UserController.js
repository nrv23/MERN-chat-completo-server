const User = require("../models").User
const { genToken  } = require("../helpers/Token");
const { comparePass } = require("../helpers/Password");

const login = async (req,res) => {

    try {
        
        const { 
            body: {
                email, password
            }
        } = req;

        const exist = await User.findOne({
            where: {
                email
            }
        });
        if(!exist) return res.status(404).json({msg: 'Usuario no encontrado'});
        
        const match = await comparePass(exist.password,password);

        if(!match) return res.status(422).json({
            msg: 'Email y/o password incorrectos'
        });

        delete exist.dataValues.password;

        const token = await genToken(exist.dataValues);

        res.status(200).json({
            user: exist,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hubo un error al autenticar el usuario'
        })
    }
}


const register = async (req,res) => {

    try {

        req.body.gender = (req.body.gender === "1"); //Hombre

        const newUser = await User.create(req.body);

        if(!newUser) {
            return res.status(400).json({
                msg: 'No se pudo agregar el usuario'
            });
        }

        delete newUser.dataValues.password;
        delete req.body.password;

        const token = await genToken(req.body);

        return res.status(201).json({
            user: newUser.dataValues,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hubo un error al agregar el usuario'
        })
    }

}

const getCurrentUser = async (req,res) => {

    try {

        console.log(req.user);

        const { 
            email
        } = req.user;

        const exist = await User.findOne({
            where: {
                email
            }
        });

        if(!exist) return res.status(404).json({msg: 'Usuario no encontrado'});
        
        delete exist.dataValues.password;
        
        res.status(200).json({
            user: exist,
            token: req.token
        })
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            msg: 'Hubo un error al obtener el usuario'
        })
    }   
}

const updateUserProfile = async (req,res,next) => {

    try {

        let {
            user: { id } 
        } = req;

        if(req.file) {
            req.body.avatar = req.file.filename;
        }

        if(typeof req.body.avatar !== 'undefined' && req.body.avatar.length >  0) delete req.body.avatar;
                        
        const [rows,result] = await User.update(req.body,{
            where: {
                id
            },
            returning: true,
            individualHooks: true
        })

        let newUser = result[0].get({raw: true}); // obtener el nuevo objeto

        if(!newUser) {
            return res.status(400).json({
                msg: 'No se pudo agregar el usuario'
            });
        }

        newUser.avatar = result[0].avatar;
        delete newUser.password; // no enviar el password

        return res.status(200).json({user:newUser});

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Hubo un problema al actualizar el usuario'
        })
    }
}

module.exports = {
    login,
    register,
    getCurrentUser,
    updateUserProfile
}