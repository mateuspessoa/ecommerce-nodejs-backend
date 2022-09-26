const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config()

//Conectando ao MongoDB Cloud
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Conectado ao Cloud MongoDB!")).catch((err) => {
    console.log(err);
})

app.get("/api/test", () => {
    console.log("Teste realizado com Sucesso")
})

app.listen(5000, () => {
    console.log("Servidor Backend está rodando!")
});

