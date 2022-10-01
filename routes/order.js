const router = require("express").Router();
const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js")

//Criação de pedido
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder)
    }catch(err){
        res.status(500).json(err)
    }

});

//Atualização de pedido
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {

        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {

            //Pegue tudo o que tá no body e atualize
            $set: req.body
        },{new: true});

        res.status(200).json(updatedOrder);

    }catch(err){
        res.status(500).json(err);
    }
});

//Deletar pedido
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Pedido Deletado")
    }catch(err){
        res.status(500).json(err)
    }
})

//Pegar pedidos do usuário
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const orders = await Order.find({userId: req.params.userId})

        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err)
    }
})

//Pegar todos os pedidos
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
})

//Estatíscas de renda mensal
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;