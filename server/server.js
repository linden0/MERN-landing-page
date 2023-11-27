const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });


const app = express();
app.use(express.json());
app.use(cors({
  origin: [process.env.ENVIRONMENT === "production" ? process.env.PROD_CLIENT_URL : process.env.DEV_CLIENT_URL],
  credentials: true,
}));

// get driver connection
const dbo = require("./database/connection");

const port = process.env.PORT || 5000;


app.post("/collect-email", async (req, res) => {
  // get email from request body
  const email = req.body.email;
  // get database instance
  const dbConnect = dbo.getDb();
  const collection = dbConnect.collection("users");
  // find user
  const user = await collection.findOne({email: email});
  if (user) {
    res.status(400).json({ success: false, message: "User already exists" });
    return;
  }
  // insert user into database
  await collection.insertOne({email: email});
  res.status(200).json({ success: true, message: "User added to database" });



});

app.listen(port, () => {
  
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });

  console.log(`Server is running on port: ${port}`);
});