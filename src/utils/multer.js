import fs from 'fs'
import multer, { diskStorage } from "multer"
import { nanoid } from 'nanoid'
import path from 'path'
import { AppError } from './appError.js'

export const fileValidation = {
    image: ['image/png', 'image/jpeg'],
    file:['application/pdf', 'application/msword']
}

export const fileUploads = ({ folder, allowType = fileValidation.image }) => {
    const storage = diskStorage({
        destination:(req,file, cb) => {
            let fullPath = path.resolve(`uploads/${folder}`)
            if(!fs.existsSync(fullPath)){
                fs.mkdirSync(fullPath, { recursive:true })
            }
            cb(null, `uploads/${folder}`)
        },
        filename:(req, file, cb) => {
            cb(null, nanoid() + '-' + file.originalname)
        }
    })
    const fileFilter = (req, file, cb) => {
        if(allowType.includes(file.mimetype)){
            return cb(null, true)
        }
        cb(new AppError('Invalid file format', 400), false)
    }
    return multer({ storage, fileFilter})
}