import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; //install using npm mongoose-aggregate-paginate-v2

//The mongoose-aggregate-paginate-v2 plugin allows you to perform pagination on aggregation queries.
// This is particularly useful when you need to handle large datasets and want to fetch data in chunks (pages) rather than all at once.

//here is not required to render all the data as once
//so we do it by pages using mongoose-aggregate-paginate-v2
const videoSchema = new Schema(
  {
    videoFile: {
      type: String, //cloudinary url
      required: true,
    },
    thumbnail: {
      type: String, //cloudinary url
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//added plugin (mongooseAggregatePaginate) to videoSchema

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);

// import { Video } from "../models/video.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// const getAllVideos = asyncHandler(async (req, res) => {
//     const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

//     const aggregateQuery = [
//         { $match: { isPublished: true } },
//         { $sort: { [sortBy]: sortType === "desc" ? -1 : 1 } },
//         { $lookup: { from: "users", localField: "owner", foreignField: "_id", as: "ownerDetails" } },
//         { $unwind: "$ownerDetails" },
//         { $project: { title: 1, description: 1, thumbnail: 1, views: 1, owner: "$ownerDetails.username" } }
//     ];

//     const options = {
//         page: parseInt(page, 10),
//         limit: parseInt(limit, 10)
//     };

//     const result = await Video.aggregatePaginate(Video.aggregate(aggregateQuery), options);
// -----> using the aggregatePaginate method of the Video model to paginate the results of the aggregation query.

//     res.status(200).json(result);
// });

// export { getAllVideos };
