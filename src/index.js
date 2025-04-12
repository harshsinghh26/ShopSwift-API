import dotenv from 'dotenv';
import dbConnection from './db/index.js';
import app from './app.js';

dotenv.config();

dbConnection()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`app is lisenting on POST ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
