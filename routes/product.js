const router = require("express").Router();
const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js")

//Criação de Produto
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct)
    }catch(err){
        res.status(500).json(err)
    }

});

//Atualização dos dados do produto
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {

            //Pegue tudo o que tá no body e atualize
            $set: req.body
        },{new: true});

        res.status(200).json(updatedProduct);

    }catch(err){
        res.status(500).json(err);
    }
});

//Deletar Produto
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Produto Deletado")
    }catch(err){
        res.status(500).json(err)
    }
})

//Pegar um produto
router.get("/find/:id", async (req, res) => {

    try {
        const product = await Product.findById(req.params.id)

        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err)
    }
})

//Pegar todos os produtos
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(1)
        } else if(qCategory) {
            products = await Product.find({categories: {
                $in: [qCategory],
            }});
        }else {
            products = await Product.find();
        }

        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;