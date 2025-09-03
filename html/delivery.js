// Pega todos os botões
const botoesAdicionar = document.querySelectorAll('.btn-adicionar');

botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', () => {
        // Pega os dados do produto do botão
        const nome = botao.dataset.nome;
        const preco = parseFloat(botao.dataset.preco);
        const imagem = botao.dataset.imagem;

        // Pega o carrinho do localStorage ou cria um array vazio
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        // Verifica se o produto já está no carrinho
        const produtoExistente = carrinho.find(p => p.nome === nome);
        if (produtoExistente) {
            produtoExistente.quantidade += 1; // se já tiver, só aumenta a quantidade
        } else {
            carrinho.push({
                nome,
                preco,
                imagem,
                quantidade: 1
            });
        }

        // Salva novamente no localStorage
        localStorage.setItem('carrinho', JSON.stringify(carrinho));

        alert(`${nome} adicionado ao carrinho!`);
    });
});
