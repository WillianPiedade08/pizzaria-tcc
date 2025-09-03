// delivery.js

// Seleciona todos os botões de adicionar
const botoesAdicionar = document.querySelectorAll(".btn-adicionar");

// Recupera o carrinho ou cria um vazio
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Função para salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Função para adicionar item
function adicionarAoCarrinho(botao) {
    const nome = botao.dataset.nome;
    const preco = parseFloat(botao.dataset.preco);
    const imagem = botao.dataset.imagem;

    // Verifica se o produto já está no carrinho
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            nome,
            preco,
            imagem,
            quantidade: 1
        });
    }

    salvarCarrinho();
    alert(`${nome} adicionado ao carrinho!`);
}

// Evento nos botões
botoesAdicionar.forEach(botao => {
    botao.addEventListener("click", () => adicionarAoCarrinho(botao));
});
