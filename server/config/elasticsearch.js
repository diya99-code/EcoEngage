const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({
  node: process.env.ELASTICSEARCH_URL, // e.g., 'https://my-deployment.es.us-central1.gcp.cloud.es.io'
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY
  }
});

module.exports = client;
