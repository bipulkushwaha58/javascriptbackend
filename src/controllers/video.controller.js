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
.json(new ApiResponse(201,video, "video uploaded successfully"))
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
