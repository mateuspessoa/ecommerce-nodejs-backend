const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

//Registro
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        //Criptografando a senha
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch(err){
        res.status(500).json(err);
    }
});

//Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});

        //Verificando se o usuário existe
        if(!user) {
            res.status(401).json("Usuário não encontrado");
        }

        //Descriptografando a senha
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        //Verificando se a senha está correta
        if(OriginalPassword !== req.body.password) {
            res.status(401).json("Senha incorreta");
            return
        }

        //Gerando um Token de acesso ao usuário
        const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
            }, 
            process.env.JWT_SEC,
            {expiresIn: "3d"}
        );

        //Excluindo a senha do retorno para não ser exibida
        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });

    }catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router