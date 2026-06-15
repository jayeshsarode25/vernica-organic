import app from './src/app.js';
import { connect } from './src/broker/rabbit.js';
import startListener from './src/broker/listner.js';



connect()
    .then(() => {
        startListener();
    })


const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Notification service is running on port ${PORT}`);
});
