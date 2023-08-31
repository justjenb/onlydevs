const { Schema, model } = require("mongoose");

const sessionSchema = new Schema(
  {
    sid: {
      type: String,
      required: true,
      unique: true,
    },
    sess: {
      type: Schema.Types.Mixed,
      required: true,
    },
    expire: {
      type: Date,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Session = model("Session", sessionSchema);

module.exports = Session;
