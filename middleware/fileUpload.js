const multer = require("multer");
const fs = require("fs");
const path = require("path");

const getFileType = file => {

    const ext = file.mimeType.split('/');

    return ext[ext.length - 1];
}

const getFileName = (req,fiel, cb) => {

    const ext = getFileType(file);

    const filename = Date.now()+ '-'+ Math.round(Math.random() * 1E9) + '.' + ext;

    cb(null,file.fieldname +'-'+ filename); // renombrar la imagen
}

const fileFilter = (req,file,cb) => {

    const ext = getFileType(file);
    const allowedType = /jpeg|jpg|png/;
    const passed = allowedType.test(ext);
    
    if(passed) {
        return cb(null, true); // pasó la imagen
    } else {
        return cb(null, false); // no  pasó la imagen

    }
}

const imageProfile = ( (req,res,next) => {

    const storage = multer.diskStorage({

        destination: (req,file,cb) => {

            const { id } = req.user;
            
            const dest = `uploads/user/${id}`; // se crea una carpeta por cada usuario

            fs.access(dest,(err) => { // saber si una carpeta existe

                if(err) { // la carpeta no existe
                    
                    return fs.mkdir(dest, error => {
                        if(err) return cb(error, dest)
                    });

                } else { // la carpeta si existe
                    fs.readdir(dest, (error,files) => {
                        if(err) throw error 

                        for(const file of files) {

                            fs.unlink(path.join(dest,file), error => {
                                if(err) throw error 
                            })
                        }
                    })

                    return cb(null,dest); // se guardó la imagen
                }
            })
        },
        filename: getFileName,
        fileFilter
    })

    return multer({
        storage
    }).single('avatar')
})();

module.exports = imageProfile;