const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String, 
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    isAnswered: {
      type: Boolean,
      required: true,
    },
    answeredAt: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
