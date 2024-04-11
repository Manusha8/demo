const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(bodyParser.json());


const uri = "mongodb+srv://manushapotharaju8:c0omTcg4YJHi8M6k@task.eqi1pew.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1); 
  }
}


app.post('/snippets', async (req, res) => {
  try {
    const { username, language, stdin, code } = req.body;
    const database = client.db("task");
    const collection = database.collection("snippets");
    const result = await collection.insertOne({ username, language, stdin, code });
    console.log("Snippet submitted:", result.ops[0]);
    res.status(201).json({ message: "Snippet submitted successfully", snippet: result.ops[0] });
  } catch (error) {
    console.error("Error submitting snippet:", error);
    res.status(500).json({ error: "Error submitting snippet" });
  }
});

// Start the server
async function startServer() {
  await connectToDB();
  app.listen(port, () => {
    console.log(Backend server is running on port ${port});
  });
}

startServer();