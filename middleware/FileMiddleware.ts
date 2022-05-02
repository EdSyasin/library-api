import multer from 'multer';

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'storage/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const fieldsWithTypes: {[key: string]: string[]} = {
    book: ['application/epub+zip', 'application/pdf', 'application/fb2'],
    cover: ['image/png', 'image/jpg', 'image/jpeg']
}

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: (error: any, success: boolean) => void) => {
    const types = fieldsWithTypes[file.fieldname];
    if (types && types.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }

};


export default multer({storage, fileFilter});
