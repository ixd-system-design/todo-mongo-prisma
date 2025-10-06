import mongoose from 'mongoose'

// This is a mongoose Schema that defines what a TODO item should look like
// Mongoose uses it to enforce a consistent document structure in MongoDB
// It's a bit like having a template for cookies, so they all have a similar shape
// See also: https://mongoosejs.com/docs/guide.html
const todoSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

// Elsewhere in our app we can make use of the schema 
// by referring to the Todo model. 
export default  mongoose.model('Todo',todoSchema);