// Cart functionality
console.log('cart-handler.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count badge
    updateCartCount();
    
    // Add event listeners for 'Add to Cart' buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    console.log('Found Add to Cart buttons:', addToCartButtons.length);
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            addToCart(event);
        });
    });
    
    // Event listener for add to cart button on product detail page
    const detailAddToCartBtn = document.getElementById('add-to-cart-detail');
    if (detailAddToCartBtn) {
        console.log('Found detail page Add to Cart button');
        
        // Remove any existing event listeners first by cloning and replacing the element
        const newButton = detailAddToCartBtn.cloneNode(true);
        detailAddToCartBtn.parentNode.replaceChild(newButton, detailAddToCartBtn);
        
        // Add our event listener to the new button
        newButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('[DEBUG] Add to Cart button clicked from cart-handler.js');
            addToCartFromDetail();
        });
    }
    
    // Event listener for quick view add to cart button
    const quickAddToCartBtn = document.querySelector('.quick-add-to-cart');
    if (quickAddToCartBtn) {
        console.log('Found quick view Add to Cart button');
        quickAddToCartBtn.addEventListener('click', function(event) {
            event.preventDefault();
            addToCartFromQuickView();
        });
    }
    
    // If on cart page, render the cart items
    if (window.location.pathname.includes('cart.html')) {
        console.log('On cart page, rendering cart items');
        renderCart();
        setupCartFunctionality();
    }
    
    // Function to add product to cart from product listings
    function addToCart(event) {
        console.log('Adding product to cart from listing');
        const productCard = event.target.closest('.product-card');
        if (!productCard) {
            console.error('Could not find parent product card');
            return;
        }
        
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('RM', ''));
        const productCategory = productCard.dataset.category;
        const productImg = productCard.querySelector('img').src;
        
        console.log('Product data:', { id: productId, name: productName, price: productPrice, category: productCategory });
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex > -1) {
            // Increment quantity
            cart[existingItemIndex].quantity += 1;
            console.log('Updated existing item quantity');
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
            console.log('Added new item to cart');
        }
        
        // Save to localStorage and update UI
        saveCart();
        updateCartCount();
        showAddedToCartFeedback(event.target);
    }
    
    // Function to add product to cart from detail page
    function addToCartFromDetail() {
        console.log('[DEBUG] addToCartFromDetail function called');
        
        try {
            // Clear previous cart to ensure clean state
            localStorage.removeItem('cart');
            console.log('[DEBUG] Cleared existing cart data');
            
            // Reset cart array
            cart = [];
            
            // Get product data from the detail page
            const productId = new URLSearchParams(window.location.search).get('id');
            const productName = document.getElementById('detail-product-name').textContent;
            const productPrice = parseFloat(document.getElementById('detail-product-price').textContent.replace('RM', ''));
            const productCategory = document.getElementById('detail-product-category').textContent;
            const productImg = document.getElementById('main-product-image').src;
            const quantity = parseInt(document.getElementById('product-quantity').value) || 1;
            
            console.log('[DEBUG] Product data:', { 
                id: productId, 
                name: productName, 
                price: productPrice, 
                category: productCategory, 
                quantity: quantity 
            });
            
            // Create a new cart with just this item
            const newItem = {
                id: productId,
                name: productName,
                price: productPrice,
                category: productCategory,
                img: productImg,
                quantity: quantity
            };
            
            // Add to cart array
            cart.push(newItem);
            console.log('[DEBUG] New cart with single item:', cart);
            
            // Save to localStorage and update UI
            saveCart();
            updateCartCount();
            showAddedToCartFeedback(document.getElementById('add-to-cart-detail'));
            
            // Add a delay and verify the cart was saved correctly
            setTimeout(() => {
                const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
                console.log('[DEBUG] Verification - Cart after save:', savedCart);
                if (savedCart.length > 0) {
                    console.log('[DEBUG] Verification - First item quantity:', savedCart[0].quantity);
                }
            }, 100);
        } catch (error) {
            console.error('[ERROR] Error in addToCartFromDetail:', error);
        }
    }
    
    // Function to add product to cart from quick view modal
    function addToCartFromQuickView() {
        console.log('Adding product to cart from quick view');
        
        const quickViewModal = document.querySelector('.modal.active') || document.getElementById('quick-view-modal');
        if (!quickViewModal) {
            console.error('Quick view modal not found');
            return;
        }
        
        // Get product data from the quick view modal
        const productNameElement = document.getElementById('quick-view-name');
        const productPriceElement = document.getElementById('quick-view-price');
        const productDetailsElement = document.getElementById('quick-view-details');
        const productCategoryElement = document.getElementById('quick-view-category');
        const productImageElement = document.getElementById('quick-view-image');
        
        if (!productNameElement || !productPriceElement || !productDetailsElement || !productCategoryElement || !productImageElement) {
            console.error('Required product elements not found in quick view');
            return;
        }
        
        const productId = productDetailsElement.href.split('id=')[1];
        const productName = productNameElement.textContent;
        const productPrice = parseFloat(productPriceElement.textContent.replace('RM', ''));
        const productCategory = productCategoryElement.textContent;
        const productImg = productImageElement.src;
        
        console.log('Product data:', { id: productId, name: productName, price: productPrice, category: productCategory });
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex > -1) {
            // Increment quantity
            cart[existingItemIndex].quantity += 1;
            console.log('Updated existing item quantity');
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
            console.log('Added new item to cart');
        }
        
        // Save to localStorage and update UI
        saveCart();
        updateCartCount();
        showAddedToCartFeedback(document.querySelector('.quick-add-to-cart'));
    }
    
    // Function to save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('[DEBUG] Cart saved to localStorage:', cart);
    }
    
    // Function to update cart count badge
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
            console.log('Cart count updated:', totalItems);
        } else {
            console.error('Cart count element not found');
        }
    }
    
    // Function to show feedback when item is added to cart
    function showAddedToCartFeedback(button) {
        if (!button) {
            console.error('Button element not found for feedback');
            return;
        }
        
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.disabled = true;
        button.style.backgroundColor = '#4CAF50';
        
        // Show notification if function is available
        if (typeof showNotification === 'function') {
            showNotification('Product added to cart successfully!');
        }
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.style.backgroundColor = '';
        }, 1500);
    }
    
    // Function to render cart items on cart page
    function renderCart() {
        console.log('Rendering cart items:', cart);
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartEmptyMessage = document.getElementById('cart-empty');
        const cartContent = document.getElementById('cart-content');
        
        if (!cartItemsContainer || !cartEmptyMessage || !cartContent) {
            console.error('Cart page elements not found');
            return;
        }
        
        // Show/hide empty cart message
        if (cart.length === 0) {
            cartEmptyMessage.classList.remove('hidden');
            cartContent.classList.add('hidden');
            console.log('Cart is empty, showing empty message');
            return;
        } else {
            cartEmptyMessage.classList.add('hidden');
            cartContent.classList.remove('hidden');
            console.log('Cart has items, showing cart content');
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
        const shipping = subtotal > 0 ? 5 : 0; // Fixed shipping cost, free if cart is empty
        
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
        console.log('Setting up cart functionality');
        
        // Event listener for clear cart button
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function() {
                console.log('Clearing cart');
                cart = [];
                saveCart();
                renderCart();
                updateCartCount();
                
                if (typeof showNotification === 'function') {
                    showNotification('Cart cleared successfully!');
                }
            });
        }
        
        // Event listener for update cart button
        const updateCartBtn = document.getElementById('update-cart');
        if (updateCartBtn) {
            updateCartBtn.addEventListener('click', function() {
                console.log('Updating cart');
                renderCart();
                
                if (typeof showNotification === 'function') {
                    showNotification('Cart updated successfully!');
                }
            });
        }
        
        // Event delegation for quantity changes and removals
        const cartItemsContainer = document.getElementById('cart-items-container');
        if (cartItemsContainer) {
            cartItemsContainer.addEventListener('click', function(e) {
                // Handle remove item button
                if (e.target.classList.contains('remove-item')) {
                    const itemId = e.target.dataset.id;
                    console.log('Removing item from cart:', itemId);
                    
                    // Remove item from cart
                    cart = cart.filter(item => item.id !== itemId);
                    saveCart();
                    renderCart();
                    updateCartCount();
                    
                    if (typeof showNotification === 'function') {
                        showNotification('Item removed from cart!');
                    }
                }
                
                // Handle decrease quantity button
                if (e.target.classList.contains('decrease-quantity')) {
                    const quantityInput = e.target.nextElementSibling;
                    const itemId = quantityInput.dataset.id;
                    const currentValue = parseInt(quantityInput.value);
                    
                    if (currentValue > 1) {
                        quantityInput.value = currentValue - 1;
                        updateItemQuantity(itemId, currentValue - 1);
                    }
                }
                
                // Handle increase quantity button
                if (e.target.classList.contains('increase-quantity')) {
                    const quantityInput = e.target.previousElementSibling;
                    const itemId = quantityInput.dataset.id;
                    const currentValue = parseInt(quantityInput.value);
                    
                    quantityInput.value = currentValue + 1;
                    updateItemQuantity(itemId, currentValue + 1);
                }
            });
            
            // Handle direct quantity input changes
            cartItemsContainer.addEventListener('change', function(e) {
                if (e.target.classList.contains('item-quantity')) {
                    const itemId = e.target.dataset.id;
                    let newValue = parseInt(e.target.value);
                    
                    // Ensure minimum quantity of 1
                    if (newValue < 1 || isNaN(newValue)) {
                        newValue = 1;
                        e.target.value = 1;
                    }
                    
                    updateItemQuantity(itemId, newValue);
                }
            });
        }
        
        // Event listener for proceed to checkout button
        const checkoutBtn = document.getElementById('proceed-to-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    console.log('Cannot checkout with empty cart');
                    if (typeof showNotification === 'function') {
                        showNotification('Your cart is empty! Please add items before checking out.', 'error');
                    } else {
                        alert('Your cart is empty! Please add items before checking out.');
                    }
                    return;
                }
                
                console.log('Proceeding to checkout');
                // Show checkout modal
                const checkoutModal = document.getElementById('checkout-modal');
                if (checkoutModal) {
                    checkoutModal.style.display = 'block';
                    setTimeout(() => {
                        checkoutModal.classList.add('active');
                    }, 100);
                }
            });
        }
    }
    
    // Function to update item quantity
    function updateItemQuantity(itemId, newQuantity) {
        console.log('Updating item quantity:', itemId, newQuantity);
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = newQuantity;
            saveCart();
            
            // Update totals without re-rendering the entire cart
            const itemRow = document.querySelector(`tr[data-id="${itemId}"]`);
            if (itemRow) {
                const priceCell = itemRow.querySelector('td[data-label="Price"]');
                const totalCell = itemRow.querySelector('td[data-label="Total"]');
                
                if (priceCell && totalCell) {
                    const price = parseFloat(priceCell.textContent.replace('RM', ''));
                    const itemTotal = price * newQuantity;
                    totalCell.textContent = `RM${itemTotal.toFixed(2)}`;
                }
            }
            
            // Calculate new subtotal
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            updateCartSummary(subtotal);
            updateCartCount();
        }
    }
}); 