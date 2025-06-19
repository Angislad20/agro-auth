/*const kafka = require('./kafka'); // Utilise le même fichier

const consumer = kafka.consumer({ groupId: 'debug-group' });

const run = async () => {
  await consumer.connect();

  let topicCreated = false;
  while (!topicCreated) {
    try {
      await consumer.subscribe({ topic: 'utilisateur.cree', fromBeginning: true });
      topicCreated = true;
    } catch (err) {
      console.log('⏳ En attente que le topic soit disponible...');
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`📥 ${topic}[${partition}] ${message.key}: ${message.value}`);
    },
  });
};

run().catch(console.error);
*/