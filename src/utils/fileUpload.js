import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been uploaded successfully

    console.log(`file is uploaded on cloudinary `, response.url);
    const fsunlik = fs.unlinkSync(localFilePath)

    console.log("fsunlik", fsunlik)

    return response;
  } catch (error) {
    console.log(`error while uploading on cloudinary `, error)
    fs.unlinkSync(localFilePath) //remove the locally saved file as the upload operation got failed
    return null
  }
};


export {uploadOnCloudinary}