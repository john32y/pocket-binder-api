import express from 'express'
import cors from 'cors'
import { onRequest } from 'firebase-functions/v2/https'


const app = express()
app.use(cors()) // allows access from other domain
app.use(express.json()) // patch and post in json

// routes:
app.post("/signup", signup) // POST / users
app.post("/login", login) // GET / user?email

// // protected: (authenticated users only)
app.get("/profile",validToken,  getProfile)
app.patch("/profile", validToken,matchingUser, updateProfile)

export const api = onRequest(app) // send all https request to express