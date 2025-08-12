// Product Detail Page JavaScript
console.log('product-detail.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page if this is the product detail page
    if (window.location.pathname.includes('product-detail.html')) {
        console.log('Initializing product detail page');
        initProductDetail();
    }
});

function initProductDetail() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        console.log('Loading product with ID:', productId);
        loadProductDetails(productId);
        
        // Set up quantity controls
        setupQuantityControls();
        
        // NOTE: We no longer set up the Add to Cart button here
        // This is now handled exclusively by cart-handler.js
        // setupAddToCartButton(productId);
        
        // Set up tabs
        setupTabs();
    } else {
        console.error('No product ID found in URL');
    }
}

function loadProductDetails(productId) {
    console.log('Loading details for product ID:', productId);
    
    // Call the loadProductData function which contains all our product data
    // This function is already defined at the bottom of this file
    const productData = loadProductData();
    
    // Get the product data for this specific productId
    const product = productData[productId];
    
    if (!product) {
        console.error('Product not found for ID:', productId);
        return;
    }
    
    console.log('Found product data:', product);
    
    // Update page title
    document.title = `${product.name} - StyleHub`;
    
    // Update breadcrumbs and product name
    const productNameElement = document.getElementById('product-name');
    if (productNameElement) {
        productNameElement.textContent = product.name;
    }
    
    // Update product details
    const detailProductName = document.getElementById('detail-product-name');
    const detailProductPrice = document.getElementById('detail-product-price');
    const productCategory = document.getElementById('detail-product-category');
    const productSku = document.getElementById('detail-product-sku');
    const productTags = document.getElementById('detail-product-tags');
    const mainProductImage = document.getElementById('main-product-image');
    const detailProductDescription = document.getElementById('detail-product-description');
    
    if (detailProductName) detailProductName.textContent = product.name;
    if (detailProductPrice) detailProductPrice.textContent = `RM${product.price.toFixed(2)}`;
    if (productCategory) productCategory.textContent = product.category;
    if (productSku) productSku.textContent = product.sku;
    if (productTags) productTags.textContent = product.tags;
    if (detailProductDescription) detailProductDescription.textContent = product.description;
    if (mainProductImage) {
        mainProductImage.src = product.mainImage;
        mainProductImage.alt = product.name;
    }
    
    // Update product tabs content
    updateProductTabs(product);
}

function updateProductTabs(product) {
    // Update description tab
    const descriptionTab = document.getElementById('description');
    if (descriptionTab) {
        let descriptionHTML = `<h2>Product Description</h2>`;
        descriptionHTML += `<p>${product.fullDescription || product.description}</p>`;
        
        // Add additional paragraphs if needed based on product type
        if (product.category === 'Dresses') {
            descriptionHTML += `<p>This versatile ${product.name.toLowerCase()} can be dressed up with accessories for special occasions or worn casually for everyday events. The quality fabric drapes beautifully and resists wrinkling, making it perfect for travel.</p>`;
            descriptionHTML += `<p>Available in multiple colors and sizes to suit your personal style and preferences. Each dress is carefully crafted with attention to detail, ensuring a flattering fit and lasting quality.</p>`;
        } else if (product.category === 'T-Shirts') {
            descriptionHTML += `<p>This ${product.name.toLowerCase()} pairs well with jeans, shorts, or layered under a jacket for a more polished look. The versatile design makes it suitable for various occasions from casual outings to relaxed social gatherings.</p>`;
            descriptionHTML += `<p>Available in multiple colors and sizes to match your personal style. Each shirt is carefully crafted with attention to detail, ensuring high-quality stitching and durability that will keep it looking great wash after wash.</p>`;
        } else if (product.category === 'Pants') {
            descriptionHTML += `<p>These ${product.name.toLowerCase()} combine style and functionality for everyday wear. The thoughtful design includes convenient pockets and quality construction that will maintain its shape and appearance through regular use.</p>`;
            descriptionHTML += `<p>Available in multiple colors and sizes to match your personal style. Each pair is carefully crafted with attention to detail, ensuring durability and comfort for years to come.</p>`;
        }
        
        descriptionTab.innerHTML = descriptionHTML;
    }
    
    // Update specifications tab
    const specificationsTab = document.getElementById('specifications');
    if (specificationsTab && product.specifications) {
        let specsHTML = `<h2>Product Specifications</h2>`;
        specsHTML += `<table class="specs-table">`;
        
        for (const [key, value] of Object.entries(product.specifications)) {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            specsHTML += `<tr><th>${formattedKey}</th><td>${value}</td></tr>`;
        }
        
        specsHTML += `</table>`;
        specificationsTab.innerHTML = specsHTML;
    }
    
    // Update reviews tab
    const reviewsTab = document.getElementById('reviews');
    if (reviewsTab && product.reviews) {
        // Calculate average rating
        const totalStars = product.reviews.reduce((sum, review) => sum + review.stars, 0);
        const averageRating = totalStars / product.reviews.length;
        
        // Count ratings by star level
        const starCounts = [0, 0, 0, 0, 0]; // 1-5 stars
        product.reviews.forEach(review => {
            starCounts[review.stars - 1]++;
        });
        
        let reviewsHTML = `<h2>Customer Reviews</h2>`;
        reviewsHTML += `<div class="review-summary">`;
        reviewsHTML += `<div class="average-rating">`;
        reviewsHTML += `<h3>${averageRating.toFixed(1)}</h3>`;
        reviewsHTML += `<div class="stars">`;
        
        // Add full stars
        for (let i = 0; i < Math.floor(averageRating); i++) {
            reviewsHTML += `<i class="fa fa-star"></i>`;
        }
        
        // Add half star if needed
        if (averageRating % 1 >= 0.5) {
            reviewsHTML += `<i class="fa fa-star-half-o"></i>`;
        } else if (averageRating % 1 > 0) {
            reviewsHTML += `<i class="fa fa-star-o"></i>`;
        }
        
        // Add empty stars
        for (let i = Math.ceil(averageRating); i < 5; i++) {
            reviewsHTML += `<i class="fa fa-star-o"></i>`;
        }
        
        reviewsHTML += `</div>`; // Close stars div
        reviewsHTML += `<p>Based on ${product.reviews.length} reviews</p>`;
        reviewsHTML += `</div>`; // Close average-rating div
        
        // Add rating bars
        reviewsHTML += `<div class="rating-bars">`;
        for (let i = 5; i >= 1; i--) {
            const percentage = product.reviews.length > 0 ? (starCounts[i - 1] / product.reviews.length) * 100 : 0;
            reviewsHTML += `
                <div class="rating-bar">
                    <span>${i} ★</span>
                    <div class="bar-container">
                        <div class="bar" style="width: ${percentage}%;"></div>
                    </div>
                    <span>${starCounts[i - 1]}</span>
                </div>
            `;
        }
        reviewsHTML += `</div>`; // Close rating-bars div
        reviewsHTML += `</div>`; // Close review-summary div
        
        // Add individual reviews
        reviewsHTML += `<div class="customer-reviews">`;
        product.reviews.forEach(review => {
            reviewsHTML += `
                <div class="review">
                    <div class="review-header">
                        <div class="reviewer">
                            <h4>${review.name}</h4>
                            <span class="stars">
                `;
                
                // Add stars
                for (let i = 0; i < 5; i++) {
                    if (i < review.stars) {
                        reviewsHTML += `<i class="fa fa-star"></i>`;
                    } else {
                        reviewsHTML += `<i class="fa fa-star-o"></i>`;
                    }
                }
                
                reviewsHTML += `
                            </span>
                        </div>
                        <span class="review-date">${review.date}</span>
                    </div>
                    <p class="review-text">${review.text}</p>
                </div>
            `;
        });
        reviewsHTML += `</div>`; // Close customer-reviews div
        
        reviewsTab.innerHTML = reviewsHTML;
    }
}

function setupQuantityControls() {
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('product-quantity');
    
    if (decreaseBtn && increaseBtn && quantityInput) {
        console.log('Setting up quantity controls');
        
        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
        
        // Validate manual input
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            }
        });
    } else {
        console.error('Quantity control elements not found');
    }
}

// We're removing setupAddToCartButton function to avoid conflict with cart-handler.js

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length && tabContents.length) {
        console.log('Setting up tabs');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current button
                this.classList.add('active');
                
                // Show corresponding content
                const tabId = this.dataset.tab;
                document.getElementById(tabId).classList.add('active');
            });
        });
    } else {
        console.error('Tab elements not found');
    }
}

// For demo purposes, we'll simulate loading product data
// In a real application, this would fetch data from an API
const loadProductData = () => {
    // Dummy product data (in a real app, this would come from a database/API)
    const productData = {
        1: {
            name: 'Casual T-Shirt',
            price: 29.99,
            category: 'T-Shirts',
            sku: 'TS001-BK-M',
            tags: 'casual, cotton, summer',
            mainImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            description: 'This comfortable and stylish casual t-shirt is perfect for everyday wear. Made from 100% cotton for breathability and comfort. Available in multiple colors and sizes.',
            fullDescription: 'This casual t-shirt is designed for maximum comfort and style. Made from premium quality 100% cotton, it offers breathability and softness that lasts all day long. The classic design features a regular fit with short sleeves and a round neckline that makes it versatile for various occasions.',
            specifications: {
                material: '100% Cotton',
                fit: 'Regular',
                neckStyle: 'Round',
                sleeveLength: 'Short',
                careInstructions: 'Machine wash cold, tumble dry low',
                countryOfOrigin: 'Imported'
            },
            reviews: [
                {
                    name: 'John D.',
                    stars: 5,
                    date: '2 weeks ago',
                    text: 'Great quality t-shirt! The fabric is comfortable and the fit is perfect. I\'ve washed it several times and it still looks new. Definitely will buy more colors.'
                },
                {
                    name: 'Sarah M.',
                    stars: 5,
                    date: '1 month ago',
                    text: 'I love this t-shirt! The material is soft and breathable, perfect for summer. I ordered a medium and it fits exactly as expected.'
                },
                {
                    name: 'Mike T.',
                    stars: 4,
                    date: '2 months ago',
                    text: 'Good quality for the price. The shirt fits well but slightly shorter than I expected. Still comfortable and looks nice.'
                }
            ]
        },
        2: {
            name: 'Slim Fit Jeans',
            price: 49.99,
            category: 'Pants',
            sku: 'PJ002-BL-32',
            tags: 'denim, slim fit, casual',
            mainImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1475178626620-a4d074967452?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Classic slim fit jeans that provide both comfort and style. Made from high-quality denim that offers durability and a perfect fit. Ideal for casual everyday wear.',
            fullDescription: 'These premium slim fit jeans combine style and comfort for the perfect everyday look. Made with high-quality denim that contains just the right amount of stretch, they contour to your body while maintaining their shape all day long. The classic five-pocket design and versatile wash make these jeans easy to pair with any top in your wardrobe.',
            specifications: {
                material: '98% Cotton, 2% Elastane',
                fit: 'Slim',
                closure: 'Button and zipper fly',
                pockets: '5 pockets (2 front, 2 back, 1 coin)',
                careInstructions: 'Machine wash cold, inside out',
                countryOfOrigin: 'Imported'
            },
            reviews: [
                {
                    name: 'Alex K.',
                    stars: 5,
                    date: '1 week ago',
                    text: 'These jeans fit perfectly! The slight stretch makes them comfortable for all-day wear. I\'ve already ordered a second pair.'
                },
                {
                    name: 'Jennifer P.',
                    stars: 4,
                    date: '3 weeks ago',
                    text: 'Great quality denim and nice fit. The color is exactly as shown in the pictures. Only reason for 4 stars is they\'re a bit longer than expected.'
                },
                {
                    name: 'David M.',
                    stars: 5,
                    date: '1 month ago',
                    text: 'Best jeans I\'ve owned in years. The slim fit is perfect - not too tight but still looks tailored. Will definitely buy again.'
                }
            ]
        },
        3: {
            name: 'Summer Dress',
            price: 39.99,
            category: 'Dresses',
            sku: 'DS003-FL-S',
            tags: 'summer, floral, casual',
            mainImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Lightweight and comfortable summer dress with a beautiful floral pattern. Perfect for warm days and casual outings. Made from breathable fabric for all-day comfort.',
            fullDescription: 'This stunning summer dress is designed for both style and comfort during the warmest days. The lightweight, breathable fabric flows beautifully with every movement, while the elegant cut flatters your silhouette. The adjustable straps and gentle elastic at the back ensure a perfect fit for various body types. Ideal for beach days, casual outings, or dressed up with accessories for evening events.',
            specifications: {
                material: '100% Rayon',
                fit: 'Relaxed',
                length: 'Midi',
                neckline: 'V-neck',
                straps: 'Adjustable',
                careInstructions: 'Hand wash cold, line dry',
                countryOfOrigin: 'Imported'
            },
            reviews: [
                {
                    name: 'Emma S.',
                    stars: 5,
                    date: '2 weeks ago',
                    text: 'Absolutely love this dress! The fabric is so light and comfortable, perfect for hot summer days. I\'ve received so many compliments when wearing it.'
                },
                {
                    name: 'Rebecca L.',
                    stars: 4,
                    date: '1 month ago',
                    text: 'Beautiful dress and exactly as pictured. The material is high quality and very comfortable. Only giving 4 stars because I had to adjust the straps quite a bit.'
                },
                {
                    name: 'Amanda J.',
                    stars: 5,
                    date: '5 weeks ago',
                    text: 'This dress exceeded my expectations! The fit is flattering and the fabric doesn\'t wrinkle easily. I wore it on vacation and it was perfect for both day and evening with different accessories.'
                }
            ]
        },
        4: {
            name: 'Cargo Pants',
            price: 45.99,
            category: 'Pants',
            sku: 'PC004-GN-34',
            tags: 'cargo, casual, outdoor',
            mainImage: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1517438476312-10d79c077509?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1509551388413-e18d05e4779c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Durable cargo pants with multiple pockets for practical storage. Made from sturdy cotton blend that offers comfort and durability. Great for outdoor activities and casual wear.',
            fullDescription: 'These versatile cargo pants are built for adventure and everyday wear. Constructed from a durable yet comfortable cotton twill fabric, they can withstand the rigors of outdoor activities while maintaining a stylish look. The multiple functional pockets provide convenient storage for all your essentials, making these pants perfect for hiking, travel, or casual outings. The relaxed fit allows for ease of movement without sacrificing style.',
            specifications: {
                material: '100% Cotton Twill',
                fit: 'Relaxed',
                closure: 'Button and zipper fly',
                pockets: '6 pockets (2 front, 2 back, 2 cargo)',
                careInstructions: 'Machine wash cold, tumble dry low',
                countryOfOrigin: 'Imported'
            },
            reviews: [
                {
                    name: 'Chris H.',
                    stars: 5,
                    date: '3 weeks ago',
                    text: 'These cargo pants are fantastic! Plenty of pocket space and the material is substantial without being too heavy. Great for hiking and outdoor activities.'
                },
                {
                    name: 'Jason M.',
                    stars: 4,
                    date: '1 month ago',
                    text: 'Very comfortable pants with useful pockets. They run slightly large, so I recommend sizing down if you\'re between sizes. Material seems durable.'
                },
                {
                    name: 'Ryan T.',
                    stars: 5,
                    date: '2 months ago',
                    text: 'Perfect for camping and hiking! These pants have withstood multiple outdoor trips and still look great. The pockets are fantastic for carrying small gear items.'
                }
            ]
        },
        5: {
            name: 'Graphic T-Shirt',
            price: 34.99,
            category: 'T-Shirts',
            sku: 'TS005-BK-L',
            tags: 'graphic, cotton, trendy',
            mainImage: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Stand out with this unique graphic t-shirt featuring a bold skeletal hand peace sign design. Made from premium cotton for maximum comfort and durability. Perfect for casual everyday wear or making a statement.',
            fullDescription: 'Express your individuality with this striking graphic t-shirt featuring our exclusive skeletal hand peace sign design. Crafted from high-quality ringspun cotton, this shirt offers exceptional softness and durability that will maintain its shape and print quality wash after wash. The relaxed fit and premium stitching ensure comfort throughout the day, while the bold graphic makes a statement wherever you go. Perfect for pairing with jeans or layering under jackets.',
            specifications: {
                material: '100% Ringspun Cotton',
                fit: 'Regular',
                neckStyle: 'Crew neck',
                sleeveLength: 'Short',
                printTechnique: 'Screen printing',
                careInstructions: 'Machine wash cold, inside out',
                countryOfOrigin: 'Locally made'
            },
            reviews: [
                {
                    name: 'Tyler K.',
                    stars: 5,
                    date: '1 week ago',
                    text: 'Love the design on this shirt! The print quality is excellent, and the shirt itself is super comfortable. I\'ve washed it several times and the graphic still looks perfect.'
                },
                {
                    name: 'Alicia P.',
                    stars: 5,
                    date: '3 weeks ago',
                    text: 'This is now my favorite t-shirt. The graphic is even better in person, and I\'ve gotten so many compliments on it. The fabric is soft and high quality.'
                },
                {
                    name: 'Mark D.',
                    stars: 4,
                    date: '1 month ago',
                    text: 'Great quality shirt with an awesome design. The fit is perfect for me. Only reason for 4 stars instead of 5 is that it shrunk slightly after washing, even following the care instructions.'
                }
            ]
        },
        6: {
            name: 'Formal Dress',
            price: 89.99,
            category: 'Dresses',
            sku: 'DS006-RD-M',
            tags: 'formal, elegant, special occasion',
            mainImage: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1572122358779-2e119547b87e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Elegant formal dress perfect for special occasions. Features a flattering silhouette and premium fabric that drapes beautifully. The rich color and subtle details make this dress a standout choice for formal events and celebrations.',
            fullDescription: 'This stunning formal dress is designed to make a statement at any special occasion. Crafted from luxurious fabric with a subtle sheen, it features an elegant silhouette that flatters the figure. The bodice is intricately detailed with fine embroidery, while the flowing skirt creates a graceful movement with every step. The rich color and exquisite craftsmanship make this dress a perfect choice for weddings, galas, and formal dinners.',
            specifications: {
                material: '95% Polyester, 5% Spandex',
                fit: 'Fitted bodice with A-line skirt',
                length: 'Floor length',
                neckline: 'Sweetheart',
                back: 'Hidden zipper closure',
                lining: 'Fully lined',
                careInstructions: 'Dry clean only',
                countryOfOrigin: 'Imported'
            },
            reviews: [
                {
                    name: 'Victoria R.',
                    stars: 5,
                    date: '2 weeks ago',
                    text: 'This dress is absolutely stunning! I wore it to a wedding and received countless compliments. The fabric is luxurious and the fit is incredibly flattering. Worth every penny!'
                },
                {
                    name: 'Sophia K.',
                    stars: 4,
                    date: '1 month ago',
                    text: 'Beautiful formal dress with excellent craftsmanship. The color is rich and exactly as pictured. The only reason for 4 stars instead of 5 is that I needed some minor alterations for a perfect fit.'
                },
                {
                    name: 'Elizabeth M.',
                    stars: 5,
                    date: '6 weeks ago',
                    text: 'Exceptional quality for the price! This dress looks much more expensive than it is. The fabric has a beautiful weight to it and the design is timeless. I\'ll be wearing this for many formal occasions to come.'
                }
            ]
        },
        7: {
            name: 'Denim Jacket',
            price: 59.99,
            category: 'Outerwear',
            sku: 'OJ007-BL-M',
            tags: 'denim, jacket, casual',
            mainImage: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Classic denim jacket that never goes out of style. Versatile design that can be layered over any outfit. Made from durable denim that gets better with age.',
            fullDescription: 'This timeless denim jacket is a wardrobe essential that transcends seasons and trends. Crafted from premium quality denim with just the right amount of stretch for comfort, it features classic details like button flap chest pockets, side welt pockets, and adjustable button cuffs. The versatile medium wash complements any outfit, making it perfect for layering in any season. Like all great denim pieces, this jacket will develop a unique character and get better with age, conforming to your body and developing a personalized fade pattern over time.',
            specifications: {
                material: '99% Cotton, 1% Elastane',
                fit: 'Regular',
                closure: 'Button front',
                pockets: '4 pockets (2 chest, 2 side)',
                washEffect: 'Medium wash with light fading',
                careInstructions: 'Machine wash cold, inside out',
                countryOfOrigin: 'Imported'
            },
            reviews: [
                {
                    name: 'James L.',
                    stars: 5,
                    date: '3 weeks ago',
                    text: 'This jacket has quickly become my go-to piece. The quality is excellent, and it has the perfect amount of stretch for comfort. The fit is spot on - not too bulky but still has room for a sweater underneath.'
                },
                {
                    name: 'Olivia N.',
                    stars: 5,
                    date: '1 month ago',
                    text: 'I\'ve been looking for the perfect denim jacket for years, and I\'ve finally found it! The wash is versatile, the denim quality is substantial, and the cut is flattering. It looks great with dresses or jeans.'
                },
                {
                    name: 'Ethan P.',
                    stars: 4,
                    date: '2 months ago',
                    text: 'Great quality jacket with classic styling. The denim is sturdy but comfortable. Only giving 4 stars because the sleeves are a bit long for me, but otherwise perfect.'
                }
            ]
        },
        8: {
            name: 'Chino Pants',
            price: 42.99,
            category: 'Pants',
            sku: 'PC008-KH-32',
            tags: 'chino, casual, smart-casual',
            mainImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1506629082955-511a1e0c3c0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Versatile chino pants that transition effortlessly from casual to smart-casual occasions. Made from comfortable, durable cotton with a classic fit. Perfect for work, weekends, and everything in between.',
            fullDescription: 'These classic chino pants offer unmatched versatility for your wardrobe. Crafted from premium cotton twill with a touch of stretch for comfort, they feature a timeless straight-leg design that works for both casual and more formal settings. The clean lines and subtle details make these pants appropriate for the office, dinner out, or weekend activities. With their durable construction and comfortable fit, these chinos will quickly become your go-to pants for any occasion.',
            specifications: {
                material: '98% Cotton, 2% Elastane',
                fit: 'Straight leg',
                rise: 'Mid-rise',
                closure: 'Button and zipper fly',
                pockets: '4 pockets (2 front, 2 back)',
                careInstructions: 'Machine wash cold, tumble dry low',
                countryOfOrigin: 'Imported'
            },
            reviews: [
                {
                    name: 'Michael B.',
                    stars: 5,
                    date: '2 weeks ago',
                    text: 'These chinos are exactly what I was looking for - comfortable enough for everyday wear but polished enough for the office. The fabric has a nice weight to it and the fit is perfect.'
                },
                {
                    name: 'Robert K.',
                    stars: 4,
                    date: '1 month ago',
                    text: 'Great quality pants at a reasonable price. The material is soft yet durable, and the color is exactly as shown online. Taking off one star because they wrinkle a bit more easily than expected.'
                },
                {
                    name: 'Daniel W.',
                    stars: 5,
                    date: '6 weeks ago',
                    text: 'I now own these chinos in three colors - they\'re that good! The fit is consistent across all pairs, and they hold up well to regular washing. Highly recommend for versatile, everyday pants.'
                }
            ]
        }
    };
    
    return productData;
} 