const router = require("express").Router();
const Cart = require("../models/Cart")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js")

//Criação de carrinho
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save();
        res.status(201).json(savedCart)
    }catch(err){
        res.status(500).json(err)
    }

});

//Atualização de carrinho
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {

        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {

            //Pegue tudo o que tá no body e atualize
            $set: req.body
        },{new: true});

        res.status(200).json(updatedCart);

    }catch(err){
        res.status(500).json(err);
    }
});

//Deletar Produto
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Carrinho Deletado")
    }catch(err){
        res.status(500).json(err)
    }
})

//Pegar carrinho do usuário
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const cart = await Cart.findOne({userId: req.params.userId})

        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err)
    }
})

//Pegar todos os carrinhos
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;