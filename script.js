// ================================================
// GRIYA SATYA - Enhanced JavaScript
// Modern interactions for a premium experience
// ================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing...');

    // Initialize all components
    initImageCarousels();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initImageLoading();
    initModal();
});

// ================================================
// IMAGE CAROUSELS
// ================================================
function initImageCarousels() {
    const cards = document.querySelectorAll('.card');
    console.log('Found cards:', cards.length);

    cards.forEach((card, cardIndex) => {
        const imageWrapper = card.querySelector('.image-wrapper');
        const images = imageWrapper ? imageWrapper.querySelectorAll('.guesthouse-img') : [];
        const prevBtn = card.querySelector('.prev-btn');
        const nextBtn = card.querySelector('.next-btn');
        const dotsContainer = card.querySelector('.image-dots');

        console.log(`Card ${cardIndex}: Found ${images.length} images, prevBtn: ${!!prevBtn}, nextBtn: ${!!nextBtn}`);

        if (images.length === 0) return;

        let currentIndex = 0;

        // Create dots
        if (dotsContainer) {
            images.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    goToSlide(index);
                });
                dotsContainer.appendChild(dot);
            });
        }

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

        function updateSlide() {
            console.log(`Updating slide to index: ${currentIndex}`);
            images.forEach((img, index) => {
                if (index === currentIndex) {
                    img.classList.add('active');
                    img.style.opacity = '1';
                } else {
                    img.classList.remove('active');
                    img.style.opacity = '0';
                }
            });
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateSlide();
        }

        function nextSlide() {
            console.log('Next slide clicked');
            currentIndex = (currentIndex + 1) % images.length;
            updateSlide();
        }

        function prevSlide() {
            console.log('Prev slide clicked');
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateSlide();
        }

        // Event listeners for buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Prev button clicked!');
                prevSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button clicked!');
                nextSlide();
            });
        }

        // Auto-advance slides every 5 seconds
        let autoSlide = setInterval(nextSlide, 5000);

        // Pause auto-slide on hover
        card.addEventListener('mouseenter', () => clearInterval(autoSlide));
        card.addEventListener('mouseleave', () => {
            autoSlide = setInterval(nextSlide, 5000);
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        const imageContainer = card.querySelector('.image-container');

        if (imageContainer) {
            imageContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            imageContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (diff > swipeThreshold) {
                nextSlide();
            } else if (diff < -swipeThreshold) {
                prevSlide();
            }
        }

        // Initial update
        updateSlide();
    });
}

// ================================================
// MODAL FUNCTIONALITY
// ================================================
function initModal() {
    const modal = document.getElementById('detailModal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const modalMainImage = document.getElementById('modalMainImage');
    const modalThumbnails = document.getElementById('modalThumbnails');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalRooms = document.getElementById('modalRooms');
    const modalGuests = document.getElementById('modalGuests');
    const modalAirbnbLink = document.getElementById('modalAirbnbLink');
    const modalPrevBtn = modal.querySelector('.modal-nav.prev');
    const modalNextBtn = modal.querySelector('.modal-nav.next');

    let currentImages = [];
    let currentImageIndex = 0;

    // Get all "View Details" buttons
    const detailButtons = document.querySelectorAll('.btn-details');

    detailButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const card = this.closest('.card');
            openModal(card);
        });
    });

    function openModal(card) {
        // Get data from card
        const title = card.dataset.title;
        const description = card.dataset.description;
        const rooms = card.dataset.rooms;
        const guests = card.dataset.guests;
        const images = card.dataset.images.split(',');
        const airbnbLink = card.dataset.airbnb;

        // Set modal content
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalRooms.textContent = `${rooms} Bedrooms`;
        modalGuests.textContent = `${guests} Guests`;
        modalAirbnbLink.href = airbnbLink;

        // Set images
        currentImages = images;
        currentImageIndex = 0;

        // Clear and create thumbnails
        modalThumbnails.innerHTML = '';
        images.forEach((imgSrc, index) => {
            const thumb = document.createElement('div');
            thumb.classList.add('modal-thumbnail');
            if (index === 0) thumb.classList.add('active');
            thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${index + 1}">`;
            thumb.addEventListener('click', () => goToModalImage(index));
            modalThumbnails.appendChild(thumb);
        });

        // Set main image
        updateModalImage();

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateModalImage() {
        modalMainImage.src = currentImages[currentImageIndex];
        modalMainImage.alt = `Image ${currentImageIndex + 1}`;

        // Update thumbnails
        const thumbnails = modalThumbnails.querySelectorAll('.modal-thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentImageIndex);
        });
    }

    function goToModalImage(index) {
        currentImageIndex = index;
        updateModalImage();
    }

    function nextModalImage() {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateModalImage();
    }

    function prevModalImage() {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateModalImage();
    }

    // Event listeners
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    modalPrevBtn.addEventListener('click', prevModalImage);
    modalNextBtn.addEventListener('click', nextModalImage);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
        if (e.key === 'ArrowLeft' && modal.classList.contains('active')) {
            prevModalImage();
        }
        if (e.key === 'ArrowRight' && modal.classList.contains('active')) {
            nextModalImage();
        }
    });
}

// ================================================
// MOBILE MENU
// ================================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    if (!menuBtn || !navList) return;

    menuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu when clicking a link
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !navList.contains(e.target)) {
            navList.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
}

// ================================================
// SMOOTH SCROLL
// ================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ================================================
// SCROLL ANIMATIONS
// ================================================
function initScrollAnimations() {
    // Add fade-in class to elements
    const animateElements = document.querySelectorAll(
        '.section-header, .card, .feature-card, .about-content, .experience-badge'
    );

    animateElements.forEach(el => el.classList.add('fade-in'));

    // Intersection Observer for revealing elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));

    // Header background change on scroll
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

// ================================================
// IMAGE LOADING
// ================================================
function initImageLoading() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
}

// ================================================
// UTILITY: Debounce function
// ================================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
