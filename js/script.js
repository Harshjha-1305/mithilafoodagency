// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMobileMenu();
    loadPage('home');
    initAnimations();
});

// Load page content
function loadPage(pageName) {
    const pageContent = document.getElementById('pageContent');
    
    fetch(`pages/${pageName}.html`)
        .then(response => response.text())
        .then(data => {
            pageContent.innerHTML = data;
            initPageSpecificScripts(pageName);
            initAnimations();
        })
        .catch(error => {
            console.error('Error loading page:', error);
        });
}

// Initialize animations
function initAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            
            // Update active link
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Load page
            loadPage(targetPage);
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Close mobile menu if open
            document.getElementById('navMenu').classList.remove('active');
            document.getElementById('mobileMenuBtn').innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Initialize mobile menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
}

// Initialize page-specific scripts
function initPageSpecificScripts(pageName) {
    if (pageName === 'order') {
        initOrderForm();
    } else if (pageName === 'contact') {
        initContactForm();
    }
}

// Initialize order form
function initOrderForm() {
    const orderForm = document.getElementById('orderForm');
    const checkboxes = document.querySelectorAll('.product-checkbox');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitOrderForm();
        });
    }
    
    // Update total when checkboxes change
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateOrderTotal);
    });
    
    // Initial total update
    updateOrderTotal();
}

// Initialize contact form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitContactForm();
        });
    }
}

// Change quantity for product cards
function changeQuantity(button, delta) {
    const quantityDisplay = button.parentElement.querySelector('.quantity-display');
    let quantity = parseInt(quantityDisplay.textContent);
    quantity = Math.max(1, quantity + delta);
    quantityDisplay.textContent = quantity;
}

// Change quantity for order form
function changeOrderQuantity(button, delta) {
    const quantityDisplay = button.parentElement.querySelector('.quantity-display');
    let quantity = parseInt(quantityDisplay.textContent);
    quantity = Math.max(1, quantity + delta);
    quantityDisplay.textContent = quantity;
    updateOrderTotal();
}

// Update order total
function updateOrderTotal() {
    let total = 0;
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    
    checkboxes.forEach(checkbox => {
        const quantity = parseInt(checkbox.closest('.product-item').querySelector('.quantity-display').textContent);
        const price = parseInt(checkbox.getAttribute('data-price'));
        total += quantity * price;
    });
    
    const orderTotalElement = document.getElementById('orderTotal');
    if (orderTotalElement) {
        orderTotalElement.textContent = total;
    }
}

// Submit order form
function submitOrderForm() {
    const form = document.getElementById('orderForm');
    const formData = new FormData(form);
    const products = [];
    
    document.querySelectorAll('.product-checkbox:checked').forEach(checkbox => {
        const quantity = parseInt(checkbox.closest('.product-item').querySelector('.quantity-display').textContent);
        products.push({
            name: checkbox.value,
            quantity: quantity,
            price: parseInt(checkbox.getAttribute('data-price'))
        });
    });

    if (products.length === 0) {
        alert('Please select at least one product to order.');
        return;
    }
    
    // Show success message
    document.getElementById('successMessage').classList.add('show');
    
    // Create WhatsApp message
    let message = "Hello! I would like to place an order:%0A%0A";
    message += "*Name:* " + formData.get('name') + "%0A";
    message += "*Phone:* " + formData.get('phone') + "%0A";
    message += "*Address:* " + formData.get('address') + "%0A";
    message += "*City:* " + formData.get('city') + "%0A";
    message += "*Pincode:* " + formData.get('pincode') + "%0A%0A";
    
    message += "*Order Details:*%0A";
    products.forEach(product => {
        message += "• " + product.name + " (Qty: " + product.quantity + ") - ₹" + (product.quantity * product.price) + "%0A";
    });
    
    message += "%0A*Total: ₹" + document.getElementById('orderTotal').textContent + "*%0A%0A";
    
    if (formData.get('message')) {
        message += "*Special Instructions:* " + formData.get('message') + "%0A%0A";
    }
    
    message += "Please confirm my order. Thank you!";
    
    // Open WhatsApp after a delay
    setTimeout(() => {
        window.open('https://wa.me/919798661589?text=' + message, '_blank');
    }, 2000);
    
    // Reset form
    setTimeout(() => {
        form.reset();
        updateOrderTotal();
        document.getElementById('successMessage').classList.remove('show');
    }, 5000);
}

// Submit contact form
function submitContactForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    // Show success message
    document.getElementById('contactSuccessMessage').classList.add('show');
    
    // Create WhatsApp message
    let message = "Hello! I have a query:%0A%0A";
    message += "*Name:* " + formData.get('name') + "%0A";
    message += "*Phone:* " + formData.get('phone') + "%0A";
    message += "*Email:* " + (formData.get('email') || 'Not provided') + "%0A";
    message += "*Subject:* " + formData.get('subject') + "%0A%0A";
    message += "*Message:* " + formData.get('message') + "%0A%0A";
    message += "Please get back to me. Thank you!";
    
    // Open WhatsApp after a delay
    setTimeout(() => {
        window.open('https://wa.me/919798661589?text=' + message, '_blank');
    }, 2000);
    
    // Reset form
    setTimeout(() => {
        form.reset();
        document.getElementById('contactSuccessMessage').classList.remove('show');
    }, 5000);
}

// Order via WhatsApp from product cards
function orderViaWhatsApp(button) {
    const card = button.closest('.product-card');
    const product = card.getAttribute('data-product');
    const price = card.getAttribute('data-price');
    const weight = card.getAttribute('data-weight');
    const quantity = parseInt(card.querySelector('.quantity-display').textContent);
    
    const message = "Hello! I would like to order:%0A%0A" +
                   "*Product:* " + product + "%0A" +
                   "*Weight:* " + weight + "g%0A" +
                   "*Quantity:* " + quantity + "%0A" +
                   "*Total: ₹" + (quantity * price) + "*%0A%0A" +
                   "Please contact me to complete the order. Thank you!";
    
    window.open('https://wa.me/919798661589?text=' + message, '_blank');
}

// Scroll to products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Scroll to info
function scrollToInfo() {
    document.getElementById('makhana-info').scrollIntoView({ behavior: 'smooth' });
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}