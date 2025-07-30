const express = require('express');
require('dotenv').config();

const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Cloudinary setup (no changes here)
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Make sure these are in .env
  api_key: process.env.CLOUDINARY_API_KEY,       // For security, use environment variables
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI; // Make sure MONGODB_URI is in your .env

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const database = client.db('HarbalShopDB');
    const websiteDataCollection = database.collection("websiteData");
    const ordersCollection = database.collection("orders");

    // Initial website data insertion (no changes here)
    const existingWebsiteData = await websiteDataCollection.findOne({});
    if (!existingWebsiteData) {
      const initialWebsiteData = {
        // ... (your initial data) ...
      };
      await websiteDataCollection.insertOne(initialWebsiteData);
      console.log("Initial website data inserted.");
    }

    // --- API Routes related to Website Data ---
    app.get('/website-data', async (req, res) => {
      try {
        const data = await websiteDataCollection.findOne({});
        res.send(data);
      } catch (error) {
        console.error("Error fetching website data:", error);
        res.status(500).send({ message: "Error fetching website data" });
      }
    });

    app.patch('/website-data/:id', async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid ID format" });
      }
      try {
        const result = await websiteDataCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        if (result.modifiedCount === 0) {
          return res.status(404).send({ message: "Website data not found or no changes made" });
        }
        res.status(200).send({ message: "Website data updated successfully" });
      } catch (error) {
        console.error("Error updating website data:", error);
        res.status(500).send({ message: "Error updating website data" });
      }
    });

    // --- Cloudinary File Upload API ---
    app.post('/upload-image', upload.single('image'), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: 'কোনো ফাইল আপলোড করা হয়নি।' });
        }
        let resourceType = 'auto';
        if (req.file.mimetype.startsWith('image/')) {
          resourceType = 'image';
        } else if (req.file.mimetype.startsWith('video/')) {
          resourceType = 'video';
        }
        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
          folder: 'ramisha_telecom',
          resource_type: resourceType,
          max_bytes: 20 * 1024 * 1024
        });
        res.status(200).json({ url: result.secure_url });
      } catch (error) {
        console.error('ফাইল আপলোড করতে ত্রুটি:', error);
        res.status(500).json({ message: 'ফাইল আপলোড করতে ব্যর্থ হয়েছে।', error: error.message });
      }
    });

    // --- API Routes related to Orders ---

    // Add a new order
    app.post('/orders', async (req, res) => {
      const order = req.body;
      order.createdAt = new Date();
      order.status = order.status || 'pending';
      try {
        const result = await ordersCollection.insertOne(order);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error adding order:", error);
        res.status(500).send({ message: "Error adding order" });
      }
    });

    // Get all orders (Keep only one instance of this route)
    app.get('/orders', async (req, res) => {
      try {
        const orders = await ordersCollection.find({}).toArray();
        res.send(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send({ message: "Error fetching orders" });
      }
    });

    // Update an order (e.g., change status)
    app.patch('/orders/:id', async (req, res) => {
      const { id } = req.params;
      const updatedFields = req.body;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid order ID format" });
      }
      try {
        const result = await ordersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedFields }
        );
        if (result.modifiedCount === 0) {
          return res.status(404).send({ message: "Order not found or no changes made" });
        }
        res.status(200).send({ message: "Order updated successfully" });
      } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).send({ message: "Error updating order" });
      }
    });

    // Delete an order
    app.delete('/orders/:id', async (req, res) => {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid order ID format" });
      }
      try {
        const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Order not found" });
        }
        res.status(200).send({ message: "Order deleted successfully" });
      } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).send({ message: "Error deleting order" });
      }
    });


    // Default route
    app.get('/', (req, res) => {
      res.send('Welcome to Harbal Shop Server');
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Start the server ONLY after database connection and routes are set up
    app.listen(port, () => {
      console.log(`Harbal Shop Server listening on port ${port}`);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); // In production, it's usually kept open
  }
}

// Call the run function to connect to DB and start server
run().catch(console.dir);
