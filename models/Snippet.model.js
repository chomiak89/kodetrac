const { Schema, model } = require("mongoose");

const snippetSchema = new Schema({
  name: {
    type: String,
    requires: true,
  },
  sid: {
    type: String,
    required: true,
  },
  label: String,
  code: String,
  lang: String,
  uid: Schema.Types.ObjectId,
});

const Snippet = model("Snippet", snippetSchema);

module.exports = Snippet;
