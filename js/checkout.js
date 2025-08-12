// Checkout functionality
console.log('checkout.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Only run this code on the cart page
    if (!window.location.pathname.includes('cart.html')) {
        return;
    }
    
    console.log('Checkout functionality initializing');
    
    // Setup checkout modal
    const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout');
    const checkoutModal = document.getElementById('checkout-modal');
    
    if (proceedToCheckoutBtn && checkoutModal) {
        proceedToCheckoutBtn.addEventListener('click', function() {
            // Check if cart is empty before proceeding
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                console.log('Cannot checkout with empty cart');
                if (typeof showNotification === 'function') {
                    showNotification('Your cart is empty! Please add items before checking out.', 'error');
                } else {
                    alert('Your cart is empty! Please add items before checking out.');
                }
                return;
            }
            
            checkoutModal.style.display = 'block';
            setTimeout(() => {
                checkoutModal.classList.add('active');
            }, 100);
        });
    }
    
    // Setup modal close buttons
    const closeModalButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    });
    
    // Setup payment method toggle
    const creditCardRadio = document.getElementById('credit-card');
    const paypalRadio = document.getElementById('paypal');
    const creditCardForm = document.getElementById('credit-card-form');
    const paypalForm = document.getElementById('paypal-form');
    
    if (creditCardRadio && paypalRadio && creditCardForm && paypalForm) {
        creditCardRadio.addEventListener('change', function() {
            if (this.checked) {
                creditCardForm.classList.remove('hidden');
                paypalForm.classList.add('hidden');
            }
        });
        
        paypalRadio.addEventListener('change', function() {
            if (this.checked) {
                creditCardForm.classList.add('hidden');
                paypalForm.classList.remove('hidden');
            }
        });
    }
    
    // Place order button
    const placeOrderBtn = document.getElementById('place-order');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', showEducationalDisclaimer);
    }
    
    // Continue shopping button in confirmation
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            // Close the confirmation modal and redirect to home page
            document.getElementById('order-confirmation').classList.remove('active');
            setTimeout(() => {
                document.getElementById('order-confirmation').style.display = 'none';
                window.location.href = 'index.html';
            }, 300);
        });
    }
    
    // Function to show educational disclaimer instead of placing order
    function showEducationalDisclaimer() {
        console.log('Showing educational disclaimer instead of completing order');
        
        // Show loading state
        placeOrderBtn.textContent = 'Processing...';
        placeOrderBtn.disabled = true;
        
        // Simulate processing delay
        setTimeout(function() {
            // Hide checkout modal
            checkoutModal.classList.remove('active');
            setTimeout(() => {
                checkoutModal.style.display = 'none';
                
                // Get the confirmation content elements
                const confirmationModal = document.getElementById('order-confirmation');
                const orderNumberEl = document.getElementById('order-number');
                const orderEmailEl = document.getElementById('order-email');
                const confirmationImg = confirmationModal.querySelector('img');
                const confirmationTitle = confirmationModal.querySelector('h2');
                const confirmationText = confirmationModal.querySelectorAll('p')[0];
                const emailText = confirmationModal.querySelectorAll('p')[1];
                
                // Generate random order number for education
                const orderNumber = Math.floor(Math.random() * 100000);
                
                // Update elements with educational content
                if (orderNumberEl) orderNumberEl.textContent = orderNumber;
                if (orderEmailEl) {
                    const emailInput = document.getElementById('email');
                    orderEmailEl.textContent = emailInput ? emailInput.value : 'example@email.com';
                }
                
                if (confirmationTitle) confirmationTitle.textContent = 'Educational Website Notice';
                if (confirmationText) confirmationText.textContent = 'This is a demonstration website created for educational purposes only. No actual orders will be processed.';
                if (emailText) emailText.textContent = 'Thank you for exploring StyleHub!';
                
                // Display confirmation with animation
                confirmationModal.style.display = 'block';
                setTimeout(() => {
                    confirmationModal.classList.add('active');
                }, 100);
                
                // Clear cart
                localStorage.setItem('cart', JSON.stringify([]));
                
                // Update cart count display
                const cartCountElements = document.querySelectorAll('#cart-count');
                cartCountElements.forEach(el => {
                    el.textContent = '0';
                });
                
                // Show empty cart message
                const cartEmptyMessage = document.getElementById('cart-empty');
                const cartContent = document.getElementById('cart-content');
                
                if (cartEmptyMessage && cartContent) {
                    cartEmptyMessage.classList.remove('hidden');
                    cartContent.classList.add('hidden');
                }
                
                // Reset button state
                placeOrderBtn.textContent = 'Place Order';
                placeOrderBtn.disabled = false;
                
                // Log to console for debugging
                console.log('Displayed educational disclaimer, cart cleared');
            }, 300);
        }, 1500);
    }
    
    // Function to validate checkout form - kept for educational purposes
    function validateForm() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('.checkout-form [required]');
        
        // Reset previous error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        // Check each required field
        requiredFields.forEach(field => {
            field.classList.remove('error');
            
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Add error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                
                // Insert after field
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        });
        
        // Validate email format if provided
        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.value.trim() && !isValidEmail(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('error');
            
            // Add error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Please enter a valid email address';
            
            // Insert after field
            emailInput.parentNode.insertBefore(errorMsg, emailInput.nextSibling);
        }
        
        // If credit card is selected, validate card details
        const creditCardRadio = document.getElementById('credit-card');
        if (creditCardRadio && creditCardRadio.checked) {
            // Validate card number format
            const cardNumberInput = document.getElementById('card-number');
            if (cardNumberInput && cardNumberInput.value.trim() && !isValidCardNumber(cardNumberInput.value)) {
                isValid = false;
                cardNumberInput.classList.add('error');
                
                // Add error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid card number';
                
                // Insert after field
                cardNumberInput.parentNode.insertBefore(errorMsg, cardNumberInput.nextSibling);
            }
            
            // Validate expiry date format
            const expiryInput = document.getElementById('expiry-date');
            if (expiryInput && expiryInput.value.trim() && !isValidExpiryDate(expiryInput.value)) {
                isValid = false;
                expiryInput.classList.add('error');
                
                // Add error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid expiry date (MM/YY)';
                
                // Insert after field
                expiryInput.parentNode.insertBefore(errorMsg, expiryInput.nextSibling);
            }
            
            // Validate CVV format
            const cvvInput = document.getElementById('cvv');
            if (cvvInput && cvvInput.value.trim() && !isValidCVV(cvvInput.value)) {
                isValid = false;
                cvvInput.classList.add('error');
                
                // Add error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid CVV (3-4 digits)';
                
                // Insert after field
                cvvInput.parentNode.insertBefore(errorMsg, cvvInput.nextSibling);
            }
        }
        
        return isValid;
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function to validate card number format
    function isValidCardNumber(cardNumber) {
        // Remove spaces and dashes
        const cleanedNumber = cardNumber.replace(/[\s-]/g, '');
        
        // Check if contains only digits and has correct length
        return /^\d{13,19}$/.test(cleanedNumber);
    }
    
    // Helper function to validate expiry date format
    function isValidExpiryDate(expiryDate) {
        // Check format MM/YY
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            return false;
        }
        
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
        const currentMonth = currentDate.getMonth() + 1; // 1-12
        
        // Convert to numbers
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        
        // Validate month
        if (monthNum < 1 || monthNum > 12) {
            return false;
        }
        
        // Check if expired
        if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
            return false;
        }
        
        return true;
    }
    
    // Helper function to validate CVV format
    function isValidCVV(cvv) {
        // CVV should be 3-4 digits
        return /^\d{3,4}$/.test(cvv);
    }
    
    // Function to clear cart
    function clearCart() {
        // Clear cart from localStorage
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
}); 