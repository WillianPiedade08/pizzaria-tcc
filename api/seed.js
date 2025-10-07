const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
    const senhaHash = await bcrypt.hash('senha123', 10);
    await prisma.funcionario.create({
        data: {
            nome: 'Maria Funcionária',
            email: 'maria@gmail.com',
            telefone: '11988888888',
            senha: senhaHash,
        },
    });
    console.log('Funcionário criado com sucesso!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());