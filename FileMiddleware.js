const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'storage/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const fieldWithTypes = {
    book: ['application/epub+zip', 'application/pdf', 'application/fb2'],
    cover: ['image/png', 'image/jpg', 'image/jpeg']
}

const fileFilter = (req, file, cb) => {
    const types = fieldWithTypes[file.fieldname];
    if (types && types.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }

};


module.exports = multer({storage, fileFilter});
