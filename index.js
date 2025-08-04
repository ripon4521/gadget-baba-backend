const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(express.json());

const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Cloudinary config
cloudinary.config({
  cloud_name: "dpy7b0pzi",
  api_key: "322116617444728",
  api_secret: "Aaa-DCcHuL3g-IoOwfS14kwERMM",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// ✅ Cached DB connection setup
const uri = `mongodb+srv://rechargeDB:usAPIL8MCWvy4zY2@cluster0.xm8ksdz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  await client.connect();
  cachedDb = client.db("HarbalShopDB");
  return cachedDb;
}

// 👇 Routes
app.get("/website-data", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const websiteDataCollection = db.collection("websiteData");

    const existingWebsiteData = await websiteDataCollection.findOne({});
    if (!existingWebsiteData) {
      const initialWebsiteData = {
        // ⚠️ Same data you had — shortened here for clarity
        header: {
          logo: "https://placehold.co/150x50/E53E3E/FFFFFF?text=RAMISHA+LOGO",
          mainHeading: "একটানা ১২০ ঘন্টা চার্জ সুবিধা...",
          ctaButtonText: "অর্ডার করতে চাই",
        },
        features: [],
        priceNotification: {},
        videos: [],
        previewImages: [],
        contact: {},
        orderForm: {},
        footer: {},
      };
      await websiteDataCollection.insertOne(initialWebsiteData);
      console.log("Initial website data inserted.");
      return res.send(initialWebsiteData);
    }

    res.send(existingWebsiteData);
  } catch (error) {
    console.error("Error fetching website data:", error);
    res.status(500).send({ message: "Error fetching website data" });
  }
});

app.patch("/website-data/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }
  try {
    const db = await connectToDatabase();
    const websiteDataCollection = db.collection("websiteData");
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

app.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "কোনো ফাইল আপলোড করা হয়নি।" });
    }
    const resourceType = req.file.mimetype.startsWith("image/") ? "image" : "video";
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "ramisha_telecom",
        resource_type: resourceType,
        max_bytes: 20 * 1024 * 1024,
      }
    );
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("ফাইল আপলোড করতে ত্রুটি:", error);
    res.status(500).json({ message: "ফাইল আপলোড করতে ব্যর্থ হয়েছে।", error: error.message });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const ordersCollection = db.collection("orders");
    const orders = await ordersCollection.find({}).toArray();
    res.send(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({ message: "Error fetching orders" });
  }
});

app.post("/orders", async (req, res) => {
  const order = req.body;
  order.createdAt = new Date();
  order.status = order.status || "pending";
  try {
    const db = await connectToDatabase();
    const ordersCollection = db.collection("orders");
    const result = await ordersCollection.insertOne(order);
    res.status(201).send(result);
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).send({ message: "Error adding order" });
  }
});

app.patch("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid order ID format" });
  }
  try {
    const db = await connectToDatabase();
    const ordersCollection = db.collection("orders");
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

app.delete("/orders/:id", async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid order ID format" });
  }
  try {
    const db = await connectToDatabase();
    const ordersCollection = db.collection("orders");
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

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Harbal Shop Server");
});

// Export for Vercel
module.exports = app;

// Local development only
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Harbal Shop Server listening on port ${port}`);
  });
}
