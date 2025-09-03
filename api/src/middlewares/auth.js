const jwt = require("jsonwebtoken");

const secret = "seuSegredoSuperSecreto"; // ideal usar process.env.SECRET

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1]; // pega só o token (Bearer xxx)

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido" });
        }
        req.user = decoded; // salva os dados do cliente no req
        next();
    });
}

module.exports = { authMiddleware, secret };
