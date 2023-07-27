import express from 'express'
import cors from 'cors'
import { onRequest } from 'firebase-functions/v2/https'
import { signup, login, getProfile, updateProfile, addNewitem, deleteProfile, deleteItem } from './src/users.js'


const app = express()
app.use(cors()) // allows access from other domain
app.use(express.json()) // patch and post in json

// routes:
app.post("/signup", signup) // POST / users
app.post("/login", login) // GET / user?email

// protected: (authenticated users only)
app.get("/profile/:uid",  getProfile)
app.patch("/profile", updateProfile)
app.delete("/profile/:uid", deleteProfile)

//  add & delete item
app.post("/profile", addNewitem)
app.delete("/items/:_id", deleteItem)

export const api = onRequest(app) // send all https request to express

app.get("/test", (req, res)=> {
  return(res.send("success"))
})