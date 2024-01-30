// require('dotenv').config({path: './env'})
import dotenv from "dotenv";

import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("src/index - Error: ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`src/index - server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`src/index - mongoDB connection failed`, err);
  });

/*
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("Express app error with DB: ", error);
      throw error;
    });

    app.listen(process.env.PORT,()=>{
        console.log(`app is listening on port ${process.env.PORT}  `)
    })
  } catch (error) {
    console.log("ERROR: ", error);
    throw error;
  }
})();

*/
