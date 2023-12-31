const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle-ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ibuffr.mongodb.net/?retryWrites=true&w=majority`;


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
    //await client.connect();
    
    const toycollection = client.db('toyDB').collection('marvels');

    app.get('/marvels',async(req,res)=>{
        const cursor = toycollection.find().limit(20);
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get("/myToys/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await toycollection.find({ sellerEmail: req.params.email }).toArray();
      res.send(result);
    });

    app.get("/marvels/subCategory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toycollection.findOne(query);
      res.send(result);
    });

    const queryMarvel = { subCategory: "Marvel" };
    app.get("/marvels/subCategory/marvel", async (req, res) => {
      const cursor = toycollection.find(queryMarvel).limit(2);
      const result = await cursor.toArray();
      res.send(result);
    });

    const queryAvengers = { subCategory: "Avengers" };
    app.get("/marvels/subCategory/avengers", async (req, res) => {
      const cursor = toycollection.find(queryAvengers).limit(2);
      const result = await cursor.toArray();
      res.send(result);
    });

    const queryTransformer = { subCategory: "Transformer" };
    app.get("/marvels/subCategory/transformer", async (req, res) => {
      const cursor = toycollection.find(queryTransformer).limit(2);
      const result = await cursor.toArray();
      res.send(result);
    });


    app.post("/marvels", async (req, res) => {
      const addToy = req.body;
      const result = await toycollection.insertOne(addToy);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('toy is running')
})


app.listen(port,()=>{
    console.log(`toy is running on this port ${port}`)
})