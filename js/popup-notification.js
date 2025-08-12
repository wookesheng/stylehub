// Popup notification handler
function showNotification(message, type = 'success', autoClose = true) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification-popup');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-popup ${type}`;
    
    // Create content
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-message">${message}</div>
            <button class="notification-close">OK</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Force reflow to ensure animation works
    notification.offsetHeight;
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add event listener to close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after 5 seconds
    if (autoClose) {
        setTimeout(() => {
            if (document.body.contains(notification)) {
                closeNotification(notification);
            }
        }, 5000);
    }
    
    return notification;
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 300);
}

document.addEventListener('DOMContentLoaded', function() {
    // Apply to cart page only
    if (!window.location.pathname.includes('cart.html')) {
        return;
    }
    
    // Get place order button
    const placeOrderBtn = document.getElementById('place-order');
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check form validity if validateForm exists
            if (typeof validateForm === 'function' && !validateForm()) {
                return;
            }
            
            // Show loading state
            this.textContent = 'Processing...';
            this.disabled = true;
            
            // Simulate processing delay
            setTimeout(() => {
                // Generate random order number
                const orderNumber = Math.floor(Math.random() * 100000);
                
                // Hide checkout modal
                const checkoutModal = document.getElementById('checkout-modal');
                if (checkoutModal) {
                    checkoutModal.classList.remove('active');
                    setTimeout(() => {
                        checkoutModal.style.display = 'none';
                        
                        // Show notification
                        showNotification(`Order #${orderNumber} placed successfully! Thank you for your purchase.`);
                        
                        // Clear cart
                        localStorage.setItem('cart', JSON.stringify([]));
                        
                        // Update cart display
                        document.querySelectorAll('#cart-count').forEach(el => {
                            el.textContent = '0';
                        });
                        
                        // Show empty cart
                        const emptyCart = document.getElementById('cart-empty');
                        const cartContent = document.getElementById('cart-content');
                        if (emptyCart && cartContent) {
                            emptyCart.classList.remove('hidden');
                            cartContent.classList.add('hidden');
                        }
                        
                        // Reset button
                        this.textContent = 'Place Order';
                        this.disabled = false;
                    }, 300);
                }
            }, 1500);
        });
    }
}); 