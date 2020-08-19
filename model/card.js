const {
    Schema,
    model
} = require('mongoose')

const cardSheme = new Schema({
    Title: String,
    Content: String,
    Tag: String,
    Date: String,
    User: String
})

module.exports = model('Card', cardSheme)