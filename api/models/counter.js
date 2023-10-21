const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const CounterSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    count: {
        type: Number,
        required: false
    }
});

const Counter = mongoose.model("Counter", CounterSchema)

module.exports = Counter;