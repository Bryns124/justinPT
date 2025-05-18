const express = require('express');
const mongoose = require('mongoose')
const app = express();
const port = 3000;
const uri = "mongodb+srv://Cluster92906:SnF4b3ZWanVS@trainerapp.s0tb2mi.mongodb.net/?retryWrites=true&w=majority&appName=trainerApp"

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB Atlas");
  } catch (error) {
    console.log(error);
  }
}

connect();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});