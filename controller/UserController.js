const User = require("../models").User
const { genToken  } = require("../helpers/Token");
const { comparePass,encryptPass } = require("../helpers/Password");
const {appUrl,appPort} = require("../config/app");

const getImageProfile = (gender, avatar) => {

    let urlAvatar = '';
    let img = '';

    if(!avatar) {

        if(gender === true) {

            
            urlAvatar = 'male.svg';
            img = 'male.svg'
            
        } else {
            
            urlAvatar = 'female.sgv'
            img = 'female.sgv';
        }
    } else {


        urlAvatar = `${avatar}`;
        img = avatar;
    }

    return {urlAvatar,img};
}

const login = async (req,res) => {

    try {
        
        const { 
            body: {
                email, password
            }
        } = req;

        let exist = await User.findOne({
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

        const { 
            urlAvatar,
            img
        } = getImageProfile(exist.dataValues.gender,exist.dataValues.avatar);

        exist.dataValues.avatar = urlAvatar
        exist.dataValues.img = img;

        let obj = exist.dataValues;
        obj.img = img
        const token = await genToken(exist.dataValues);

        res.status(200).json({
            user: obj,
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

        const exist = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if(exist) return res.status(404).json({msg: 'Ya existe el usuario'});

        req.body.password = await encryptPass(req.body.password,10);

        let  newUser = await User.create(req.body);

        if(!newUser) {
            return res.status(400).json({
                msg: 'No se pudo agregar el usuario'
            });
        }
    
        delete newUser.dataValues.password;
        delete req.body.password;


        const { 
            urlAvatar,
            img
        } = getImageProfile(newUser.dataValues.gender,newUser.dataValues.avatar);

        newUser.dataValues.avatar = urlAvatar; 
        

        let obj = newUser.dataValues;
        obj.img = img;

        const token = await genToken(req.body);
        
        return res.status(201).json({
            user: obj,
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

        const { 
            email
        } = req.user;

        let exist = await User.findOne({
            where: {
                email
            }
        });

        if(!exist) return res.status(404).json({msg: 'Usuario no encontrado'});
        
        delete exist.dataValues.password;

        const { 
            urlAvatar,
            img
        } = getImageProfile(exist.dataValues.gender,exist.dataValues.avatar);

        
        exist.dataValues.avatar = urlAvatar;
        
        let obj =  exist.dataValues;
        obj.img = img;
        
        res.status(200).json({
            user: obj,
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

        const {
            body: { id } 
        } = req;



        if(req.file) {
            console.log({hola: req.file});
            req.body.avatar = req.file.filename;
        } else  {
            console.log("No")
            req.body.avatar = req.body.img;
        }
        

        if(!req.body.password || req.body.password.length === 0) delete req.body.password;
        else {

            req.body.password = await encryptPass(req.body.password,10);
        }

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
      
        const { 
            urlAvatar,
            img
        } = getImageProfile(newUser.gender,newUser.avatar);
        newUser.avatar = urlAvatar;

        let obj = newUser;
        obj.img = img;
        return res.status(200).json({user:obj});

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