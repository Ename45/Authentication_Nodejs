const express = require("express");
const cors = require("cors");
const userRoutes = require('./routes/UserRoutes')
const otpRoutes = require('./routes/OtpRoutes')

require("dotenv").config();
const app = express();




app.use(express.json());
app.use(cors());

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/otp', otpRoutes)


app.listen(process.env.PORT, () => {
  console.log("server is running on port", process.env.PORT);
});