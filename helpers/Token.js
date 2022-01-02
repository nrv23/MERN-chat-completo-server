const jwt = require("jsonwebtoken");
const { appkey } = require("../config/app");

const genToken = (data) => {

    return new Promise((resolve,reject) => {

        jwt.sign(data,appkey,{
            expiresIn: '2h'
        },(err,token) => {
            
            if(err){
                return reject(err);
            }

            resolve(token);
        })
    })
}

const verifyToken =  token => {

    return new Promise(async(resolve,reject) => {

        try {
        
           const tokenVerified = await jwt.verify(token,appkey);
           resolve(tokenVerified);

        } catch (error) {
           reject(error); 
        }
    })
}

module.exports = {
    genToken,
    verifyToken
}