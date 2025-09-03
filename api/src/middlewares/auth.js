const jwt = require("jsonwebtoken");

const secret = "seuSegredoSuperSecreto";

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1]; 

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido" });
        }
        req.user = decoded; 
        next();
    });
}

module.exports = { authMiddleware, secret };
