import mongoose from "mongoose";

mongoose
  // .connect("mongodb://127.0.0.1:27017/justice-app")
  .connect("mongodb+srv://tusharrajput919:window@test-usm.p4ufnvq.mongodb.net/canipark?retryWrites=true&w=majority")
  .then(() => {
    console.log("Database successfully connect");
  })
  .catch(() => {
    console.log("MongoDB Error");
  });

export default mongoose;
