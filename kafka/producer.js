/*const kafka = require('./kafka');

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log('✅ Producteur Kafka connecté');
};

const sendUserCreateEvent = async (user) => {
  await producer.send({
    topic: 'utilisateur.cree',
    messages: [
      {
        key: String(user.id),
        value: JSON.stringify(user),
      },
    ],
  });

  console.log('📤 Événement utilisateur.cree envoyé');
};

module.exports = {
  connectProducer,
  sendUserCreateEvent,
};
*/