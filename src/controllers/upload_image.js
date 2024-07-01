const { use } = require("../routes/uploadImage.js");
const {
    InternalServerError
} = require("../utils/errors.js");
class UploadImage {
    
 
    async upload(req, res, next) {
        try {
            const {user_id} = req.body;
          
            res.status(200).json({
                 user_id,
            
            });
        } catch (error) {
            console.log(error.message)
            return next(new InternalServerError(500,  error));
        }
    }

}

module.exports = new UploadImage();