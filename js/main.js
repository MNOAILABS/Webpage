/**
 * Main JavaScript for MNO AI LABS - Cutting Edge Implementation
 * Integrates all components and handles initialization
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Register GSAP plugins if available
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Initialize core site functionality with error handling
    initSiteComponents();
    
    // Setup window-level function for page animations to be called after loading
    window.initPageAnimations = function() {
        // Fix typography animations
        if (window.initModernTypography) {
            try {
                initModernTypography();
            } catch (e) {
                console.warn('Typography animation error:', e);
                // Fallback for text animations
                initDefaultTextAnimations();
            }
        } else {
            // Fallback for text animations if the specialized module isn't loaded
            initDefaultTextAnimations();
        }
        
        // Initialize scroll-based animations
        initScrollAnimations();
        
        // Create scroll progress indicator
        createScrollProgressIndicator();
        
        // Add interaction effects
        addInteractionEffects();

        // Initialize stats counters
        initStatsCounters();

        // Initialize featured carousel
        initFeaturedCarousel();
    };
});

/**
 * Initialize core site components with robust error handling
 */
function initSiteComponents() {
    console.log("Initializing site components...");
    
    // Core UI elements - with error handling for each component
    try {
        if (window.initNavigation) initNavigation();
    } catch (e) {
        console.error("Error initializing navigation:", e);
    }
    
    try {
        if (window.initAchievementsCarousel) initAchievementsCarousel();
    } catch (e) {
        console.error("Error initializing achievements carousel:", e);
    }
    
    try {
        if (window.initFeaturedCarousel) initFeaturedCarousel();
    } catch (e) {
        console.error("Error initializing featured carousel:", e);
    }
    
    try {
        if (window.initTeamCarousel) initTeamCarousel();
    } catch (e) {
        console.error("Error initializing team carousel:", e);
    }
    
    try {
        if (window.initProjectFilters) initProjectFilters();
    } catch (e) {
        console.error("Error initializing project filters:", e);
    }
    
    try {
        if (window.initContactForm) initContactForm();
    } catch (e) {
        console.error("Error initializing contact form:", e);
    }
    
    // Skip 3D visuals initialization - they're causing errors
    // Just set up static replacements instead
    setupStaticHero();
    setupStaticBackground();
}

/**
 * New Stats Counter function to ensure the numbers animate properly
 */
function initStatsCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Configuration for each stat (if you want different end values)
    const statConfig = {
        'stat-projects': { 
            endValue: 6, 
            suffix: '+',
            duration: 500
        },
        'stat-team': { 
            endValue: 8, 
            suffix: '',
            duration: 500
        },
        'stat-satisfaction': { 
            endValue: 95, 
            suffix: '%',
            duration: 500
        },
        'stat-awards': { 
            endValue: 1, 
            suffix: '',
            duration: 500
        }
    };
    
    statNumbers.forEach(stat => {
        // Get the stat ID and configuration
        const statId = stat.id;
        const config = statConfig[statId] || { 
            endValue: parseInt(stat.textContent), 
            suffix: stat.textContent.replace(/[0-9]/g, ''),
            duration: 2000
        };
        
        // Intersection Observer to trigger animation when stat is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate the stat
                    animateStat(stat, config);
                    
                    // Disconnect observer after triggering
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        // Observe the stat element
        observer.observe(stat);
    });
}

/**
 * Animate a single stat number
 * @param {HTMLElement} statElement - The stat number element
 * @param {Object} config - Configuration for the stat
 */
function animateStat(statElement, config) {
    const { endValue, suffix, duration } = config;
    const startValue = 0;
    
    // Create animation
    let currentValue = startValue;
    const increment = endValue / (duration / 16); // 16ms is roughly 60fps
    
    const updateStat = () => {
        currentValue += increment;
        
        // Stop when we reach or exceed the end value
        if (currentValue >= endValue) {
            currentValue = endValue;
            cancelAnimationFrame(animationFrame);
        }
        
        // Update the display
        statElement.textContent = `${Math.round(currentValue)}${suffix}`;
        
        // Continue animation if not complete
        if (currentValue < endValue) {
            animationFrame = requestAnimationFrame(updateStat);
        }
    };
    
    // Start the animation
    let animationFrame = requestAnimationFrame(updateStat);
}

// Initialize stats counters when the page loads
document.addEventListener('DOMContentLoaded', initStatsCounters);

// Also expose the function globally in case it needs to be manually triggered
window.initStatsCounters = initStatsCounters;
/**
 * New Featured Carousel implementation
 */
function initFeaturedCarousel() {
    const track = document.querySelector('.featured-track');
    const items = document.querySelectorAll('.featured-item');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (!track || !items.length) return;
    
    // Current slide index
    let currentIndex = 0;
    let itemsPerView = 1; // Default for mobile
    
    // Set initial track width
    track.style.display = 'flex';
    
    // Determine items per view based on viewport
    function updateItemsPerView() {
        const viewportWidth = window.innerWidth;
        
        if (viewportWidth > 1200) {
            itemsPerView = 3; // Desktop: 3 items per view
        } else if (viewportWidth > 768) {
            itemsPerView = 2; // Tablet: 2 items per view
        } else {
            itemsPerView = 1; // Mobile: 1 item per view
        }
        
        // Update item widths
        const itemWidth = 100 / itemsPerView;
        items.forEach(item => {
            item.style.flexBasis = `${itemWidth}%`;
            item.style.minWidth = `${itemWidth}%`;
        });
        
        // Update track width
        track.style.width = `${items.length * 100 / itemsPerView}%`;
        
        // Check if current index is valid after resize
        if (currentIndex > items.length - itemsPerView) {
            currentIndex = items.length - itemsPerView;
            if (currentIndex < 0) currentIndex = 0;
            updateCarousel(currentIndex);
        }
    }
    
    // Update the carousel position
    function updateCarousel(index) {
        // Keep index in bounds
        const maxIndex = Math.max(0, items.length - itemsPerView);
        currentIndex = Math.min(maxIndex, Math.max(0, index));
        
        // Calculate the percentage to move
        const movePercentage = (currentIndex * 100) / items.length;
        
        // Move the track
        track.style.transform = `translateX(-${movePercentage}%)`;
        
        // Update active states for items
        items.forEach((item, i) => {
            if (i >= currentIndex && i < currentIndex + itemsPerView) {
                item.classList.add('active');
                item.style.opacity = '1';
            } else {
                item.classList.remove('active');
                item.style.opacity = '0.5';
            }
        });
        
        // Update dots
        if (dots.length) {
            const activeDotIndex = Math.floor(currentIndex / itemsPerView);
            dots.forEach((dot, i) => {
                if (i === activeDotIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }
    
    // Initialize carousel
    updateItemsPerView();
    updateCarousel(0);
    
    // Add button event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            updateCarousel(currentIndex - itemsPerView);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            updateCarousel(currentIndex + itemsPerView);
        });
    }
    
    // Add dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index * itemsPerView);
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateItemsPerView();
        updateCarousel(currentIndex);
    });
    
    // Auto-advance carousel with pause on hover
    let autoAdvance = setInterval(() => {
        const nextIndex = currentIndex + itemsPerView;
        if (nextIndex >= items.length) {
            updateCarousel(0);
        } else {
            updateCarousel(nextIndex);
        }
    }, 6000);
    
    // Pause on hover
    const featuredSection = document.querySelector('.featured');
    if (featuredSection) {
        featuredSection.addEventListener('mouseenter', () => {
            clearInterval(autoAdvance);
        });
        
        featuredSection.addEventListener('mouseleave', () => {
            autoAdvance = setInterval(() => {
                const nextIndex = currentIndex + itemsPerView;
                if (nextIndex >= items.length) {
                    updateCarousel(0);
                } else {
                    updateCarousel(nextIndex);
                }
            }, 6000);
        });
    }
}

/**
 * Static hero setup replacement for ThreeJS
 */
function setupStaticHero() {
    const visualContainer = document.querySelector('.hero-visual .visual-container');
    if (!visualContainer) return;
    
    // Create fallback gradient background
    visualContainer.innerHTML = '';
    visualContainer.style.cssText = `
        position: relative;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1));
        border-radius: 16px;
        overflow: hidden;
    `;
    
    // Add decorative elements
    const decorElements = [
        {
            className: 'hero-decor-circle',
            styles: `
                position: absolute;
                width: 200px;
                height: 200px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
                top: 20%;
                left: 20%;
                animation: pulseSlow 8s ease-in-out infinite;
            `
        },
        {
            className: 'hero-decor-circle-2',
            styles: `
                position: absolute;
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
                bottom: 20%;
                right: 20%;
                animation: pulseSlow 8s ease-in-out infinite 1s;
            `
        },
        {
            className: 'hero-decor-line',
            styles: `
                position: absolute;
                width: 100%;
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
                top: 50%;
                animation: rotateSlow 20s linear infinite;
            `
        },
        {
            className: 'hero-decor-grid',
            styles: `
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 30%;
                background-image: linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), 
                                linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
                background-size: 20px 20px;
                transform: perspective(500px) rotateX(60deg);
                transform-origin: bottom;
                opacity: 0.3;
            `
        },
        {
            className: 'hero-brain-network',
            styles: `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80%;
                height: 80%;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><g fill="none" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1"><circle cx="100" cy="100" r="80"/><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="40"/><line x1="20" y1="100" x2="180" y2="100"/><line x1="100" y1="20" x2="100" y2="180"/></g></svg>');
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
                opacity: 0.6;
                animation: rotateSlow 30s linear infinite;
            `
        }
    ];
    
    // Add elements to DOM
    decorElements.forEach(element => {
        const el = document.createElement('div');
        el.className = element.className;
        el.style.cssText = element.styles;
        visualContainer.appendChild(el);
    });
    
    // Add floating nodes for brain network effect
    for (let i = 0; i < 15; i++) {
        const node = document.createElement('div');
        const size = 4 + Math.random() * 8;
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 80; // Distance from center
        
        node.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: rgba(99, 102, 241, 0.6);
            border-radius: 50%;
            top: calc(50% + ${Math.sin(angle) * distance}px);
            left: calc(50% + ${Math.cos(angle) * distance}px);
            box-shadow: 0 0 ${size * 2}px rgba(99, 102, 241, 0.4);
            animation: pulseSlow ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 3}s;
        `;
        
        visualContainer.appendChild(node);
    }
}

/**
 * Setup static background instead of ThreeJS
 */
function setupStaticBackground() {
    const canvas = document.getElementById('three-background');
    if (!canvas) return;
    
    // Replace canvas with static div
    const staticBg = document.createElement('div');
    staticBg.id = 'static-background';
    staticBg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -10;
        opacity: 0.5;
        pointer-events: none;
        background: linear-gradient(135deg, rgba(10, 10, 10, 1), rgba(5, 5, 5, 1));
    `;
    
    // Add grid lines
    const gridLines = document.createElement('div');
    gridLines.style.cssText = `
        position: absolute;
        inset: 0;
        background-image: linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px), 
                          linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
        background-size: 50px 50px;
        opacity: 0.3;
    `;
    staticBg.appendChild(gridLines);
    
    // Add gradient blob
    const gradientBlob = document.createElement('div');
    gradientBlob.style.cssText = `
        position: absolute;
        top: 20%;
        left: 20%;
        width: 60%;
        height: 60%;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
        filter: blur(50px);
        opacity: 0.5;
        animation: backgroundShift 15s ease infinite;
    `;
    staticBg.appendChild(gradientBlob);
    
    // Add second gradient blob
    const gradientBlob2 = document.createElement('div');
    gradientBlob2.style.cssText = `
        position: absolute;
        bottom: 20%;
        right: 20%;
        width: 40%;
        height: 40%;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
        filter: blur(50px);
        opacity: 0.3;
        animation: backgroundShift 20s ease infinite reverse;
    `;
    staticBg.appendChild(gradientBlob2);
    
    // Replace canvas with our static background
    canvas.parentNode.replaceChild(staticBg, canvas);
}

/**
 * Fallback text animation if modern typography module isn't available
 */
function initDefaultTextAnimations() {
    // Get hero elements
    const heroTitle = document.querySelector('.hero .title');
    const heroDescription = document.querySelector('.hero .description');
    const heroButtons = document.querySelectorAll('.hero .btn');
    
    if (!window.gsap) return; // Skip if GSAP is not available
    
    if (heroTitle) {
        // Ensure all spans are visible first - fixes the faded issue
        const titleSpans = heroTitle.querySelectorAll('span');
        titleSpans.forEach(span => {
            gsap.set(span, { opacity: 1, y: 0 });
        });
        
        // Add basic animation
        gsap.from(titleSpans, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)"
        });
    }
    
    if (heroDescription) {
        gsap.set(heroDescription, { opacity: 1, y: 0 }); // Ensure visible first
        gsap.from(heroDescription, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.6,
            ease: "power3.out"
        });
    }
    
    if (heroButtons.length) {
        gsap.set(heroButtons, { opacity: 1, y: 0 }); // Ensure visible first
        gsap.from(heroButtons, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.2,
            delay: 0.8,
            ease: "back.out(1.5)"
        });
    }
}

/**
 * Initialize scroll-based animations
 * - Fixed to make sure elements are visible first to prevent faded sections
 */
function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    
    // First make sure all sections are visible (fixing faded sections issue)
    ensureSectionsVisible();
    
    // Define reusable animation functions
    const fadeUpElements = (selector, options = {}) => {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;
        
        // Ensure elements are visible first
        gsap.set(elements, { opacity: 1, y: 0 });
        
        gsap.from(elements, {
            opacity: 0,
            y: options.y || 30, // Reduced movement for smoother animation
            scale: options.scale || 0.95,
            duration: options.duration || 0.8,
            stagger: options.stagger || 0.1,
            ease: options.ease || 'power2.out',
            scrollTrigger: {
                trigger: options.trigger || elements[0].parentElement,
                start: options.start || 'top 80%',
                end: options.end || 'bottom 20%',
                toggleActions: options.toggleActions || 'play none none none'
            }
        });
    };
    
    // Create section header animations
    document.querySelectorAll('.section-header').forEach(header => {
        const title = header.querySelector('.section-title');
        const description = header.querySelector('.section-description');
        
        // Ensure elements are visible first
        if (title) gsap.set(title, { opacity: 1, y: 0 });
        if (description) gsap.set(description, { opacity: 1, y: 0 });
        
        if (title && description) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none none'
                }
            });
            
            tl.from(title, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: "back.out(1.7)"
            });
            
            tl.from(description, {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: "power2.out"
            }, '-=0.4');
        }
    });
    
    // Stats Section Animation - keep this for better reveal effect
    fadeUpElements('.stat-item', {
        y: 40,
        stagger: 0.15,
        trigger: '.stats-grid',
        ease: 'back.out(1.5)'
    });
    
    // Projects section animations with reduced motion
    fadeUpElements('.project-item', {
        stagger: 0.07,
        trigger: '.projects-grid',
        start: 'top 70%'
    });
    
    // Contact form animation
    fadeUpElements('.contact-form-container, .info-card, .social-card', {
        stagger: 0.2,
        trigger: '.contact-grid',
        start: 'top 70%'
    });
    
    // Team member animations
    fadeUpElements('.team-member', {
        stagger: 0.1,
        trigger: '.team-grid',
        start: 'top 70%'
    });
    
    // Footer animations
    fadeUpElements('.footer-brand, .footer-links, .footer-newsletter', {
        stagger: 0.1,
        trigger: '.footer-grid',
        start: 'top 90%'
    });
}

/**
 * Force all sections to be visible - fixes faded sections issue
 */
function ensureSectionsVisible() {
    // Make all potential faded elements visible
    const elementSelectors = [
        '.hero-content', '.hero-text', '.title span', '.description',
        '.hero-buttons', '.btn', '.stat-item', '.stat-number',
        '.section-header', '.section-title', '.section-description',
        '.project-item', '.team-member', '.achievement-item',
        '.featured-item', '.contact-form-container', '.info-card', 
        '.social-card', '.footer-grid', '.footer-brand',
        '.footer-links', '.footer-newsletter', '.achievement-content-wrap'
    ];
    
    elementSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.transform = 'none';
        });
    });
    
    // Also ensure active carousel items are visible
    document.querySelectorAll('.active').forEach(item => {
        item.style.opacity = '1';
        item.style.visibility = 'visible';
        item.style.transform = 'none';
    });
}

/**
 * Create scroll progress indicator
 */
function createScrollProgressIndicator() {
    // Check if the progress bar already exists
    if (document.querySelector('.scroll-progress')) return;
    
    // Create the progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    if (window.gsap && window.ScrollTrigger) {
        // Animate with GSAP
        gsap.to(progressBar, {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });
    } else {
        // Fallback without GSAP
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${progress}%`;
        });
    }
}

/**
 * Add various interaction effects to elements
 * - Removed cursor follower effect (point 3 in requirements)
 */
function addInteractionEffects() {
    // Add button click effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            this.appendChild(ripple);
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add hover effects to social icons
    document.querySelectorAll('.social-icon, .info-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.classList.add('social-icon-hover');
            
            // Create particle effects
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random position around icon
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 20 + 20;
                
                particle.style.cssText = `
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    background-color: var(--color-primary);
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    pointer-events: none;
                    opacity: 0;
                `;
                
                this.appendChild(particle);
                
                // Animate the particle
                if (window.gsap) {
                    gsap.to(particle, {
                        x: Math.cos(angle) * distance,
                        y: Math.sin(angle) * distance,
                        opacity: 1,
                        duration: 0.5,
                        onComplete: () => {
                            gsap.to(particle, {
                                opacity: 0,
                                scale: 0,
                                duration: 0.3,
                                onComplete: () => {
                                    particle.remove();
                                }
                            });
                        }
                    });
                } else {
                    // Simple fallback animation without GSAP
                    setTimeout(() => {
                        particle.remove();
                    }, 500);
                }
            }
        });
        
        icon.addEventListener('mouseleave', function() {
            this.classList.remove('social-icon-hover');
        });
        
        icon.addEventListener('animationend', function() {
            this.classList.remove('social-icon-hover');
        });
    });
    
    // Add image hover effects for project items
    document.querySelectorAll('.project-item, .featured-item, .team-member').forEach(item => {
        const image = item.querySelector('img');
        if (!image) return;
        
        item.addEventListener('mouseenter', function() {
            if (window.gsap) {
                gsap.to(image, {
                    scale: 1.05,
                    duration: 0.4
                });
            } else {
                // Fallback
                image.style.transform = 'scale(1.05)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (window.gsap) {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.4
                });
            } else {
                // Fallback
                image.style.transform = 'scale(1)';
            }
        });
    });
    
    // Enhance form label animations
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        const label = input.previousElementSibling;
        if (!label || !label.classList.contains('form-label')) return;
        
        // Move label up if input has value
        if (input.value) {
            label.classList.add('form-field-active');
        }
        
        input.addEventListener('focus', function() {
            label.classList.add('form-field-active');
            this.classList.add('focus-pulse');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                label.classList.remove('form-field-active');
            }
            this.classList.remove('focus-pulse');
        });
    });
    
    // Add scroll indicator at hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
        scrollIndicator.style.cssText = `
            position: absolute;
            bottom: 3rem;
            left: 50%;
            transform: translateX(-50%);
            color: var(--color-white);
            font-size: 2rem;
            cursor: pointer;
            opacity: 0;
        `;
        
        heroSection.appendChild(scrollIndicator);
        
        // Fade in after page load
        setTimeout(() => {
            scrollIndicator.style.opacity = '1';
        }, 1000);
        
        // Scroll to next section when clicked
        scrollIndicator.addEventListener('click', () => {
            const nextSection = heroSection.nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * Fixes potential layout issues
 */
function fixLayoutShifts() {
    // Check for proper hero section layout
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && window.innerWidth < 768) {
        heroVisual.style.height = 'auto';
        heroVisual.style.height = 'auto';
        heroVisual.style.marginTop = '2rem';
    }
    
    // Make sure carousel items have proper dimensions
    const carouselItems = document.querySelectorAll('.featured-item, .achievement-item');
    carouselItems.forEach(item => {
        const image = item.querySelector('img');
        if (image) {
            // Force image aspect ratio
            image.style.objectFit = 'cover';
        }
    });
    
    // Fix team member image display
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        const image = member.querySelector('img');
        if (image) {
            // Remove any opacity or filter styles that might make images unclear
            image.style.opacity = '1';
            image.style.filter = 'none';
        }
    });
}

// Initialize once the window is fully loaded
window.addEventListener('load', function() {
    // Force all sections to be visible - fixes faded sections issue
    ensureSectionsVisible();
    
    // Check if loading screen exists
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (loadingScreen) {
        // Add exit class to trigger animation
        setTimeout(() => {
            loadingScreen.classList.add('exit');
            
            // Remove loading screen after animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.classList.add('loaded');
                
                // Initialize remaining animations after loading
                if (window.initPageAnimations && typeof window.initPageAnimations === 'function') {
                    window.initPageAnimations();
                }
            }, 800);  // Duration of exit animation
        }, 1000);  // Minimum loading time for better UX
    } else {
        // No loading screen, initialize immediately
        document.body.classList.add('loaded');
        if (window.initPageAnimations && typeof window.initPageAnimations === 'function') {
            window.initPageAnimations();
        }
    }
    
    // Fix any potential layout shift issues
    fixLayoutShifts();
});

// Initialize stats counters when the page loads
document.addEventListener('DOMContentLoaded', initStatsCounters);

// Also call the function if it's used in page animations
window.initStatsCounters = initStatsCounters;