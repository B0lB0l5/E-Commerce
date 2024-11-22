import multer, { diskStorage } from "multer"
import { AppError } from './appError.js'
import { fileValidation } from './multer.js'


export const cloudUploads = ({ allowType = fileValidation.image }={}/*=  {} to solve the error: Cannot read properties of undefined (reading 'allowType') or put {} in cloudUploads in router */) => {
    const storage = diskStorage({})
    
    const fileFilter = (req, file, cb) => {
        if(!allowType.includes(file.mimetype)){
            cb(new AppError('Invalid file format', 400), false)
        }
        cb(null, true)
    }
    return multer({ storage, fileFilter})
}