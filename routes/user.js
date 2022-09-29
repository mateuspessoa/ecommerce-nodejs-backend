const router = require("express").Router();
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
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

//Pegar um usuário
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const user = await User.findById(req.params.id)

        //Serve para não revelar a senha do usuário
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err)
    }
})

//Pegar todos os usuários
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;

    try {

        //Essa query serve para limitar o resultado em 5 usuários, caso tena um "nwe=true" na URL
        const users = query 
            //Pegar apenas o usuário mais recente
            ? await User.find().sort({_id: -1}).limit(5) 
            //Pega todos os usuários
            : await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err)
    }
})

//Pegar as estatísticas do usuário
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;