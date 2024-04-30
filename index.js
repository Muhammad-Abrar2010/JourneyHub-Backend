const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MDB_USERNAME}:${process.env.MDB_PASSWORD}@cluster0.lr3sxdc.mongodb.net/?retryWrites=true&w=majority`;

async function run() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  
  const TouristSpotsCollection = client
  .db("touristsDB")
  .collection("touristsSpots");

  try {
    await client.connect();
    console.log("Connected to MongoDB");


    app.post("/TouristSpots", async (req, res) => {
      try {
        const newTouristSpots = req.body;
        const result = await TouristSpotsCollection.insertOne(newTouristSpots);
        res.send(result);
      } catch (error) {
        console.error("Error inserting tourist spots:", error);
        res.status(500).send("Error inserting tourist spots");
      }
    });

    app.get("/TouristSpots", async (req, res) => {
      const cursor = TouristSpotsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.listen(port, () => {
      console.log(`Server Running on port: ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }

  app.delete("/TouristSpots/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await TouristSpotsCollection.deleteOne(query);
    res.send(result);
  });
}

run();
