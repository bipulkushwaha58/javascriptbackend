import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { _id: subscriberId } = req.user;
  // TODO: toggle subscription

  try {
    const userSubscriptionDocument = await User.aggregate([              //Since you need to query more than one collection, you can use MongoDB's aggregation.
      {
        $match: { _id: new mongoose.Types.ObjectId(req.user._id) },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $addFields: {
          // subscribedTo: {
          //   $arrayElemAt: ["$subscribedTo",0]
          // },
          // subscribers: {
          //   $arrayElemAt:["$subscribers",0]
          // },
          subscriberCount: {
            $size: "$subscribers",
          },
          isSubscribed: {
            $cond: {
              if: {
                $in: [
                  new mongoose.Types.ObjectId(channelId),
                  "$subscribedTo.channel",
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
    ]);

    if (userSubscriptionDocument[0].isSubscribed) {
      throw new ApiError(400, "already subscribed");
    }
    const subscriber = await User.findById(subscriberId);
    const channel = await User.findById(channelId);
    if (!(subscriber && channel)) {
      throw new ApiError(
        500,
        "something went wrong while fetching subscriber or channel"
      );
    }
    const subscription = await Subscription.create({
      subscriber,
      channel,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          subscription,
          "subscription document created successfully"
        )
      );
  } catch (error) {
    throw error;
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberListOfChannel = await Subscription.find( {channel: {_id : new mongoose.Types.ObjectId(channelId)}})

  // const subscriberListOfChannel = await Subscription.aggregate(
  //   [
  //     {
  //       $match: { channel: new mongoose.Types.ObjectId(channelId) },
  //     },
  //     {
  //       $lookup:{
  //         from: "users",
  //         localField: "channel",
  //         foreignField: "_id",
  //         as: "subscribers"
  //       }
  //     }
  //   ]
  // )

  console.log("subscriberListOfChannel======>>", subscriberListOfChannel)



});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
