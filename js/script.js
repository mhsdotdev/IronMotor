// Global State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        name: "Porsche 911 GT3 Wall Art",
        price: 299,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "sports",
        description: "Minimalist Porsche 911 GT3 silhouette with premium black frame",
        customization: {
            sizes: ["30x40cm", "40x60cm", "50x70cm"],
            colors: ["Black", "White", "Silver", "Walnut"]
        }
    },
    {
        id: 2,
        name: "Lamborghini Aventador Decor",
        price: 349,
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "sports",
        description: "Elegant Lamborghini Aventador design with chrome accents",
        customization: {
            sizes: ["30x40cm", "40x60cm", "50x70cm"],
            colors: ["Black", "White", "Silver", "Gold"]
        }
    },
    {
        id: 3,
        name: "Mercedes AMG GT Art",
        price: 279,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "luxury",
        description: "Sophisticated Mercedes AMG GT silhouette for modern interiors",
        customization: {
            sizes: ["30x40cm", "40x60cm", "50x70cm"],
            colors: ["Black", "White", "Silver", "Rose Gold"]
        }
    },
    {
        id: 4,
        name: "Ferrari F40 Classic",
        price: 399,
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "classic",
        description: "Vintage Ferrari F40 design with distressed wood frame",
        customization: {
            sizes: ["30x40cm", "40x60cm", "50x70cm"],
            colors: ["Black", "Brown", "Distressed Wood", "Vintage Gold"]
        }
    },
    {
        id: 5,
        name: "BMW M4 GTS Art",
        price: 269,
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "sports",
        description: "Modern BMW M4 GTS design with carbon fiber texture",
        customization: {
            sizes: ["30x40cm", "40x60cm", "50x70cm"],
            colors: ["Black", "Carbon", "Blue", "Red"]
        }
    },
    {
        id: 6,
        name: "Audi R8 V10 Plus",
        price: 319,
        image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "luxury",
        description: "Sleek Audi R8 design with brushed aluminum frame",
        customization: {
            sizes: ["30x40cm", "40x60cm", "50x70cm"],
            colors: ["Black", "Silver", "Brushed Aluminum", "Titanium"]
        }
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    products = sampleProducts;
    initializeNavigation();
    initializeCart();
    
    // Page-specific initializations
    if (document.querySelector('.hero')) {
        initializeHomepage();
    }
    
    if (document.querySelector('.shop-content')) {
        initializeShopPage();
    }
    
    if (document.querySelector('.about-header')) {
        initializeAboutPage();
    }
    
    updateCartCount();
}

// Navigation
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const cartToggle = document.querySelector('.cart-toggle');
    const cartClose = document.querySelector('.cart-close');
    const cartOverlay = document.querySelector('.cart-overlay');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    if (cartToggle) {
        cartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', toggleCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', toggleCart);
    }

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Cart Management
function initializeCart() {
    loadCart();
    renderCartItems();
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product, customization = {}) {
    const cartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        customization: customization,
        quantity: 1
    };

    const existingItem = cart.find(item => 
        item.productId === product.id && 
        JSON.stringify(item.customization) === JSON.stringify(customization)
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartItem);
    }

    saveCart();
    updateCartCount();
    renderCartItems();
    showAddToCartAnimation();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            renderCartItems();
        }
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function renderCartItems() {
    const cartItems = document.querySelector('.cart-items');
    const totalPrice = document.querySelector('.total-price');
    
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (totalPrice) totalPrice.textContent = 'AED 0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">AED ${item.price}</div>
                ${item.customization.size ? `<div class="cart-item-custom">Size: ${item.customization.size}</div>` : ''}
                ${item.customization.color ? `<div class="cart-item-custom">Color: ${item.customization.color}</div>` : ''}
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})" style="margin-left: 8px; color: #dc2626;">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    if (totalPrice) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPrice.textContent = `AED ${total.toFixed(2)}`;
    }
}

function toggleCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        renderCartItems();
    }
}

function showAddToCartAnimation() {
    // Create flying item animation
    const animation = document.createElement('div');
    animation.style.cssText = `
        position: fixed;
        width: 40px;
        height: 40px;
        background: var(--primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: all 0.6s ease;
    `;
    document.body.appendChild(animation);

    // Animate to cart position
    setTimeout(() => {
        const cartBtn = document.querySelector('.cart-toggle');
        const rect = cartBtn.getBoundingClientRect();
        animation.style.transform = `translate(${rect.left - 50}px, ${rect.top - 50}px) scale(0.1)`;
        animation.style.opacity = '0';
    }, 10);

    // Remove animation element
    setTimeout(() => {
        animation.remove();
    }, 600);
}

// Homepage
function initializeHomepage() {
    initializeHeroSlider();
    loadFeaturedProducts();
}

function initializeHeroSlider() {
    const images = document.querySelectorAll('.car-slider img');
    let currentIndex = 0;

    function showNextImage() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }

    // Change image every 5 seconds
    setInterval(showNextImage, 5000);
}

function loadFeaturedProducts() {
    const productsGrid = document.querySelector('.featured-products .products-grid');
    if (!productsGrid) return;

    const featuredProducts = products.slice(0, 4);
    productsGrid.innerHTML = featuredProducts.map(product => `
        <div class="product-card fade-in" onclick="openProductModal(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">AED ${product.price}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Shop Page
function initializeShopPage() {
    loadAllProducts();
    initializeFilters();
    initializeProductModal();
}

function loadAllProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card fade-in" onclick="openProductModal(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">AED ${product.price}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

function initializeFilters() {
    const filterCheckboxes = document.querySelectorAll('input[name="car-type"]');
    const priceSlider = document.querySelector('.price-slider');
    const sortSelect = document.getElementById('sort-select');
    const filterReset = document.querySelector('.filter-reset');

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    if (priceSlider) {
        priceSlider.addEventListener('input', filterProducts);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }

    if (filterReset) {
        filterReset.addEventListener('click', resetFilters);
    }
}

function filterProducts() {
    const selectedTypes = Array.from(document.querySelectorAll('input[name="car-type"]:checked'))
        .map(cb => cb.value);
    
    const maxPrice = document.querySelector('.price-slider')?.value || 499;
    const sortBy = document.getElementById('sort-select')?.value || 'featured';

    let filteredProducts = products.filter(product => {
        const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(product.category);
        const priceMatch = product.price <= maxPrice;
        return typeMatch && priceMatch;
    });

    // Sort products
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Featured order (original order)
            filteredProducts.sort((a, b) => a.id - b.id);
    }

    renderFilteredProducts(filteredProducts);
}

function renderFilteredProducts(filteredProducts) {
    const productsGrid = document.getElementById('products-grid');
    const productsCount = document.getElementById('products-count');

    if (productsGrid) {
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card fade-in" onclick="openProductModal(${product.id})">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">AED ${product.price}</div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (productsCount) {
        productsCount.textContent = filteredProducts.length;
    }
}

function resetFilters() {
    document.querySelectorAll('input[name="car-type"]').forEach(cb => cb.checked = true);
    document.querySelector('.price-slider').value = 499;
    document.getElementById('sort-select').value = 'featured';
    filterProducts();
}

// Product Modal
function initializeProductModal() {
    const modal = document.querySelector('.product-modal');
    const closeBtn = document.querySelector('.modal-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeProductModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProductModal();
            }
        });
    }
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.querySelector('.product-modal');
    const modalBody = document.querySelector('.modal-body');

    modalBody.innerHTML = `
        <div class="modal-product">
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="modal-product-details">
                <h2>${product.name}</h2>
                <div class="modal-product-price">AED ${product.price}</div>
                <p class="modal-product-description">${product.description}</p>
                
                <div class="customization-options">
                    <div class="option-group">
                        <label>Size:</label>
                        <div class="option-buttons">
                            ${product.customization.sizes.map(size => `
                                <button class="option-btn" data-option="size" data-value="${size}">${size}</button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <label>Frame Color:</label>
                        <div class="option-buttons">
                            ${product.customization.colors.map(color => `
                                <button class="option-btn" data-option="color" data-value="${color}">${color}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-primary btn-add-to-cart" 
                            onclick="addCustomizedToCart(${productId})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;

    // Initialize option buttons
    initializeOptionButtons();

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.querySelector('.product-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function initializeOptionButtons() {
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const option = this.dataset.option;
            const value = this.dataset.value;
            
            // Remove active class from siblings
            const siblings = this.parentElement.querySelectorAll('.option-btn');
            siblings.forEach(sib => sib.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
}

function addCustomizedToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const sizeBtn = document.querySelector('.option-btn[data-option="size"].active');
    const colorBtn = document.querySelector('.option-btn[data-option="color"].active');

    const customization = {
        size: sizeBtn ? sizeBtn.dataset.value : product.customization.sizes[0],
        color: colorBtn ? colorBtn.dataset.value : product.customization.colors[0]
    };

    addToCart(product, customization);
    closeProductModal();
}

// About Page
function initializeAboutPage() {
    initializeFAQ();
    initializeContactForm();
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

function initializeContactForm() {
    const form = document.getElementById('custom-order-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show success message
            alert('Thank you for your inquiry! We will get back to you within 4 hours.');
            form.reset();
        });
    }
}

// Utility Functions
function formatPrice(price) {
    return `AED ${price.toFixed(2)}`;
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.addCustomizedToCart = addCustomizedToCart;
window.toggleCart = toggleCart;