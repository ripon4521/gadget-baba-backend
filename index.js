


const express = require('express')
require('dotenv').config()

const app = express()

const cors = require('cors')
const port = process.env.PORT ||5000;

app.use(cors());
app.use(express.json())







const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb');
const uri = `mongodb+srv://rechargeDB:usAPIL8MCWvy4zY2@cluster0.xm8ksdz.mongodb.net/?retryWrites=true&w=majority`;
// mongodb+srv://<username>:<password>@cluster0.b1mistq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const ordersCollections = client.db('HarbalShopDB').collection("polls");


    app.post('/polls/create-polls', async (req, res) => {
      const { expiresIn } = req.body;
  
      let expireTime;
      if (expiresIn === "1h") expireTime = 1 * 60 * 60;       // 1 hour in seconds
      else if (expiresIn === "12h") expireTime = 12 * 60 * 60; // 12 hours in seconds
      else if (expiresIn === "24h") expireTime = 24 * 60 * 60; // 24 hours in seconds
      else expireTime = 24 * 60 * 60; // Default to 24 hours if invalid input
  
      const data = {
          ...req.body,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + expireTime * 1000), // Set expire time
      };
  
      const result = await ordersCollections.insertOne(data);
      res.send(result);
  });
  

  app.get('/polls', async (req, res) => {
    const currentTime = new Date();
    const result = ordersCollections.find();
    const data = await result.toArray();
    res.send(data);
});

app.patch("/polls/:id", async (req, res) => {
  const { id } = req.params; // Get the product ID from the URL parameters
  const data = req.body; 
  console.log(data)

  // Validate if the provided ID is a valid MongoDB ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid product ID format" });
  }

  try {
    // Log the incoming request for debugging
    console.log("Attempting to update product with ID:", id);
    console.log("Product Data:", data);

    // Use updateOne to update the product
    const result = await ordersCollections.updateOne(
      { _id: new ObjectId(id) }, // Find the product by its MongoDB ObjectId
      { $set: data } // Use $set to update only the provided fields
    );

    // Check if the product was found and updated
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .send({ message: "Product not found or no changes made" });
    }

    // Send a success response
    res.status(200).send({ message: "Successfully updated product" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ message: "Error updating product" });
  }
});







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}






run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Welcome to Harbel Shop Server')

})

app.listen(port, () => {
  console.log(`Harbel Shop Server listening on port ${port}`)
})