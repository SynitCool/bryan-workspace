const mongoose = require('mongoose')

const importantImageSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String
})

module.exports = mongoose.model("important_images", importantImageSchema)