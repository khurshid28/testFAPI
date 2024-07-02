
const {
    InternalServerError,
    AuthorizationError,
} = require("../utils/errors.js");

const PDFDocument = require('pdfkit');
const fs = require('fs');


class CreatePDF {

    async create(req, res, next) {
        try {
            let { text, user_id } = req.body;
            let date = new Date().toJSON();
            let PdfPath = "/home/premium1/premium-pay-backend/public/pdfs/"+user_id+ date+ ".pdf";
            let PdfUrl= "https://premiumpayapi.uz/static/pdfs/"+ user_id + date+".pdf";
            
            const doc = new PDFDocument({ size: 'A5' });
            doc.text(text)
            doc.pipe(fs.createWriteStream(PdfPath));
            doc.end();
            
            res.status(200).json({
                "doc_url": PdfUrl
            });
        } catch (error) {
            return next(new InternalServerError(500,  error));
        }
    }

}

module.exports = new CreatePDF();


