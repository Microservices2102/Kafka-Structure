// api.js
const express = require("express");
const { json } = require("body-parser");
const { startProducer } = require("./events/producer");
const { startConsumer } = require("./events/consumer");

const app = express();
app.set("trust proxy", true);
app.use(json());
const port = 3000;

app.get("/start-producer", async (req, res) => {
  try {
    await startProducer();
    res.send("Producer started and messages sent.");
  } catch (error) {
    res.status(500).send(`Error starting producer: ${error.message}`);
  }
});

app.post("/produce-message", async (req, res) => {
  const { topic, key, value } = req.body;
  try {
    await startProducer(topic, key, value);
    res.send(`Message sent to topic ${topic}.`);
  } catch (error) {
    res.status(500).send(`Error producing message: ${error.message}`);
  }
});

app.get("/start-consumer", async (req, res) => {
  try {
    await startConsumer();
    res.send("Consumer started.");
  } catch (error) {
    res.status(500).send(`Error starting consumer: ${error.message}`);
  }
});

module.exports = app;
