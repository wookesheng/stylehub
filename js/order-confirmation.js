// Order confirmation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only run this code on the cart page
    if (!window.location.pathname.includes('cart.html')) {
        return;
    }
    
    // Get place order button
    const placeOrderBtn = document.getElementById('place-order');
    
    if (placeOrderBtn) {
        // Replace the existing click event listener
        placeOrderBtn.removeEventListener('click', placeOrder);
        placeOrderBtn.addEventListener('click', handleOrderPlacement);
    }
    
    // Function to handle order placement with popup notification
    function handleOrderPlacement() {
        // Check if form is valid (reuse existing validation function)
        if (typeof validateForm === 'function' && !validateForm()) {
            return;
        }
        
        // Show loading state
        placeOrderBtn.textContent = 'Processing...';
        placeOrderBtn.disabled = true;
        
        // Simulate processing delay (in a real app, this would be an API call)
        setTimeout(function() {
            // Get customer email for confirmation
            const emailInput = document.getElementById('email');
            const email = emailInput ? emailInput.value : 'customer@example.com';
            
            // Generate random order number
            const orderNumber = '#' + Math.floor(Math.random() * 100000);
            
            // Hide checkout modal
            const checkoutModal = document.getElementById('checkout-modal');
            checkoutModal.classList.remove('active');
            
            setTimeout(() => {
                checkoutModal.style.display = 'none';
                
                // Create order success notification
                const notification = document.createElement('div');
                notification.className = 'notification-popup success';
                notification.innerHTML = `
                    <div class="notification-content">
                        <div class="notification-message">Order #${orderNumber.substring(1)} placed successfully! Thank you for your purchase.</div>
                        <button class="notification-close">OK</button>
                    </div>
                `;
                
                // Add notification to body
                document.body.appendChild(notification);
                
                // Show notification with animation
                setTimeout(() => {
                    notification.classList.add('show');
                }, 10);
                
                // Add event listener to close button
                const closeBtn = notification.querySelector('.notification-close');
                closeBtn.addEventListener('click', () => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                });
                
                // Auto close after 5 seconds
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.classList.remove('show');
                        setTimeout(() => {
                            notification.remove();
                        }, 300);
                    }
                }, 5000);
                
                // Clear cart (reuse existing function)
                if (typeof clearCart === 'function') {
                    clearCart();
                } else {
                    // Fallback cart clearing if function not available
                    localStorage.setItem('cart', JSON.stringify([]));
                    
                    // Update cart display
                    const cartCountElements = document.querySelectorAll('#cart-count');
                    cartCountElements.forEach(element => {
                        element.textContent = '0';
                    });
                    
                    // Show empty cart message
                    const cartEmptyMessage = document.getElementById('cart-empty');
                    const cartContent = document.getElementById('cart-content');
                    
                    if (cartEmptyMessage && cartContent) {
                        cartEmptyMessage.classList.remove('hidden');
                        cartContent.classList.add('hidden');
                    }
                }
                
                // Reset button state
                placeOrderBtn.textContent = 'Place Order';
                placeOrderBtn.disabled = false;
            }, 300);
        }, 2000);
    }
}); 