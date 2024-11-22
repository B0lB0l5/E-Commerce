import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve("./config/.env") });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
export default cloudinary

// export const deleteCloudImage = async (public_id) => {
//   await cloudinary.uploader.destroy(public_id)
// }

export const deleteCloudImage = async (public_id) => {
  if (Array.isArray(public_id)) {
    // If it's an array, loop through and delete each image
    for (const id of public_id) {
      await cloudinary.uploader.destroy(id);
    }
  } else {
    // If it's a single public_id (string), delete it directly
    await cloudinary.uploader.destroy(public_id);
  }
};