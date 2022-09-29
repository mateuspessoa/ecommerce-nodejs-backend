const router = require("express").Router();
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");
const CryptoJS = require("crypto-js")

//Atualização dos dados do usuário
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

    try {

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {

            //Pegue tudo o que tá no body e atualize
            $set: req.body
        },{new: true});

        res.status(200).json(updatedUser);

    }catch(err){
        res.status(500).json(err);
    }
});

//Deletar Usuário
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Usuário Deletado")
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;