// cleanup.js
require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Orders');
const Container = require('./models/Containers');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Order.deleteMany({ _id: { $ne: '6a02eddbbf6aac3f95ba0ad9' } });
  console.log('Done!');
  process.exit();
});

/* mongoose.connect(process.env.MONGO_URI).then(async ()=> {

    const result = await Container.updateMany({}, { $set: {status: "Container ready to use"}})
    console.log(result);
    process.exit();
}); */
