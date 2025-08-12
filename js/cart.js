// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count badge
    updateCartCount();
    
    // Add event listeners for 'Add to Cart' buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Event listener for add to cart button on product detail page
    const detailAddToCartBtn = document.getElementById('add-to-cart-btn');
    if (detailAddToCartBtn) {
        detailAddToCartBtn.addEventListener('click', addToCartFromDetail);
    }
    
    // Function to add product to cart from product listings
    function addToCart(event) {
        const productCard = event.target.closest('.product-card');
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productCategory = productCard.dataset.category;
        const productImg = productCard.querySelector('img').src;
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex > -1) {
            // Increment quantity
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                category: productCategory,
                img: productImg,
                quantity: 1
            });
        }
        
        // Save to localStorage and update UI
        saveCart();
        updateCartCount();
        showAddedToCartFeedback(event.target);
    }
    
    // Function to add product to cart from detail page
    function addToCartFromDetail() {
        const productId = new URLSearchParams(window.location.search).get('id');
        const productName = document.getElementById('detail-product-name').textContent;
        const productPrice = parseFloat(document.getElementById('detail-product-price').textContent.replace('RM', ''));
        const productCategory = document.getElementById('product-category').textContent.toLowerCase();
        const productImg = document.getElementById('main-product-image').src;
        const quantity = parseInt(document.getElementById('quantity').value) || 1;
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex > -1) {
            // Add the selected quantity
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item with selected quantity
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                category: productCategory,
                img: productImg,
                quantity: quantity
            });
        }
        
        // Save to localStorage and update UI
        saveCart();
        updateCartCount();
        showAddedToCartFeedback(document.getElementById('add-to-cart-btn'));
    }
    
    // Function to save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Function to update cart count badge
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }
    
    // Function to show feedback when item is added to cart
    function showAddedToCartFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.disabled = true;
        button.style.backgroundColor = 'var(--success-color)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.style.backgroundColor = '';
        }, 1500);
    }
    
    // If on cart page, render the cart items
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
        setupCartFunctionality();
    }
    
    // Function to render cart items on cart page
    function renderCart() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartEmptyMessage = document.getElementById('cart-empty');
        const cartContent = document.getElementById('cart-content');
        
        // Show/hide empty cart message
        if (cart.length === 0) {
            cartEmptyMessage.classList.remove('hidden');
            cartContent.classList.add('hidden');
            return;
        } else {
            cartEmptyMessage.classList.add('hidden');
            cartContent.classList.remove('hidden');
        }
        
        // Clear existing items
        cartItemsContainer.innerHTML = '';
        
        // Calculate totals
        let subtotal = 0;
        
        // Render each cart item
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItemRow = document.createElement('tr');
            cartItemRow.dataset.id = item.id;
            
            cartItemRow.innerHTML = `
                <td data-label="Product">
                    <div class="cart-product">
                        <img src="${item.img}" alt="${item.name}">
                        <div>
                            <h4>${item.name}</h4>
                            <p>Category: ${item.category}</p>
                        </div>
                    </div>
                </td>
                <td data-label="Price">RM${item.price.toFixed(2)}</td>
                <td data-label="Quantity">
                    <div class="quantity-selector">
                        <button class="decrease-quantity">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}">
                        <button class="increase-quantity">+</button>
                    </div>
                </td>
                <td data-label="Total">RM${itemTotal.toFixed(2)}</td>
                <td data-label="Actions">
                    <button class="remove-item" data-id="${item.id}">×</button>
                </td>
            `;
            
            cartItemsContainer.appendChild(cartItemRow);
        });
        
        // Update summary
        updateCartSummary(subtotal);
    }
    
    // Function to update cart summary
    function updateCartSummary(subtotal) {
        const subtotalElement = document.getElementById('cart-subtotal');
        const totalElement = document.getElementById('cart-total');
        const shipping = 5; // Fixed shipping cost
        
        if (subtotalElement && totalElement) {
            subtotalElement.textContent = `RM${subtotal.toFixed(2)}`;
            totalElement.textContent = `RM${(subtotal + shipping).toFixed(2)}`;
            
            // Also update checkout modal if it exists
            const checkoutSubtotal = document.getElementById('checkout-subtotal');
            const checkoutTotal = document.getElementById('checkout-total');
            
            if (checkoutSubtotal && checkoutTotal) {
                checkoutSubtotal.textContent = `RM${subtotal.toFixed(2)}`;
                checkoutTotal.textContent = `RM${(subtotal + shipping).toFixed(2)}`;
            }
        }
    }
    
    // Setup cart page functionality
    function setupCartFunctionality() {
        // Event listener for quantity changes
        const quantityInputs = document.querySelectorAll('.item-quantity');
        quantityInputs.forEach(input => {
            input.addEventListener('change', updateQuantity);
        });
        
        // Event listeners for quantity buttons
        const decreaseButtons = document.querySelectorAll('.decrease-quantity');
        const increaseButtons = document.querySelectorAll('.increase-quantity');
        
        decreaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.nextElementSibling;
                if (input.value > 1) {
                    input.value = parseInt(input.value) - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        });
        
        increaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.previousElementSibling;
                input.value = parseInt(input.value) + 1;
                input.dispatchEvent(new Event('change'));
            });
        });
        
        // Event listener for remove item buttons
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeItem);
        });
        
        // Event listener for clear cart button
        const clearCartButton = document.getElementById('clear-cart');
        if (clearCartButton) {
            clearCartButton.addEventListener('click', clearCart);
        }
        
        // Event listener for update cart button
        const updateCartButton = document.getElementById('update-cart');
        if (updateCartButton) {
            updateCartButton.addEventListener('click', function() {
                renderCart();
                showMessage('Cart updated successfully', 'success');
            });
        }
        
        // Event listener for proceed to checkout button
        const checkoutButton = document.getElementById('proceed-to-checkout');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', openCheckoutModal);
        }
    }
    
    // Function to update item quantity
    function updateQuantity() {
        const itemId = this.dataset.id;
        const newQuantity = parseInt(this.value);
        
        if (newQuantity < 1) {
            this.value = 1;
            return;
        }
        
        // Update cart array
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = newQuantity;
            saveCart();
            updateCartCount();
            
            // Update row total
            const row = this.closest('tr');
            const priceCell = row.querySelector('td[data-label="Price"]');
            const totalCell = row.querySelector('td[data-label="Total"]');
            
            const price = parseFloat(priceCell.textContent.replace('RM', ''));
            const newTotal = price * newQuantity;
            totalCell.textContent = `RM${newTotal.toFixed(2)}`;
            
            // Update cart summary
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            updateCartSummary(subtotal);
        }
    }
    
    // Function to remove item from cart
    function removeItem() {
        const itemId = this.dataset.id;
        
        // Remove from cart array
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        updateCartCount();
        
        // Re-render cart
        renderCart();
        setupCartFunctionality();
        
        showMessage('Item removed from cart', 'info');
    }
    
    // Function to clear cart
    function clearCart() {
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();
        
        showMessage('Cart cleared', 'info');
    }
    
    // Function to show messages/notifications
    function showMessage(message, type = 'info') {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        // Add to page
        document.body.appendChild(messageElement);
        
        // Remove after delay
        setTimeout(() => {
            messageElement.classList.add('hide');
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 500);
        }, 3000);
    }
    
    // Function to open checkout modal
    function openCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        if (modal) {
            modal.style.display = 'block';
            
            // Setup close button
            const closeButtons = modal.querySelectorAll('.close-modal, .close-modal-btn');
            closeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    modal.style.display = 'none';
                });
            });
            
            // Close when clicking outside the modal
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
});

// Product Detail Page functionality
if (window.location.pathname.includes('product-detail.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        // If product ID exists, load product data
        if (productId) {
            loadProductData(productId);
        }
        
        // Quantity selector functionality
        const decreaseBtn = document.getElementById('decrease-quantity');
        const increaseBtn = document.getElementById('increase-quantity');
        const quantityInput = document.getElementById('quantity');
        
        if (decreaseBtn && increaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', function() {
                if (quantityInput.value > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                }
            });
            
            increaseBtn.addEventListener('click', function() {
                quantityInput.value = parseInt(quantityInput.value) + 1;
            });
        }
        
        // Thumbnails functionality
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('main-product-image');
        
        if (thumbnails.length && mainImage) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    // Update main image
                    mainImage.src = this.dataset.img;
                    
                    // Update active class
                    thumbnails.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        }
        
        // Tabs functionality
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        if (tabButtons.length && tabPanes.length) {
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const tabId = this.dataset.tab;
                    
                    // Update active class on buttons
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show selected tab pane
                    tabPanes.forEach(pane => {
                        pane.classList.remove('active');
                        if (pane.id === tabId) {
                            pane.classList.add('active');
                        }
                    });
                });
            });
        }
        
        // Size and color selection
        const variantButtons = document.querySelectorAll('.variant-btn');
        const colorButtons = document.querySelectorAll('.color-btn');
        
        if (variantButtons.length) {
            variantButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Update active class
                    variantButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        }
        
        if (colorButtons.length) {
            colorButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Update active class
                    colorButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        }
    });
    
    // Function to load product data (in a real app, this would fetch from an API)
    function loadProductData(productId) {
        // For demo purposes, we'll just update the product name in breadcrumbs
        const productNameElement = document.getElementById('product-name');
        const detailProductName = document.getElementById('detail-product-name');
        
        if (productNameElement && detailProductName) {
            productNameElement.textContent = detailProductName.textContent;
        }
    }
} 