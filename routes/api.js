// Below we will use the Express Router to define a series of API endpoints.
// Express will listen for API requests and respond accordingly
import express from 'express'
const router = express.Router()

// Prisma lets NodeJS communicate with MongoDB
// Let's import and initialize the Prisma client
// See also: https://www.prisma.io/docs
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// === API Structure ===
// Below, you'll notice the use of HTTP Verbs (POST, GET, PUT, DELETE)
// These verbs map nicely onto database CRUD operations (Create Read Update Delete) 

// Listen for POST requests
// respond by CREATEing a new todo in MongoDB
// This is the 'C' of CRUD
// After saving data in MongoDB we send the TODO back to the frontend.
router.post('/todo', async (req, res) => {
  try {
    console.log(req.body)
    const todo = await prisma.todo.create({
      data: req.body
    })
    res.send(todo)
  } catch (err) {
    res.status(500).send(err)
  }
})

// listen for GET requests
// respond by READing a list of todos from MongoDB 
// This is the 'R' of CRUD
// After querying MongoDB we send an array of TODOS  to the frontend.
router.get('/todos', async (req, res) => {
  try {
    // The filter below is blank, but we could adjust it
    // see also: https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting
    const todos = await prisma.todo.findMany({
      where: {},  // empty filter for all records
      orderBy: { date: 'desc' }  // Sort by date with the newest first
    })
    res.send(todos)
  } catch (err) {
    res.status(500).send(err)
  }
})

// Listen for PUT requests
// respond by updating a particular todo in MongoDB
// This is the 'U' of CRUD
// After updating MongoDB we send the updated TODO back to the frontend.
router.put('/todo/:id', async (req, res) => {
  try {
    // Prisma update returns the updated version by default
    const todo = await prisma.todo.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.send(todo)
  } catch (err) {
    res.status(500).send(err)
  }
})

// Listen for DELETE requests
// respond by DELETing a particular todo in MongoDB
// This is the 'D' of CRUD
router.delete('/todo/:id', async (req, res) => {
  try {
    const result = await prisma.todo.delete({
      where: { id: req.params.id }
    })
    res.send(result)
  } catch (err) {
    res.status(500).send(err)
  }
})

// export the api routes for use elsewhere in our app 
// (e.g. in index.js )
export default router;

