const express = require('express');
const bodyParser = require('body-parser');
const { Kafka } = require('kafkajs');

const app = express();
const port = 3000;

// Kafka configuration
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['my-cluster-kafka-bootstrap:9092']  // Fügen Sie hier Ihre Kafka-Broker-URLs ein
});

const producer = kafka.producer();

const runProducer = async () => {
  // Connect the Kafka producer
  await producer.connect();
  console.log('Kafka producer connected');
};

runProducer().catch(console.error);

app.use(bodyParser.json());

app.post('/logClick', async (req, res) => {
  const { product } = req.body;

  try {
    await producer.send({
      topic: 'clicks',
      messages: [
        { value: `Product clicked: ${product}` }
      ]
    });
    res.status(200).send('Click logged');
  } catch (error) {
    console.error('Error sending message to Kafka', error);
    res.status(500).send('Error logging click');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
