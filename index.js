const express = require("express");
require("dotenv").config(); 
const app = express();
const cors = require("cors");
const port = 5000; 

app.use(cors()); 
app.use(express.json()); 


const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dpy7b0pzi",
  api_key: "322116617444728",
  api_secret: "Aaa-DCcHuL3g-IoOwfS14kwERMM",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://rechargeDB:usAPIL8MCWvy4zY2@cluster0.xm8ksdz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Define the database and collections
    const database = client.db("HarbalShopDB");
    const websiteDataCollection = database.collection("websiteData"); // Collection for website data
    const ordersCollection = database.collection("orders"); // Collection for orders

    // Insert initial website data if the collection is empty
    const existingWebsiteData = await websiteDataCollection.findOne({});
    if (!existingWebsiteData) {
      const initialWebsiteData = {
        header: {
          logo: "https://placehold.co/150x50/E53E3E/FFFFFF?text=RAMISHA+LOGO", // Placeholder Cloudinary-like URL
          mainHeading:
            "একটানা ১২০ ঘন্টা চার্জ সুবিধা। ৫ টি ভয়েস চেঞ্জ সুবিধা। সাথে থাকছে সম্পূর্ণ ফ্রি ডেলিভারি। 🔥",
          ctaButtonText: "অর্ডার করতে চাই",
        },
        features: [
          {
            heading: "এক চার্জে চলবে টানা ১২০ ঘন্টা ও ৫ টি ভয়েস চেঞ্জ মুড",
            ctaButtonText: "এখনই অর্ডার করুন",
            listItems: [
              "১২০ ঘন্টা ব্যাটারি ব্যাকআপে অডিও অভিজ্ঞতা নতুন উচ্চতায়।",
              "5 Voice Changer – ভিন্ন ভিন্ন ভয়েস চেঞ্জ সুবিধা ।",
              "120 ঘণ্টা টক টাইম এবং 60 ঘণ্টা মিউজিক প্লেব্যাক।",
              "ENC on off option. ",
              " Bluetooth 5.3 + Touch Control – সুপার ফাস্ট কানেকশন।",
              "Type-C ফাস্ট চার্জিং – মাত্র 2.5 ঘণ্টায় ফুল চার্জ।",
              "Sweatproof & Comfortable Fit – স্পোর্টস এবং দীর্ঘ সময় ব্যবহারের জন্য পারফেক্ট ও হালকা ভিজে যাওয়া অথবা ঘেমে গেলেও সমস্যা হবে না। ",
              "15M Transmission Range – মেটাল ইয়ারবাডের সাথে শক্তিশালী কানেক্টিভিটি।",
              " ইনকামিং ভাইব্রেটর - কল আসলে সহজেই বুঝতে পারবেন।",
              " বিল্ড কোয়ালিটি মাশাল্লাহ খুবি চমৎকার। ",
              " ৬০০ এম এইচ এর বিশাল ব্যাটারি৷ ",
              "১০০% অরিজিনাল ও কোয়ালিটিফুল প্রোডাক্ট।",
            ],
            image:
              "https://placehold.co/400x300/E53E3E/FFFFFF?text=PRODUCT+IMAGE+1", // Placeholder Cloudinary-like URL
          },
          {
            heading: "DON BT-300 সম্পর্কে কিছু কথা",
            ctaButtonText: "এখনই অর্ডার করুন",
            listItems: [
              "১২০ ঘন্টা চার্জিং বেকআপ।",
              "৫ টি ভয়েস চেঞ্জ মুড।",
              "চমৎকার মিউজিক ও বেস",
              "সাত দিনের রিপ্লেসমেন্ট গ্যারান্টি",
            ],
            image:
              "https://placehold.co/400x300/E53E3E/FFFFFF?text=PRODUCT+IMAGE+2", // Placeholder Cloudinary-like URL
          },
        ],
        priceNotification: {
          text: "⚠️ রেগুলার প্রাইস ১৫৫০ টাকা। এখন অফার মূল্য ৯৪৯ টাকা। ",
          deliveryInfo: "সারা বাংলাদেশে ফ্রি ডেলিভারি 🚚",
        },
        videos: [
          "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder video URL
          "https://www.w3schools.com/html/movie.mp4", // Placeholder video URL
        ],
        previewImages: [
          "https://placehold.co/600x400/E53E3E/FFFFFF?text=PREVIEW+1", // Placeholder Cloudinary-like URL
          "https://placehold.co/600x400/E53E3E/FFFFFF?text=PREVIEW+2", // Placeholder Cloudinary-like URL
          "https://placehold.co/600x400/E53E3E/FFFFFF?text=PREVIEW+3", // Placeholder Cloudinary-like URL
        ],
        contact: {
          heading: "আমাদের সাথে যুক্ত হোন",
          description: "ফ্রি ডেলিভারির সুবিধা নিতে এখনই অর্ডার দিন।",
          helplineNumber: "+8801855844693",
          callButtonText: "📞 কল করুন",
        },
        orderForm: {
          title: "অর্ডার করতে নিচের ফর্মটি পূরণ করুন",
          offerTxt: "সারা বাংলাদেশে ফ্রি ডেলিভারি 🚚",
          productName: "DON BT - 300",
          price: "রেগুলার প্রাইস ১৫৫০ টাকা। এখন অফার মূল্য ৯৪৯ টাকা।",
          placeOrderButtonText: " Place Order ৳949.00",
        },
        footer: {
          copyright: "Copyright &copy; 2025 Gadget Baba Online |",
          builtByText: "Built with ❤️ by ",
          agencyName: "Notex",
          agencyLink: "https://notexagency.vercel.app/",
        },
      };
      await websiteDataCollection.insertOne(initialWebsiteData);
      console.log("Initial website data inserted.");
    }

    // --- API Routes related to Website Data ---

    // Get all website data
    app.get("/website-data", async (req, res) => {
      try {
        const data = await websiteDataCollection.findOne({}); 
        res.send(data);
      } catch (error) {
        console.error("Error fetching website data:", error);
        res.status(500).send({ message: "Error fetching website data" });
      }
    });

    // Update website data
    app.patch("/website-data/:id", async (req, res) => {
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
          return res
            .status(404)
            .send({ message: "Website data not found or no changes made" });
        }
        res.status(200).send({ message: "Website data updated successfully" });
      } catch (error) {
        console.error("Error updating website data:", error);
        res.status(500).send({ message: "Error updating website data" });
      }
    });

    // --- Cloudinary File Upload API ---
    app.post("/upload-image", upload.single("image"), async (req, res) => {
      try {
        if (!req.file) {
          return res
            .status(400)
            .json({ message: "কোনো ফাইল আপলোড করা হয়নি।" });
        }
        let resourceType = "auto"; 
        if (req.file.mimetype.startsWith("image/")) {
          resourceType = "image";
        } else if (req.file.mimetype.startsWith("video/")) {
          resourceType = "video";
        }
        const result = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
          )}`,
          {
            folder: "ramisha_telecom", 
            resource_type: resourceType, 
            max_bytes: 20 * 1024 * 1024, 
          }
        );
        res.status(200).json({ url: result.secure_url });
      } catch (error) {
        console.error("ফাইল আপলোড করতে ত্রুটি:", error);
        res
          .status(500)
          .json({
            message: "ফাইল আপলোড করতে ব্যর্থ হয়েছে।",
            error: error.message,
          });
      }
    });


    // Get all orders
    app.get("/orders", async (req, res) => {
      try {
        const orders = await ordersCollection.find({}).toArray();
        res.send(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send({ message: "Error fetching orders" });
      }
    });
    // Add a new order
    app.post("/orders", async (req, res) => {
      const order = req.body;
      order.createdAt = new Date();
      order.status = order.status || "pending";
      try {
        const result = await ordersCollection.insertOne(order);
        res.status(201).send(result); 
      } catch (error) {
        console.error("Error adding order:", error);
        res.status(500).send({ message: "Error adding order" });
      }
    });

    // Update an order (e.g., change status)
    app.patch("/orders/:id", async (req, res) => {
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
          return res
            .status(404)
            .send({ message: "Order not found or no changes made" });
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
        const result = await ordersCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Order not found" });
        }
        res.status(200).send({ message: "Order deleted successfully" });
      } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).send({ message: "Error deleting order" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Harbal Shop Server");
});

app.listen(port, () => {
  console.log(`Harbal Shop Server listening on port ${port}`);
});
