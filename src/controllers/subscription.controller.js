import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { id: subscriberId } = req.user;
  // TODO: toggle subscription
  
  try {
    // const isSubscribed = await Subscription.find(
    //     {
    //         "channel._id": channelId,               // Since i need to query more than one collection, i can use MongoDB's aggregation.
    //         "subscriber._id": subscriberId
    //     }
    //   )
    //   console.log("isSubscribed <<=======", isSubscribed)
    //   if(isSubscribed){
    //     throw new ApiError(400,"already subscribed")
    //   }
    const subscriber = await User.findById(subscriberId);
    const channel = await User.findById(channelId);
    if (!(subscriber && channel)) {
      throw new ApiError(
        500,
        "something went wrong while fetching subscriber or channel"
      );
    }
    const subscription = await Subscription.create(
        {
            subscriber,
            channel
        }
    )

    return res
            .status(201)
            .json(new ApiResponse(201,subscription,"subscription document created successfully"))

  } catch (error) {
    throw error;
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
