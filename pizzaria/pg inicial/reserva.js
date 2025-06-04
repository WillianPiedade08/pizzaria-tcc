const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cadastrarPessoa(nome, email, senha, telefone) {
  try {
    // Cria um novo cliente no banco de dados
    const novaPessoa = await prisma.cliente.create({
      data: {
        nome: nome,
        email: email,
        senha: senha, // Certifique-se de criptografar a senha antes de salvar
        telefone: telefone,
      },
    });

    console.log('Pessoa cadastrada com sucesso:', novaPessoa);
  } catch (error) {
    console.error('Erro ao cadastrar pessoa:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exemplo de uso
cadastrarPessoa('João Silva', 'joao@email.com', 'senha123', '123456789');