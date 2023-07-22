import { MongoClient } from "mongodb"
import { mongoURI } from "../cred.js"

const connection = new MongoClient(mongoURI)

await connection.connect()

export const db = connection.db('Pocket-binder')
