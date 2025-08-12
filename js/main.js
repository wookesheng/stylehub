// Main JavaScript file for general functionality
console.log('main.js loaded');

// Global debug logger
function debug(message, data) {
    const DEBUG = true; // Set to false to disable debug logs in production
    if (DEBUG) {
        if (data) {
            console.log(`[DEBUG] ${message}`, data);
        } else {
            console.log(`[DEBUG] ${message}`);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (for responsive design)
    const setupMobileMenu = () => {
        const header = document.querySelector('header');
        if (header) {
            const mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.className = 'mobile-menu-btn';
            mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
            header.querySelector('.container').prepend(mobileMenuBtn);

            const nav = header.querySelector('nav');
            mobileMenuBtn.addEventListener('click', function() {
                nav.classList.toggle('active');
                this.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!nav.contains(event.target) && !mobileMenuBtn.contains(event.target) && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            });
        }
    };

    // Initialize responsive menu for mobile devices
    setupMobileMenu();

    // Handle Quick View functionality
    const setupQuickView = () => {
        // Get modal elements
        const modal = document.getElementById('quick-view-modal');
        const closeBtn = document.querySelector('.close-modal');
        
        // Product data for quick view
        const productData = {
            1: {
                name: 'Casual T-Shirt',
                price: 29.99,
                category: 'T-Shirts',
                sku: 'TS001-BK-M',
                description: 'This comfortable and stylish casual t-shirt is perfect for everyday wear. Made from 100% cotton for breathability and comfort.',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            2: {
                name: 'Slim Fit Jeans',
                price: 49.99,
                category: 'Pants',
                sku: 'PJ002-BL-32',
                description: 'Classic slim fit jeans that provide both comfort and style. Made from high-quality denim that offers durability and a perfect fit.',
                image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            3: {
                name: 'Summer Dress',
                price: 39.99,
                category: 'Dresses',
                sku: 'DS003-FL-S',
                description: 'Lightweight and comfortable summer dress with a beautiful floral pattern. Perfect for warm days and casual outings.',
                image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            4: {
                name: 'Cargo Pants',
                price: 45.99,
                category: 'Pants',
                sku: 'PC004-GN-34',
                description: 'Durable cargo pants with multiple pockets for practical storage. Made from sturdy cotton blend that offers comfort and durability.',
                image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            5: {
                name: 'Graphic T-Shirt',
                price: 34.99,
                category: 'T-Shirts',
                sku: 'TS005-BK-L',
                description: 'Stand out with this unique graphic t-shirt featuring a bold skeletal hand peace sign design. Made from premium cotton for maximum comfort and durability.',
                image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            6: {
                name: 'Formal Dress',
                price: 89.99,
                category: 'Dresses',
                sku: 'DS006-RD-M',
                description: 'Elegant formal dress perfect for special occasions. Features a flattering silhouette and premium fabric that drapes beautifully.',
                image: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            7: {
                name: 'Denim Jacket',
                price: 59.99,
                category: 'Outerwear',
                sku: 'OJ007-BL-M',
                description: 'Classic denim jacket that never goes out of style. Versatile design that can be layered over any outfit. Made from durable denim that gets better with age.',
                image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            8: {
                name: 'Chino Pants',
                price: 42.99,
                category: 'Pants',
                sku: 'PC008-KH-32',
                description: 'Versatile chino pants that transition effortlessly from casual to smart-casual occasions. Made from comfortable, durable cotton with a classic fit.',
                image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            }
        };
        
        // Function to open modal with product details
        const openQuickView = (productId) => {
            const product = productData[productId];
            if (!product) {
                console.error(`Product with ID ${productId} not found in product data.`);
                return;
            }
            
            console.log(`Opening quick view for product: ${product.name} (ID: ${productId})`);
            
            try {
                // Update modal content with product details
                document.getElementById('quick-view-name').textContent = product.name;
                document.getElementById('quick-view-price').textContent = `RM${product.price.toFixed(2)}`;
                document.getElementById('quick-view-description').textContent = product.description;
                document.getElementById('quick-view-category').textContent = product.category;
                document.getElementById('quick-view-sku').textContent = product.sku;
                document.getElementById('quick-view-image').src = product.image;
                document.getElementById('quick-view-details').href = `product-detail.html?id=${productId}`;
                
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            } catch (error) {
                console.error('Error updating quick view modal:', error);
            }
        };
        
        // Close modal when clicking the X
        if(closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Add quick view buttons to product cards
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            // Create or find quick view element
            let quickViewElement = card.querySelector('.quick-view');
            
            if (!quickViewElement) {
                quickViewElement = document.createElement('div');
                quickViewElement.className = 'quick-view';
                quickViewElement.textContent = 'Quick View';
                card.querySelector('.product-image').appendChild(quickViewElement);
            }
            
            // Add click event to quick view button
            quickViewElement.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click (which navigates to product detail)
                const productId = card.dataset.id;
                console.log(`Quick view clicked for product ID: ${productId}`);
                openQuickView(productId);
            });
        });
        
        // Add event listener to quick add to cart button
        const quickAddToCartBtn = document.querySelector('.quick-add-to-cart');
        if (quickAddToCartBtn) {
            quickAddToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Quick Add to Cart button clicked');
                
                // Get product data
                const productName = document.getElementById('quick-view-name').textContent;
                const productPrice = parseFloat(document.getElementById('quick-view-price').textContent.replace('RM', ''));
                const productDetailsLink = document.getElementById('quick-view-details').href;
                const productId = productDetailsLink.split('id=')[1];
                const productCategory = document.getElementById('quick-view-category').textContent;
                const productImg = document.getElementById('quick-view-image').src;
                
                console.log('Quick view product data:', {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    category: productCategory
                });
                
                // Get cart from localStorage
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                
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
                localStorage.setItem('cart', JSON.stringify(cart));
                console.log('Cart saved to localStorage:', cart);
                
                // Update cart count
                const cartCountElement = document.getElementById('cart-count');
                if (cartCountElement) {
                    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                    cartCountElement.textContent = totalItems;
                    console.log('Cart count updated:', totalItems);
                }
                
                // Show feedback
                this.textContent = 'Added!';
                this.disabled = true;
                this.style.backgroundColor = '#4CAF50';
                
                // Show notification
                showNotification(`${productName} has been added to your cart!`);
                
                // Close modal after a delay
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                    this.disabled = false;
                    this.style.backgroundColor = '';
                    
                    // Close modal
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }, 1500);
            });
        }
    };
    
    // Initialize quick view
    setupQuickView();

    // Product hover effect enhancement
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
        
        // Make product cards clickable to navigate to product detail page
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on Add to Cart button
            if (e.target.classList.contains('add-to-cart')) {
                return;
            }
            
            const productId = this.dataset.id;
            window.location.href = `product-detail.html?id=${productId}`;
        });
        
        // Make product title clickable
        const productTitle = card.querySelector('h3');
        if (productTitle) {
            productTitle.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent double navigation from card click
                const productId = card.dataset.id;
                window.location.href = `product-detail.html?id=${productId}`;
            });
        }
        
        // Make product image clickable
        const productImage = card.querySelector('.product-image');
        if (productImage) {
            productImage.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent double navigation from card click
                const productId = card.dataset.id;
                window.location.href = `product-detail.html?id=${productId}`;
            });
        }
    });

    // Handle category filtering on products page
    const filterLinks = document.querySelectorAll('.filter-link');
    const productGrid = document.querySelector('.product-grid');
    
    if (filterLinks.length && productGrid) {
        filterLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active class
                filterLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.dataset.category;
                
                // Filter products
                const products = productGrid.querySelectorAll('.product-card');
                products.forEach(product => {
                    if (category === 'all' || product.dataset.category === category) {
                        product.style.display = '';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }

    // Handle price range filtering
    const priceRange = document.getElementById('price-range');
    const maxPriceDisplay = document.getElementById('max-price');
    
    if (priceRange && maxPriceDisplay) {
        priceRange.addEventListener('input', function() {
            const maxPrice = this.value;
            maxPriceDisplay.textContent = `RM${maxPrice}`;
            
            // Filter products by price
            const products = document.querySelectorAll('.product-card');
            products.forEach(product => {
                const price = parseFloat(product.dataset.price);
                if (price <= maxPrice) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }

    // Handle sorting on products page
    const sortSelect = document.getElementById('sort');
    
    if (sortSelect && productGrid) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const products = Array.from(productGrid.querySelectorAll('.product-card'));
            
            // Sort products
            products.sort((a, b) => {
                const aName = a.dataset.name;
                const bName = b.dataset.name;
                const aPrice = parseFloat(a.dataset.price);
                const bPrice = parseFloat(b.dataset.price);
                
                switch(sortValue) {
                    case 'price-low':
                        return aPrice - bPrice;
                    case 'price-high':
                        return bPrice - aPrice;
                    case 'name-asc':
                        return aName.localeCompare(bName);
                    case 'name-desc':
                        return bName.localeCompare(aName);
                    default:
                        return 0;
                }
            });
            
            // Re-append products in sorted order
            products.forEach(product => {
                productGrid.appendChild(product);
            });
        });
    }

    // Check for URL parameters to set initial filters
    const applyUrlFilters = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        if (categoryParam && filterLinks.length) {
            const categoryLink = Array.from(filterLinks).find(link => link.dataset.category === categoryParam);
            if (categoryLink) {
                categoryLink.click();
            }
        }
    };
    
    // Apply URL filters if on products page
    if (window.location.pathname.includes('products.html')) {
        applyUrlFilters();
    }
});

// Add a global notification function that can be used across all pages
// This should be placed at the global scope, outside any functions
function showNotification(message, type = 'success', autoClose = true) {
    console.log('Showing notification:', message);
    
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification-popup');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-popup ${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-message">${message}</div>
            <div class="notification-close">&times;</div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Auto close after 3 seconds
    if (autoClose) {
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    return notification;
} 