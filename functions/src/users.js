import jwt from 'jsonwebtoken'
import { db } from './dbConnect.js'
import { ObjectId } from 'mongodb'


const coll = db.collection('users')

// POST
export async function signup(req, res) {
  const { email, password } = req.body
  // TODO: HASH password
  // const hashedPassword = await hash(password)
  await coll.insertOne({ email: email.toLowerCase(), password })
  // not checking if email already exists or doing any validation
  login(req, res)
  res.send(req.body) // send the request in body

}

export async function login(req, res) {
  const { email, password } = req.body
  // const hashedPassword = await hash(password)
  let user = await coll.findOne({ email: email.toLowerCase(), password })
  if (!user) {
    res.status(401).send({ message: 'Invalid email or password' })
    return
  }
  delete user.password // strip out password
  const token = jwt.sign(user, secret) // ENCODE JWT
  res.send({ user, token })
}

// TODO: getProfile
export async function getProfile(req, res) {
  const { uid } = req.params
  const allUser = await coll.find().toArray()
  const user = allUser.find(element => element._id = uid)
  res.send({ user })
}

//TODO: editProfile
export async function updateProfile(req, res) {
  await coll.updateOne(
    { _id: new ObjectId(req.param.uid) }, // obj to update
    { $set: req.body }) // new obj to put in doc
  res.status(202).send({ message: 'User profile updated', success: true })

}
//TODO: deleteProfile
export async function deleteProfile(req, res) {
  const { uid } = req.params;
  const { _id } = req.body;

  if (!uid) {
    res.status(401).send({ success: false, message: "Not a valid Request" });
    return;
  }

  await coll.doc(_id).delete();

  getProfile(req, res);
}


 // Add New Item
export async function addNewitem(req, res) {
  console.log('~~~ Adding Task ~~~~~');
  const { title, uid, item, amount } = req.body; 
  if (!title || !uid) {
      res.status(401).send({ success: false, message: 'Not a valid request' });
      return;
  }
  const addNewitem = {
      title, uid, item, amount
     
      
  }
  console.log('~~~~~~~~~~~~~~~~~~~~~~~');
  console.log('Adding Task --> ', addNewitem);
  await coll.insertOne(addNewitem)
  .catch(err => {
      res.status(500).send({ success: false, message: err });
      return;
  })
  console.log(' .... ADDED!');
  console.log('~~~~~~~~~~~~~~~~~~~~~~~');
  getProfile(req, res)
}

//Delete Item
export async function deleteItem (req, res) {
  const { _id } = req.params;
  const { uid } = req.body;
  console.log(_id)

  if (!uid) {
      res.status(401).send ({success : false, message : "Not a valid Request"});
      return;
  }

  try {
    await coll.deleteOne( { _id: new ObjectId(_id) } ); // Mongodb
    res.status(201).send({success: true, message: "Deleted Item"}) // send something back from the api
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send({ success: false, message: "An error occurred during deletion." });
  }
}

// async function deletOne(id){
//   const deletOne = await db.collection(collectName)
//   .deleteOne( { _id: new ObjectId(id) } );

//   return deletOne;
// }
