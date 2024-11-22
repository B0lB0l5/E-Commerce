import { deleteCloudImage } from "../utils/cloud.js"
import { deleteFile } from "../utils/file.js"

export const globalErrorHandling = async (err, req, res, next) => {
    // file system rollback
    if(req.file) {
        deleteFile(req.file.path)
    }
    // cloud rollback
    if(req.failImage){
        await deleteCloudImage(req.failImage.public_id)
    }
    if(req.failImages?.length > 0){
        for (const public_id of req.failImages) {
            await deleteCloudImage(public_id)
        }
    }
    return res.status(err.statusCode || 500).json({message: err.message, success: false, error: err.stack})
}