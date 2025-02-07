const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
    },
  },
  { timestamps: true }
);

// compound index [1 means asc order and -1 means desc]
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

// it is middleware called whenever connection request saved
connectionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;

  // check for self connection request
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Self Connection Request is not allowed");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
