const mongoose = require('mongoose')

const planSchema = new mongoose.Schema({
    title: String,
    plan: String,
})

module.exports = mongoose.model("plans", planSchema)