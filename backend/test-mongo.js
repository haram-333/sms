const mongoose = require('mongoose');

const uris = [
  'mongodb://f2023266307_db_user:12345678Ab@ac-vhwkkua-shard-00-00.4aes1i8.mongodb.net:27017,ac-vhwkkua-shard-00-01.4aes1i8.mongodb.net:27017,ac-vhwkkua-shard-00-02.4aes1i8.mongodb.net:27017/sms_db?ssl=true&replicaSet=atlas-vhwkkua-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'
];

async function testConnection(uri, index) {
  console.log(`\nTesting URI ${index + 1}...`);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`SUCCESS with URI ${index + 1}!`);
    await mongoose.disconnect();
    return uri;
  } catch (err) {
    console.error(`FAILED with URI ${index + 1}:`, err.message);
    return null;
  }
}

async function runTests() {
  for (let i = 0; i < uris.length; i++) {
    const successUri = await testConnection(uris[i], i);
    if (successUri) {
      console.log('\n--- Found working URI: ---');
      console.log(successUri);
      return;
    }
  }
  console.log('\nAll URIs failed.');
}

runTests();
