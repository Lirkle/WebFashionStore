// Global Variables
let products = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 8;
let cart = [];
let favorites = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let exchangeRates = JSON.parse(localStorage.getItem('exchangeRates')) || null;
let userLocation = JSON.parse(localStorage.getItem('userLocation')) || null;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const cartCount = document.getElementById('cartCount');
const favoritesCount = document.getElementById('favoritesCount');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProductsData();
    setupEventListeners();
    setupAuthEventListeners();
    updateCartCount();
    updateFavoritesCount();
    updateAuthUI();
    initializeAPIs();
});

// Load products data from JSON
async function loadProductsData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        products = data.products;
        filteredProducts = [...products];
        loadProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to default products if JSON fails to load
        initializeApp();
        loadProducts();
    }
}

// Initialize application with fallback data
function initializeApp() {
    // Fallback products data
    products = [
        {
            id: 1,
            name: "Tabi Boots",
            category: "shoes",
            price: 1200000,
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center",
            description: "Signature tabi boots with split toe design",
            sizes: ["36", "37", "38", "39", "40", "41", "42"],
            materials: "Leather, Rubber sole",
            inStock: true
        },
        {
            id: 2,
            name: "Oversized Blazer",
            category: "clothing",
            price: 850000,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=center",
            description: "Deconstructed blazer with oversized fit",
            sizes: ["XS", "S", "M", "L", "XL"],
            materials: "Wool blend",
            inStock: true
        },
        {
            id: 3,
            name: "GAT Sneakers",
            category: "shoes",
            price: 650000,
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center",
            description: "German Army Trainers in white leather",
            sizes: ["36", "37", "38", "39", "40", "41", "42"],
            materials: "Leather, Rubber sole",
            inStock: true
        },
        {
            id: 4,
            name: "Deconstructed Trench",
            category: "clothing",
            price: 950000,
            image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop&crop=center",
            description: "Asymmetric trench coat with raw edges",
            sizes: ["XS", "S", "M", "L", "XL"],
            materials: "Cotton blend",
            inStock: true
        },
        {
            id: 5,
            name: "5AC Bag",
            category: "bags",
            price: 450000,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&crop=center",
            description: "Minimalist crossbody bag",
            sizes: ["One Size"],
            materials: "Leather",
            inStock: true
        },
        {
            id: 6,
            name: "Replica Sneakers",
            category: "shoes",
            price: 550000,
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center",
            description: "Vintage-inspired sneakers with aged effect",
            sizes: ["36", "37", "38", "39", "40", "41", "42"],
            materials: "Leather, Rubber sole",
            inStock: true
        },
        {
            id: 7,
            name: "Oversized Shirt",
            category: "clothing",
            price: 350000,
            image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
            description: "Deconstructed shirt with raw seams",
            sizes: ["XS", "S", "M", "L", "XL"],
            materials: "Cotton",
            inStock: true
        },
        {
            id: 8,
            name: "Memory Card Holder",
            category: "accessories",
            price: 150000,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&crop=center",
            description: "Minimalist card holder in leather",
            sizes: ["One Size"],
            materials: "Leather",
            inStock: true
        },
        {
            id: 9,
            name: "Paint Splatter Sneakers",
            category: "shoes",
            price: 750000,
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center",
            description: "Artistic sneakers with paint splatter effect",
            sizes: ["36", "37", "38", "39", "40", "41", "42"],
            materials: "Leather, Canvas",
            inStock: true
        },
        {
            id: 10,
            name: "Deconstructed Jeans",
            category: "clothing",
            price: 450000,
            image: "https://images.unsplash.com/photo-1594938298605-c04c0c5b0b00?w=400&h=500&fit=crop&crop=center",
            description: "Raw edge jeans with exposed seams",
            sizes: ["XS", "S", "M", "L", "XL"],
            materials: "Denim",
            inStock: true
        },
        {
            id: 11,
            name: "Memory Card Wallet",
            category: "accessories",
            price: 250000,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&crop=center",
            description: "Sleek wallet with card slots",
            sizes: ["One Size"],
            materials: "Leather",
            inStock: true
        },
        {
            id: 12,
            name: "Oversized Sweater",
            category: "clothing",
            price: 550000,
            image: "https://images.unsplash.com/photo-1594938298605-c04c0c5b0b00?w=400&h=500&fit=crop&crop=center",
            description: "Deconstructed knit with raw edges",
            sizes: ["XS", "S", "M", "L", "XL"],
            materials: "Wool blend",
            inStock: true
        }
    ];
    
    filteredProducts = [...products];
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    setupNavigation();
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    // Sort select
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProducts);
    }
    
    // Search
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Tabs
    setupTabs();
    
    // FAQ accordion
    setupFAQ();
    
    // Forms
    setupForms();
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });
    
    // Close modal on outside click
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // Size guide tabs
    setupSizeGuideTabs();
}

// Navigation functions
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Filter functions
function handleFilter(e) {
    const filter = e.target.dataset.filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Filter products
    if (filter === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.category === filter);
    }
    
    // Reset pagination
    currentPage = 1;
    
    // Render products
    renderProducts();
}

// Sort functions
function handleSort(e) {
    const sortBy = e.target.value;
    
    switch(sortBy) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
    }
    
    currentPage = 1;
    renderProducts();
}

// Search functions
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    
    if (query === '') {
        filteredProducts = [...products];
        if (searchResults) {
            searchResults.innerHTML = '';
        }
    } else {
        const results = products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        
        if (searchResults) {
            if (results.length === 0) {
                searchResults.innerHTML = '<p>Товары не найдены</p>';
            } else {
                searchResults.innerHTML = results.map(product => `
                    <div class="search-result-item" onclick="openProductModal(${product.id}); closeModal();">
                        <img src="${product.image}" alt="${product.name}" class="search-result-image">
                        <div class="search-result-info">
                            <h4>${product.name}</h4>
                            <p>${formatPrice(product.price)}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    }
    
    currentPage = 1;
    renderProducts();
}

// Product rendering
function loadProducts() {
    renderProducts();
}

function renderProducts() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(0, endIndex);
    
    if (productsGrid) {
        productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
    }
    
    // Show/hide load more button
    if (loadMoreBtn) {
        loadMoreBtn.style.display = endIndex >= filteredProducts.length ? 'none' : 'block';
    }
}

function createProductCard(product) {
    const isFavorited = favorites.includes(product.id);
    
    return `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image" onclick="openProductModal(${product.id})">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price" data-original-price="${product.price}">${formatPrice(product.price)}</p>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-bag"></i> В корзину
                    </button>
                    <button class="add-to-favorites ${isFavorited ? 'favorited' : ''}" onclick="toggleFavorite(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function loadMoreProducts() {
    currentPage++;
    renderProducts();
}

// Product modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const productDetails = document.getElementById('productDetails');
    
    if (productDetails) {
        productDetails.innerHTML = `
            <div class="product-gallery">
                <img src="${product.image}" alt="${product.name}" class="main-image">
                <div class="thumbnails">
                    <img src="${product.image}" alt="${product.name}" class="thumbnail active">
                </div>
            </div>
            <div class="product-info-modal">
                <h2 class="product-title">${product.name}</h2>
                <p class="product-price-modal">${formatPrice(product.price)}</p>
                <p class="product-description">${product.description}</p>
                
                <div class="size-selector">
                    <h4>Размер</h4>
                    <div class="size-options">
                        ${product.sizes.map(size => `
                            <button class="size-option" data-size="${size}">${size}</button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="quantity-selector">
                    <h4>Количество</h4>
                    <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="10">
                    <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                </div>
                
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCartFromModal(${product.id})">
                        <i class="fas fa-shopping-bag"></i> Добавить в корзину
                    </button>
                    <button class="add-to-favorites ${favorites.includes(product.id) ? 'favorited' : ''}" onclick="toggleFavorite(${product.id})">
                        <i class="fas fa-heart"></i> ${favorites.includes(product.id) ? 'В избранном' : 'В избранное'}
                    </button>
                </div>
            </div>
        `;
    }
    
    openModal('productModal');
}

// Cart functions
function addToCart(productId, quantity = 1) {
    if (!currentUser) {
        showNotification('Войдите в аккаунт для добавления товаров в корзину', 'error');
        openModal('loginModal');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Товар добавлен в корзину');
}

function addToCartFromModal(productId) {
    const quantityInput = document.querySelector('.quantity-input');
    const selectedSize = document.querySelector('.size-option.selected');
    
    if (!selectedSize) {
        showNotification('Выберите размер', 'error');
        return;
    }
    
    const quantity = parseInt(quantityInput.value) || 1;
    addToCart(productId, quantity);
    closeModal();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartModal();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartCount();
            updateCartModal();
        }
    }
}

function saveCart() {
    if (currentUser) {
        localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart));
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Корзина пуста</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">${formatPrice(item.price)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = formatPrice(total);
    }
}

function checkout() {
    if (!currentUser) {
        showNotification('Войдите в аккаунт для оформления заказа', 'error');
        openModal('loginModal');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderData = {
        items: [...cart],
        total: total,
        user: currentUser,
        orderDate: new Date().toISOString()
    };
    
    // Send email confirmation
    sendOrderConfirmation(orderData);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    updateCartModal();
    closeModal();
    
    showNotification('Заказ оформлен! Проверьте email для подтверждения.');
}

// Favorites functions
function toggleFavorite(productId) {
    if (!currentUser) {
        showNotification('Войдите в аккаунт для добавления товаров в избранное', 'error');
        openModal('loginModal');
        return;
    }
    
    const index = favorites.indexOf(productId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(productId);
    }
    
    saveFavorites();
    updateFavoritesCount();
    updateFavoritesModal();
    renderProducts(); // Re-render to update favorite buttons
}

function saveFavorites() {
    if (currentUser) {
        localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(favorites));
    }
}

function updateFavoritesCount() {
    if (favoritesCount) {
        favoritesCount.textContent = favorites.length;
    }
}

function updateFavoritesModal() {
    const favoritesList = document.getElementById('favoritesList');
    
    if (favoritesList) {
        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p>Список избранного пуст</p>';
        } else {
            const favoriteProducts = products.filter(product => favorites.includes(product.id));
            favoritesList.innerHTML = favoriteProducts.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">${formatPrice(product.price)}</p>
                        <div class="product-actions">
                            <button class="add-to-cart" onclick="addToCart(${product.id})">
                                <i class="fas fa-shopping-bag"></i> В корзину
                            </button>
                            <button class="add-to-favorites favorited" onclick="toggleFavorite(${product.id})">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Update modal content based on type
        if (modalId === 'cartModal') {
            updateCartModal();
        } else if (modalId === 'favoritesModal') {
            updateFavoritesModal();
        }
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Tabs functionality
function setupTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Remove active class from all buttons and panels
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const panel = document.getElementById(tabId);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });
}

// Size guide tabs
function setupSizeGuideTabs() {
    document.querySelectorAll('.size-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const sizeType = tab.dataset.size;
            
            // Remove active class from all tabs and tables
            document.querySelectorAll('.size-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.size-table').forEach(table => table.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding table
            tab.classList.add('active');
            const table = document.getElementById(`${sizeType}-sizes`);
            if (table) {
                table.classList.add('active');
            }
        });
    });
}

// FAQ accordion
function setupFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Forms
function setupForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Clear previous errors
    clearFormErrors();
    
    let isValid = true;
    
    // Validate name
    if (!name.trim()) {
        showFieldError('nameError', 'Имя обязательно для заполнения');
        isValid = false;
    }
    
    // Validate email
    if (!email.trim()) {
        showFieldError('emailError', 'Email обязателен для заполнения');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('emailError', 'Введите корректный email');
        isValid = false;
    }
    
    // Validate message
    if (!message.trim()) {
        showFieldError('messageError', 'Сообщение обязательно для заполнения');
        isValid = false;
    }
    
    if (isValid) {
        showNotification('Сообщение отправлено успешно!');
        e.target.reset();
    }
}

function handleNewsletterForm(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (isValidEmail(email)) {
        showNotification('Вы успешно подписались на рассылку!');
        e.target.reset();
    } else {
        showNotification('Введите корректный email', 'error');
    }
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('kk-KZ', {
        style: 'currency',
        currency: 'KZT',
        minimumFractionDigits: 0
    }).format(price);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 4px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function changeQuantity(delta) {
    const quantityInput = document.querySelector('.quantity-input');
    const currentValue = parseInt(quantityInput.value) || 1;
    const newValue = Math.max(1, Math.min(10, currentValue + delta));
    quantityInput.value = newValue;
}

// Size selection in product modal
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('size-option')) {
        // Remove selected class from all size options
        document.querySelectorAll('.size-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selected class to clicked option
        e.target.classList.add('selected');
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Authentication Functions
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = currentUser.name;
        loadUserData();
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        cart = [];
        favorites = [];
        updateCartCount();
        updateFavoritesCount();
    }
}

function loadUserData() {
    if (currentUser) {
        cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];
        favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.id}`)) || [];
        updateCartCount();
        updateFavoritesCount();
    }
}

function registerUser(userData) {
    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
        showNotification('Пользователь с таким email уже существует', 'error');
        return false;
    }
    
    // Validate password confirmation
    if (userData.password !== userData.confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return false;
    }
    
    // Validate password length
    if (userData.password.length < 6) {
        showNotification('Пароль должен содержать минимум 6 символов', 'error');
        return false;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // В реальном приложении пароль должен быть зашифрован
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    updateAuthUI();
    closeModal();
    showNotification('Регистрация успешна! Добро пожаловать!');
    return true;
}

function loginUser(email, password) {
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        closeModal();
        showNotification('Добро пожаловать!');
        return true;
    } else {
        showNotification('Неверный email или пароль', 'error');
        return false;
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showNotification('Вы вышли из аккаунта');
}

function switchToRegister() {
    closeModal();
    setTimeout(() => openModal('registerModal'), 300);
}

function switchToLogin() {
    closeModal();
    setTimeout(() => openModal('loginModal'), 300);
}

// Form handlers
function handleLoginForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Clear previous errors
    clearAuthErrors();
    
    let isValid = true;
    
    if (!email.trim()) {
        showFieldError('loginEmailError', 'Email обязателен');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('loginEmailError', 'Введите корректный email');
        isValid = false;
    }
    
    if (!password.trim()) {
        showFieldError('loginPasswordError', 'Пароль обязателен');
        isValid = false;
    }
    
    if (isValid) {
        loginUser(email, password);
    }
}

function handleRegisterForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    };
    
    // Clear previous errors
    clearAuthErrors();
    
    let isValid = true;
    
    if (!userData.name.trim()) {
        showFieldError('registerNameError', 'Имя обязательно');
        isValid = false;
    }
    
    if (!userData.email.trim()) {
        showFieldError('registerEmailError', 'Email обязателен');
        isValid = false;
    } else if (!isValidEmail(userData.email)) {
        showFieldError('registerEmailError', 'Введите корректный email');
        isValid = false;
    }
    
    if (!userData.password.trim()) {
        showFieldError('registerPasswordError', 'Пароль обязателен');
        isValid = false;
    } else if (userData.password.length < 6) {
        showFieldError('registerPasswordError', 'Пароль должен содержать минимум 6 символов');
        isValid = false;
    }
    
    if (!userData.confirmPassword.trim()) {
        showFieldError('confirmPasswordError', 'Подтвердите пароль');
        isValid = false;
    } else if (userData.password !== userData.confirmPassword) {
        showFieldError('confirmPasswordError', 'Пароли не совпадают');
        isValid = false;
    }
    
    if (isValid) {
        registerUser(userData);
    }
}

function clearAuthErrors() {
    document.querySelectorAll('#loginForm .error-message, #registerForm .error-message').forEach(error => {
        error.textContent = '';
    });
}

// Setup auth event listeners
function setupAuthEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginForm);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterForm);
    }
}

// API Functions
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/KZT');
        const data = await response.json();
        exchangeRates = data.rates;
        localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
        console.log('Exchange rates updated:', exchangeRates);
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
}

async function fetchUserLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        userLocation = {
            city: data.city,
            country: data.country_name,
            latitude: data.latitude,
            longitude: data.longitude
        };
        localStorage.setItem('userLocation', JSON.stringify(userLocation));
        console.log('User location detected:', userLocation);
        updateLocationUI();
    } catch (error) {
        console.error('Error fetching user location:', error);
    }
}

async function fetchWeatherData() {
    if (!userLocation) return null;
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=demo&units=metric`);
        const data = await response.json();
        return {
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function convertPrice(price, fromCurrency = 'KZT', toCurrency = 'USD') {
    if (!exchangeRates) return price;
    
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    
    return Math.round((price / fromRate) * toRate);
}

function formatPriceWithCurrency(price, currency = 'KZT') {
    if (currency === 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    } else if (currency === 'EUR') {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(price);
    } else {
        return formatPrice(price);
    }
}

function updateLocationUI() {
    if (userLocation) {
        const locationElement = document.getElementById('userLocation');
        if (locationElement) {
            locationElement.textContent = `${userLocation.city}, ${userLocation.country}`;
        }
    }
}

async function sendEmailNotification(to, subject, message) {
    // Используем EmailJS для отправки email
    try {
        const templateParams = {
            to_email: to,
            subject: subject,
            message: message
        };
        
        // В реальном приложении здесь будет вызов EmailJS API
        console.log('Email notification would be sent:', templateParams);
        showNotification('Уведомление отправлено на email!');
    } catch (error) {
        console.error('Error sending email notification:', error);
        showNotification('Ошибка отправки email', 'error');
    }
}

function shareToSocialMedia(platform, product) {
    const url = window.location.href;
    const text = `Посмотрите на этот товар: ${product.name} - ${formatPrice(product.price)}`;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Initialize API data
async function initializeAPIs() {
    // Загружаем курсы валют
    await fetchExchangeRates();
    
    // Определяем местоположение пользователя
    await fetchUserLocation();
    
    // Загружаем погоду
    const weather = await fetchWeatherData();
    if (weather) {
        updateWeatherUI(weather);
    }
}

function updateWeatherUI(weather) {
    const weatherElement = document.getElementById('weatherInfo');
    if (weatherElement) {
        weatherElement.innerHTML = `
            <div class="weather-widget">
                <i class="fas fa-thermometer-half"></i>
                <span>${Math.round(weather.temperature)}°C</span>
                <span>${weather.description}</span>
            </div>
        `;
    }
}

// Currency conversion functions
function updateCurrency() {
    const currencySelect = document.getElementById('currencySelect');
    const selectedCurrency = currencySelect.value;
    
    // Update all product prices
    document.querySelectorAll('.product-price').forEach(priceElement => {
        const originalPrice = parseInt(priceElement.dataset.originalPrice) || 0;
        if (originalPrice > 0) {
            const convertedPrice = convertPrice(originalPrice, 'KZT', selectedCurrency);
            priceElement.textContent = formatPriceWithCurrency(convertedPrice, selectedCurrency);
        }
    });
    
    // Update cart total
    updateCartModal();
}

// Enhanced product modal with social sharing
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const productDetails = document.getElementById('productDetails');
    
    if (productDetails) {
        productDetails.innerHTML = `
            <div class="product-gallery">
                <img src="${product.image}" alt="${product.name}" class="main-image">
                <div class="thumbnails">
                    <img src="${product.image}" alt="${product.name}" class="thumbnail active">
                </div>
            </div>
            <div class="product-info-modal">
                <h2 class="product-title">${product.name}</h2>
                <p class="product-price-modal" data-original-price="${product.price}">${formatPrice(product.price)}</p>
                <p class="product-description">${product.description}</p>
                
                <div class="size-selector">
                    <h4>Размер</h4>
                    <div class="size-options">
                        ${product.sizes.map(size => `
                            <button class="size-option" data-size="${size}">${size}</button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="quantity-selector">
                    <h4>Количество</h4>
                    <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="10">
                    <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                </div>
                
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCartFromModal(${product.id})">
                        <i class="fas fa-shopping-bag"></i> Добавить в корзину
                    </button>
                    <button class="add-to-favorites ${favorites.includes(product.id) ? 'favorited' : ''}" onclick="toggleFavorite(${product.id})">
                        <i class="fas fa-heart"></i> ${favorites.includes(product.id) ? 'В избранном' : 'В избранное'}
                    </button>
                </div>
                
                <div class="social-share">
                    <h4>Поделиться</h4>
                    <div class="share-buttons">
                        <button class="share-btn facebook" onclick="shareToSocialMedia('facebook', ${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            <i class="fab fa-facebook-f"></i>
                        </button>
                        <button class="share-btn twitter" onclick="shareToSocialMedia('twitter', ${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            <i class="fab fa-twitter"></i>
                        </button>
                        <button class="share-btn telegram" onclick="shareToSocialMedia('telegram', ${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            <i class="fab fa-telegram-plane"></i>
                        </button>
                        <button class="share-btn whatsapp" onclick="shareToSocialMedia('whatsapp', ${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    openModal('productModal');
}

// Email notification for order confirmation
function sendOrderConfirmation(orderData) {
    if (currentUser) {
        const subject = `Подтверждение заказа #${Date.now()}`;
        const message = `
            Спасибо за ваш заказ!
            
            Детали заказа:
            ${orderData.items.map(item => `- ${item.name} x${item.quantity}`).join('\n')}
            
            Общая сумма: ${formatPrice(orderData.total)}
            
            Мы свяжемся с вами для подтверждения доставки.
        `;
        
        sendEmailNotification(currentUser.email, subject, message);
    }
}
