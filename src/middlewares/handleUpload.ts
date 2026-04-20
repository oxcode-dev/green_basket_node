import multer from "multer";
import express from "express";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log({ req })
        cb(null, 'src/uploads/avatars/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const fileMaxSize = 5 * 1024 * 1024; // 5MB

export const multerUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
    limits: { fileSize: fileMaxSize }
    
}).single("file");

export const localUpload = (req: any, res: express.Response, next: express.NextFunction) => {
    multerUpload(req, res, function (error) {
        if (error) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File too large' });
            }
            return res.status(400).json({ error: error.message });
        } 
        if (!req.file) {
            return res.status(400).json({ error: 'You must provide a file' });
        }
        next();
    });
};