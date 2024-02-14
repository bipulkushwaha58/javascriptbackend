import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/FileUpload.js";
import { upload } from "../middlewares/multer.middleware.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
 
  const videos = await Video.find({}).sort({[sortBy]: -1}).limit(limit)

  return res
         .status(200)
         .json(new ApiResponse(200,videos,"video list fetched successfully"))

});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const videoFileLocalPath = req?.files.videoFile[0].path;
  const thumbnailLoaclPath = req?.files.thumbnail[0].path;
  if (!videoFileLocalPath) {
    throw new ApiError(404, "Video is required");
  }
  if (!thumbnailLoaclPath) {
    throw new ApiError(404, "Video is required");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLoaclPath);
  const owner = req.user; //it will come from verifyJWT middleware.

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videoFile.duration,
    owner,
  });
  //no need to find video in db, if there will any error while creating video document in db it should trow error, in case of error below code will not execute.
  return res
    .status(201)
    .json(new ApiResponse(201, video, "video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
 try {
   let video = await Video.findById(videoId)
   if(!video){
    throw new ApiError(501, "video not found")
   }
   return res
          .status(201)
          .json(new ApiResponse(200,video, "video fetched successfully"))
 } catch (error) {
  throw error
 }

});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const {title,description,thumbnail} = req.body
  //TODO: update video details like title, description, thumbnail
  if(!(title||description||thumbnail)){
    throw new ApiError(400,"bad request, inorder to update document title or description or thumnail is required" )
  }
  try {

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $set:{
          title,
        }
      },
      {
        new: true  // this will return updated document
      }
    )
    return res
           .status(200)
           .json(new ApiResponse(200, updatedVideo ,"video updated successfully"))
    
  } catch (error) {
    throw error
  }

});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  try {
    const deletedVideo = await Video.findByIdAndDelete(
      videoId,
      {
        new: true
      }
      )

      if(deletedVideo==null){
        throw new ApiError(403, "video not found")
      }

      return res
            .status(200)
            .json(new ApiResponse(200,{},"video deleted successfully!"))

    
  } catch (error) {
     throw error
  }

});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { isPublished } = req.body
  console.log("isPublished===>", req.body)
  try {
    const publishFlag = await Video.findByIdAndUpdate(
      videoId,
      {
       $set:{
        isPublished
       } 
      },
      {
        new: true
      }
    )

    return res
          .status(200)
          .json( new ApiResponse(200,publishFlag,"video publish status updated successfully"))
    
  } catch (error) {
    throw error
    
  }

});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
