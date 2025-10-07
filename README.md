## Backlog do Projeto final
## (Sprint 05 - 06/10) Backlog
Nesta sprint, vamos focar na implantação do projeto, garantindo que tudo esteja funcionando corretamente em um ambiente de produção. Também faremos uma revisão final do código e documentação.

[] Implantação do Back-End em um serviço de nuvem (ex: Vercel, Heroku, AWS).
[] Implantação do Front-End em um serviço de nuvem (ex: Vercel, GitHub Pages).
[] Iniciar o desenvolvimento do App Mobile (Funcionalidades principais).
[] Testes de integração e ponto a ponto (Caixa preta e Caixa branca).
[] Após o back-end implantado, Criar um Roteiro/check-list e testar manualmente (Teste de integração: Back/BD) a API a partir do Insomnia e documentar os testes. Tirando prints e fazendo um relatório. (Caixa branca).
[] Após o front-end implantado, Criar um Roteiro/check-list para testar o Front-End manualmente (Teste ponto a ponto), fazer um relatório dos testes. (Caixa branca).
[] Criar um Roteiro/check-list (teste de integração) pedir para um colega de outro grupo testar a API implantada a partir do Insomnia e documentar os testes. Tirando prints e fazendo um relatório. (Caixa preta).
[] Criar um Roteiro/check-list (Teste ponto a ponto) pedir para um colega de outro grupo testar manualmente o Front-End implantado e fazer um relatório dos testes. (Caixa preta).
[] Adicionar um recurso de IoT (opcional, pois dependendo do tema pode não fazer sentido).
[] Revisão do cronograma do projeto.
[] Revisão da documentação.
[] Matriz SWOT.
[] DER atualizado ou UML Diagrama de Classes.
[] Requisitos Funcionais e Não Funcionais.
[] UML DCU (Diagrama de Caso de Uso).
[] Para implantação cada stack (front-end, back-end e mobile) foi necessário criar um repositório separado para cada um no GitHub, deixar link dos repositórios no README.md do repositório principal do projeto, com todas as documentações em PDF.
# Documentação

## DCU

![](./docs/dcu.jpeg)

## DER

![](./docs/Der.jpeg)

## SWOT

![](./docs/Swot.jpeg)

## Requisitos funcionais

RF01 - Gerenciamento de Clientes: O sistema deve permitir cadastrar, editar, listar e excluir clientes (nome, email, telefone, endereço, senha).

RF02 - Gerenciamento de Produtos: O sistema deve permitir cadastrar, editar, listar e excluir produtos (nome, preço, imagem).

RF03 - Gerenciamento de Pedidos: O sistema deve permitir criar pedidos, listar e excluir, associando itens a clientes.

RF04 - Gerenciamento de Itens: O sistema deve permitir adicionar itens a pedidos (quantidade, preço unitário).

RF05 - Gerenciamento de Reservas: O sistema deve permitir criar, editar, listar e excluir reservas (data, hora, número de pessoas, status).

RF06 - Carrinho de Compras: O sistema deve permitir adicionar produtos ao carrinho, ajustar quantidades e finalizar pedidos com opções de pagamento (Pix, Cartão, Boleto, Débito).

RF07 - Autenticação: O sistema deve autenticar clientes via login com token JWT.

RF08 - Integração: O frontend deve se comunicar com o backend via API REST.

## Requisitos Não Funcionais

RNF01 - Desempenho: O sistema deve responder a requisições em até 2 segundos.

RNF02 - Escalabilidade: O sistema deve suportar até 100 usuários simultâneos.

RNF03 - Segurança: O sistema deve usar HTTPS e criptografar senhas com hash (ex.: bcrypt).

RNF04 - Usabilidade: O frontend deve ser responsivo (desktop, tablet, celular) com design intuitivo.

RNF05 - Disponibilidade: O sistema deve ter 99% de uptime.

RNF06 - Manutenção: O código deve ser documentado e modular para facilitar atualizações
