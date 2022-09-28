const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token

    if(authHeader) {

        //Opcional - Serve para tirar os espaços do token, se tiver
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if(err) res.status(401).json("Token Inválido")
            req.user = user;
            next();
        })

    } else {
        return res.status(401).json("Você não está autenticado")
    }
};

//Verificando se o usuário tem autorização ou se é um admin
const verifyTokenAndAuthorization = (req, res, next) => {

    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("Usuário sem permissão")
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization };