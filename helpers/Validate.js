const { validationResult } = require("express-validator")



const valudateData = (req,res,next) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            data: {
                errors: errors.array()
            }
        })
    }

    console.log("pasó")
    return next();
}

module.exports = {
    valudateData 
}