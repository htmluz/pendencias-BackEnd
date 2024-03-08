const Counter = require("../models/counter");

async function getNextId() {
  const counter = await Counter.findOneAndUpdate(
    { name: "contador" },
    { $inc: { count: 1 } },
    { new: true }
  );
  return counter.count;
}

module.exports = getNextId;
