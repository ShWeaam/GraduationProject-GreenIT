const mongoose = require("mongoose");
const {isEmail} = require('validator');

// the metrics model schema for db
const schema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    water:  {type: Number, require: false, default: 0},
    electricity:  {type: Number, require: false, default: 0},
    gas:  {type: Number, require: false, default: 0},
    paper:  {type: Number, require: false, default: 0},
    disposables:  {type: Number, require: false, default: 0},
    date: {type: Date, require: true, default: Date.now()}
});

const Metric = mongoose.model("Metric", schema);

module.exports = Metric;
