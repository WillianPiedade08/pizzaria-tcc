const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    // esperado: "Bearer <token>"
    const [, token] = authHeader.split(' ');

    if (!token) return res.status(401).json({ error: 'Token não enviado' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { sub, email, cargo, iat, exp }
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = auth;
