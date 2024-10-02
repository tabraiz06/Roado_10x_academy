const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors= require('cors')
const wordRoutes = require("./routes/wordRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error: ", err));


app.use("/api/words", wordRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
