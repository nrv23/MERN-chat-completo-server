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

        delete exist.password;
        console.log(exist)
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

module.exports = {
    login,
    register,
    getCurrentUser
}