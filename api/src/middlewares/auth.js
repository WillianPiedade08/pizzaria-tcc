const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const secret = process.env.JWT_SECRET || '10072007';
console.log('Secret configurado:', secret);

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Auth Header recebido:', authHeader);
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token);
    if (!token) {
        return res.status(401).json({ error: 'Token malformado' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log('Erro de verificação:', err.name, err.message);
            return res.status(403).json({ error: err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido' });
        }
        console.log('Token decodificado:', decoded);
        req.user = decoded;
        next();
    });
}

async function login(req, res) {
    try {
        const { email, senha } = req.body;
        console.log('Requisição de login recebida:', { email, senha }); 
        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const funcionario = await prisma.funcionario.findUnique({ where: { email } });
        console.log('Funcionário encontrado:', funcionario); 
        if (!funcionario) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const senhaValida = await bcrypt.compare(senha, funcionario.senha);
        console.log('Senha válida:', senhaValida); 
        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { funcionario_id: funcionario.id, nome: funcionario.nome },
            secret,
            { expiresIn: '7d' }
        );
        console.log('Token gerado:', token); 
        const { senha: _, ...funcionarioSemSenha } = funcionario;
        res.json({ funcionario: funcionarioSemSenha, token });
    } catch (err) {
        console.log('Erro no login:', err.message); 
        res.status(500).json({ error: 'Erro ao fazer login: ' + err.message });
    }
}

module.exports = { authMiddleware, login };