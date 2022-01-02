const bcrypt = require("bcrypt");




const encryptPass = (pass,salt) => {

    return new Promise((resolve,reject) => {
            bcrypt.hash(pass,salt,(err,hash) => {
            if(err) {
                return reject(err)
            }

            resolve(hash);
        })
    })
}


const comparePass =  (hash,pass) => {

    return new Promise((resolve,reject) => {

        bcrypt.compare(pass,hash,(err,data) => {
            if(err) {
                return reject(err)
            }

            resolve(data);

        })
    })
}

module.exports = {
    encryptPass,
    comparePass
}