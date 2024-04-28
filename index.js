const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

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

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const TouristSpotsCollection = client
      .db("touristsDB")
      .collection("touristsSpots");

    app.post("/TouristSpots", async (req, res) => {
      try {
        const newTouristSpots = req.body;
        console.log(newTouristSpots);
        const result = await TouristSpotsCollection.insertOne(newTouristSpots);
        res.send(result);
      } catch (error) {
        console.error("Error inserting tourist spots:", error);
        res.status(500).send("Error inserting tourist spots");
      }
    });

    app.listen(port, () => {
      console.log(`Server Running on port: ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run();
