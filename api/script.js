document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.product button');


    const parsePrice = (priceString) => {
        if (!priceString) return 0;

        const cleanedString = priceString.replace('R$', '').trim().replace(',', '.');
        const price = parseFloat(cleanedString);
        return isNaN(price) ? 0 : price;
    };


    const addItemToCartAndRedirect = (product) => {

        let cart = JSON.parse(localStorage.getItem('carrinho')) || [];

        const existingItemIndex = cart.findIndex(item => item.nome === product.nome);

        if (existingItemIndex > -1) {

            cart[existingItemIndex].quantidade += 1;
        } else {

            cart.push({
                nome: product.nome,
                preco: product.preco,
                imagem: product.imagem,
                quantidade: 1
            });
        }

        localStorage.setItem('carrinho', JSON.stringify(cart));

        window.location.href = 'carrinho.html';
    };


    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.product');
            if (!productElement) return;

            const productName = productElement.querySelector('h2')?.textContent || 'Produto Desconhecido';
            const productPriceText = productElement.querySelector('span')?.textContent;

            const productImage = productElement.querySelector('img');
            const productImageSrc = productImage ? productImage.src : 'placeholder.png';

            const productPrice = parsePrice(productPriceText);

            const product = {
                nome: productName,
                preco: productPrice,
                imagem: productImageSrc
            };

            addItemToCartAndRedirect(product);
        });
    });


    const updateCartIconCount = () => {
        const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);

        const cartIconLink = document.querySelector('nav a[href="carrinho.html"]');
        const cartIcon = cartIconLink ? cartIconLink.querySelector('i.bi-cart3') : null;

        if (cartIcon) {

            let countSpan = cartIcon.querySelector('.cart-count-badge');
            if (!countSpan) {
                countSpan = document.createElement('span');
                countSpan.className = 'cart-count-badge';

                countSpan.style.position = 'absolute';
                countSpan.style.top = '-8px';
                countSpan.style.right = '-12px';
                countSpan.style.background = 'red';
                countSpan.style.color = 'white';
                countSpan.style.borderRadius = '50%';
                countSpan.style.padding = '1px 4px'; countSpan.style.fontSize = '0.7em';
                countSpan.style.lineHeight = '1';
                countSpan.style.minWidth = '16px';
                countSpan.style.textAlign = 'center';
                countSpan.style.display = 'inline-block';


                if (cartIconLink) cartIconLink.style.position = 'relative';

                cartIcon.appendChild(countSpan);
            }
            countSpan.textContent = totalItems > 0 ? totalItems : '';
            countSpan.style.display = totalItems > 0 ? 'inline-block' : 'none';
            if (cartIconLink) cartIconLink.title = `Carrinho (${totalItems} itens)`;
        }
    };


    updateCartIconCount();
});