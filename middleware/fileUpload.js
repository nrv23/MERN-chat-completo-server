const multer = require('multer');
const {generate} = require("shortid")

const imageProfile =  async (req,res,next  ) => {

    const configMulter = {
        limits: {fileSize : 1000000},
        storage: fileStorage = multer.diskStorage({
            destination: (req,file,cb) => {
                cb(null,__dirname+'/../uploads/user')
            },
            filename: (req,file,cb) => {
                //const ext = file.mimetype.split('/')[1];
                const ext = file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length);
                cb(null,`${generate()}${ext}`)
            }
        })
    }
    
    const upload = multer(configMulter).single("avatar");

    upload(req,res,async(error) => {
        
        if(typeof req.file === 'undefined') {
            return next();
        } else {
            console.log(error);
            if(error) {

                if( error instanceof multer.MulterError) {

                    if(error.code === 'LIMIT_FILE_SIZE'){
                        return res.status(400).json({
                            msg: 'Debe subir un archivo menos pesado'
                        })
                    } 
                } else {
                    return res.status(500).json({
                        msg: error.message
                    }) 
                }
            } else {
                return next();
            }
        }   
    })
}

module.exports = { imageProfile }