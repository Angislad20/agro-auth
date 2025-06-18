const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'auth-service',
    brokers: [ 'kafka:9092' ] // nom du conteneur Docker de kafka
});

module.exports = kafka;