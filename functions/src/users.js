import jwt from 'jsonwebtoken' 
import { db } from './dbConnect.js'
import { hash } from 'bcrypt'
import { ObjectId } from 'mongodb'


const coll = db.collection('users')

export async function signup(req, res) {
  const {email, password } = req.body 
  // TODO: HASH password
  const hashedPassword = await hash(password, salt)
  await coll.insertOne({ email: email.toLowerCase(), password: hashedPassword })
  // not checking if email already exists or doing any validation
  login(req, res)

}

export async function login(req, res) {
  const { email, password } = req.body
  const hashedPassword = await hash(password, salt)
  let user = await coll.findOne({ email: email.toLowerCase(), password: hashedPassword})
  if(!user) {
    res.status(401).send({ message: 'Invalid email or password'})
    return
  }
  delete user.password // strip out password
  const token = jwt.sign(user, secret) // ENCODE JWT
  res.send({ user, token })
}

// TODO: getProfile
export async function getProfile(req, res) {
const user = await coll.findOne({_id: new ObjectId(req.decodedToken._id) })
  res.send({ user })
}

//TODO: editProfile
export async function updateProfile(req, res){
  await coll.updateOne(
    { _id: new ObjectId(req.param.uid)}, // obj to update
  { $set: req.body}) // new obj to put in doc
  res.status(202).send ({ message: 'User profile updated', success: true })

}