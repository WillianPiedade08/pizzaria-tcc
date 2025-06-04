document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.product button');

    // Function to parse price string (e.g., "R$ 40,00") to number
    const parsePrice = (priceString) => {
        if (!priceString) return 0;
        // Remove "R$", trim whitespace, replace comma with dot
        const cleanedString = priceString.replace('R$', '').trim().replace(',', '.');
        const price = parseFloat(cleanedString);
        return isNaN(price) ? 0 : price; // Return 0 if parsing fails
    };

    // Function to add item to cart and redirect
    const addItemToCartAndRedirect = (product) => {
        // Use 'carrinho' key to match the cart page script
        let cart = JSON.parse(localStorage.getItem('carrinho')) || [];

        const existingItemIndex = cart.findIndex(item => item.nome === product.nome);

        if (existingItemIndex > -1) {
            // Item already in cart, increase quantity
            cart[existingItemIndex].quantidade += 1;
        } else {
            // New item, add to cart with quantity 1
            // Ensure all required fields (nome, preco, imagem, quantidade) are present
            cart.push({
                nome: product.nome,
                preco: product.preco,
                imagem: product.imagem, // Add image source
                quantidade: 1
            });
        }

        localStorage.setItem('carrinho', JSON.stringify(cart));

        // Redirect to the cart page
        // Ensure 'carrinho.html' is the correct filename for the cart page
        window.location.href = 'carrinho.html'; 
    };

    // Add event listeners to buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.product');
            if (!productElement) return; // Safety check

            const productName = productElement.querySelector('h2')?.textContent || 'Produto Desconhecido';
            const productPriceText = productElement.querySelector('span')?.textContent;
            // Attempt to get the full image source URL
            const productImage = productElement.querySelector('img');
            const productImageSrc = productImage ? productImage.src : 'placeholder.png'; // Get image src (will be the full URL)

            const productPrice = parsePrice(productPriceText);

            const product = {
                nome: productName,
                preco: productPrice,
                imagem: productImageSrc // Include image source
            };

            addItemToCartAndRedirect(product);
        });
    });

    // Optional: Update cart icon count on delivery page load (if needed)
    const updateCartIconCount = () => {
        const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);
        // More specific selector for the cart icon within the nav link
        const cartIconLink = document.querySelector('nav a[href="carrinho.html"]');
        const cartIcon = cartIconLink ? cartIconLink.querySelector('i.bi-cart3') : null;
        
        if (cartIcon) {
            // Add a simple counter visually or update title
            // Check if a count badge already exists
            let countSpan = cartIcon.querySelector('.cart-count-badge');
            if (!countSpan) {
                countSpan = document.createElement('span');
                countSpan.className = 'cart-count-badge'; // Add a class for styling
                // Basic inline styling (better to move to CSS)
                countSpan.style.position = 'absolute';
                countSpan.style.top = '-8px'; // Adjust position as needed
                countSpan.style.right = '-12px'; // Adjust position as needed
                countSpan.style.background = 'red';
                countSpan.style.color = 'white';
                countSpan.style.borderRadius = '50%';
                countSpan.style.padding = '1px 4px'; // Smaller padding
                countSpan.style.fontSize = '0.7em';
                countSpan.style.lineHeight = '1';
                countSpan.style.minWidth = '16px'; // Ensure minimum width
                countSpan.style.textAlign = 'center';
                countSpan.style.display = 'inline-block';
                
                // Parent link needs relative positioning for absolute badge positioning
                if (cartIconLink) cartIconLink.style.position = 'relative'; 
                
                cartIcon.appendChild(countSpan);
            }
            countSpan.textContent = totalItems > 0 ? totalItems : '';
            countSpan.style.display = totalItems > 0 ? 'inline-block' : 'none'; // Hide if zero
            if (cartIconLink) cartIconLink.title = `Carrinho (${totalItems} itens)`; // Update title on the link
        }
    };

    // Update count when the page loads
    updateCartIconCount();
});

