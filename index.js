const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const ProductRoute = require("./routes/product")
const cors = require("cors")

dotenv.config()

//Conectando ao MongoDB Cloud
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Conectado ao Cloud MongoDB!")).catch((err) => {
    console.log(err);
})

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", ProductRoute);

app.listen(5000, () => {
    console.log("Servidor Backend está rodando!")
});

