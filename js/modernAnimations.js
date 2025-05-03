/**
 * Modern Animations System for MNO AI LABS
 * Provides cutting-edge, high-quality animations
 */

// Initialize modern animations with improved effects
function initModernAnimations() {
    // Check if GSAP and ScrollTrigger are available
    if (!window.gsap) {
        console.error('GSAP library is required for animations');
        return;
    }

    // Register GSAP plugins if available
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Detect browser capabilities to adjust animation complexity
    const capabilities = MNOUtils.detectBrowserCapabilities();

    // First, ensure all elements are visible to fix faded sections
    MNOUtils.forceVisibility();

    // Initialize enhanced hero animations
    initEnhancedHeroAnimation();

    // Initialize scroll-based animations
    initScrollAnimations();

    // Set up interactive elements
    setupInteractiveElements();

    // Initialize section-specific animations
    initSectionAnimations();
}

/**
 * Enhanced Hero Animation with typewriter effect
 */
function initEnhancedHeroAnimation() {
    // Get hero elements
    const heroLabel = document.querySelector('.hero .label');
    const heroTitle = document.querySelector('.hero .title');
    const heroDescription = document.querySelector('.hero .description');
    const heroButtons = document.querySelectorAll('.hero .btn');
    
    // Create hero timeline
    const heroTimeline = gsap.timeline({
        defaults: { ease: "power3.out" }
    });
    
    // Prepare elements - ensure they're visible at start
    if (heroLabel) gsap.set(heroLabel, { opacity: 0 });
    
    // Set up title spans for sequential animation
    if (heroTitle) {
        const titleSpans = heroTitle.querySelectorAll('span');
        titleSpans.forEach(span => {
            // Store original text content
            span.setAttribute('data-text', span.textContent);
            
            // Clear text for typing effect
            if (!span.classList.contains('modern-gradient')) {
                span.textContent = '';
            } else {
                gsap.set(span, { opacity: 0 });
            }
        });
    }
    
    if (heroDescription) gsap.set(heroDescription, { opacity: 0 });
    if (heroButtons.length) gsap.set(heroButtons, { opacity: 0, y: 20 });
    
    // Animate label with fade in
    if (heroLabel) {
        heroTimeline.to(heroLabel, {
            opacity: 1,
            duration: 0.6
        });
    }
    
    // Animate title with proper typewriter effect on each span
    if (heroTitle) {
        const titleSpans = heroTitle.querySelectorAll('span');
        
        // First span typing
        if (titleSpans[0]) {
            const originalText = titleSpans[0].getAttribute('data-text');
            heroTimeline.add(() => {
                // Simple typewriter with no complex effects
                let i = 0;
                const typeInterval = setInterval(() => {
                    if (i <= originalText.length) {
                        titleSpans[0].textContent = originalText.substring(0, i) + (i < originalText.length ? '|' : '');
                        i++;
                    } else {
                        clearInterval(typeInterval);
                        titleSpans[0].textContent = originalText;
                    }
                }, 50);
            });
            
            // Add delay after typing
            heroTimeline.add("+=0.5");
        }
        
        // Gradient span fade in (special animation)
        if (titleSpans[1] && titleSpans[1].classList.contains('modern-gradient')) {
            heroTimeline.to(titleSpans[1], { 
                opacity: 1, 
                duration: 0.8
            });
            
            // Add background animation
            heroTimeline.add(() => {
                gsap.to(titleSpans[1], {
                    backgroundPosition: '200% center',
                    ease: "none",
                    duration: 8,
                    repeat: -1
                });
            });
            
            // Add delay
            heroTimeline.add("+=0.3");
        }
        
        // Last span typing
        if (titleSpans[2]) {
            const originalText = titleSpans[2].getAttribute('data-text');
            heroTimeline.add(() => {
                // Simple typewriter with no complex effects
                let i = 0;
                const typeInterval = setInterval(() => {
                    if (i <= originalText.length) {
                        titleSpans[2].textContent = originalText.substring(0, i) + (i < originalText.length ? '|' : '');
                        i++;
                    } else {
                        clearInterval(typeInterval);
                        titleSpans[2].textContent = originalText;
                    }
                }, 50);
            });
        }
    }
    
    // Animate description with simple fade in (no typing)
    if (heroDescription) {
        heroTimeline.to(heroDescription, { 
            opacity: 1, 
            duration: 0.8 
        }, "-=0.3");
    }
    
    // Animate buttons with stagger
    if (heroButtons.length) {
        heroTimeline.to(heroButtons, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: "back.out(1.5)"
        }, "-=0.2");
    }
    
    // Add hero background animation
    animateHeroBackground();
}

/**
 * Animate hero background with particles and gradients
 */
function animateHeroBackground() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Create decorative elements animation
    const decorElements = heroSection.querySelectorAll('.deco-circle, .deco-triangle, .deco-square, .deco-grid');
    
    // Randomize starting positions slightly
    decorElements.forEach(elem => {
        const xOffset = Math.random() * 20 - 10;
        const yOffset = Math.random() * 20 - 10;
        
        gsap.fromTo(elem,
            { x: xOffset, y: yOffset, opacity: 0 },
            { 
                x: 0, 
                y: 0, 
                opacity: 1, 
                duration: 1.5, 
                ease: "power2.out" 
            }
        );
    });
    
    // Find or create hero visual container
    const visualContainer = document.querySelector('.hero-visual .visual-container');
    if (visualContainer) {
        // Add flowing gradient animation to background
        gsap.to(visualContainer, {
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.15))',
            backgroundSize: '400% 400%',
            duration: 10,
            ease: "none",
            repeat: -1,
            yoyo: true
        });
        
        // Add particles to visual container (if MNOUtils is available)
        if (window.MNOUtils && MNOUtils.createParticles) {
            MNOUtils.createParticles(visualContainer, {
                count: 30,
                colors: ['#6366f1', '#10b981', '#818cf8'],
                size: { min: 3, max: 8 },
                opacity: { min: 0.2, max: 0.6 },
                duration: { min: 5, max: 10 },
                speed: { x: 1, y: 1 },
                direction: 'vortex',
                trigger: 'auto'
            });
        }
    }
}

/**
 * Initialize enhanced scroll-based animations
 */
function initScrollAnimations() {
    if (!window.ScrollTrigger) return;
    
    // Animate section headers (simplified, no typing)
    animateSectionHeaders();
    
    // Animate stats counters with enhanced effects
    animateStatsCounters();
    
    // Create reveal animations for all major sections
    createSectionRevealAnimations();
    
    // Improve project grid animations
    enhanceProjectGridAnimations();
    
    // Enhance team member animations
    enhanceTeamMemberAnimations();
    
    // Add scroll indicators
    addScrollIndicators();
}

/**
 * Create simple section header animations (no typing)
 */

/**
 * Create reveal animations for all major sections
 */
function createSectionRevealAnimations() {
    // Select major sections to animate
    const sections = document.querySelectorAll('.achievements, .featured, .projects, .teams, .contact');
    
    sections.forEach(section => {
        // Create reveal animation
        gsap.fromTo(section, 
            { 
                opacity: 0.8,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

/**
 * Enhance project grid animations
 */
function enhanceProjectGridAnimations() {
    const projectItems = document.querySelectorAll('.project-item');
    if (!projectItems.length) return;
    
    // Reset all items to be visible
    projectItems.forEach(item => {
        gsap.set(item, { opacity: 1, y: 0 });
    });
    
    // Create staggered animation
    gsap.from(projectItems, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: {
            each: 0.1,
            from: "center",
            grid: "auto"
        },
        ease: "back.out(1.4)",
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    // Add enhanced hover effects to project items
    projectItems.forEach(item => {
        // Create better hover animation for each project
        item.addEventListener('mouseenter', () => {
            const overlay = item.querySelector('.project-overlay');
            if (overlay) {
                gsap.to(overlay, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
            
            gsap.to(item, {
                y: -10,
                boxShadow: '0 20px 30px rgba(0, 0, 0, 0.3)',
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            const overlay = item.querySelector('.project-overlay');
            if (overlay) {
                gsap.to(overlay, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    ease: "power2.in"
                });
            }
            
            gsap.to(item, {
                y: 0,
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });
}

/**
 * Enhance team member animations
 */
function enhanceTeamMemberAnimations() {
    const teamMembers = document.querySelectorAll('.team-member');
    if (!teamMembers.length) return;
    
    // Reset opacity to ensure all members are visible
    teamMembers.forEach(member => {
        gsap.set(member, { opacity: 1, y: 0 });
    });
    
    // Get active team section
    const activeTeamSection = document.querySelector('.team-section.active');
    if (!activeTeamSection) return;
    
    // Get members in active team
    const activeMembers = activeTeamSection.querySelectorAll('.team-member');
    
    // Create staggered animation for active team members
    gsap.from(activeMembers, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: activeTeamSection,
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
}

/**
 * Add scroll indicators
 */
function addScrollIndicators() {
    // Add scroll down indicator at hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Create scroll indicator if it doesn't exist
        if (!document.querySelector('.scroll-down-indicator')) {
            const scrollIndicator = document.createElement('div');
            scrollIndicator.className = 'scroll-down-indicator';
            scrollIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
            scrollIndicator.style.cssText = `
                position: absolute;
                bottom: 3rem;
                left: 50%;
                transform: translateX(-50%);
                color: var(--color-white);
                font-size: 2rem;
                cursor: pointer;
                animation: scrollDownIndicator 1.5s ease-in-out infinite;
                opacity: 0;
            `;
            
            heroSection.appendChild(scrollIndicator);
            
            // Animate in after hero animation completes
            gsap.to(scrollIndicator, {
                opacity: 1,
                delay: 3,
                duration: 0.5
            });
            
            // Scroll to next section on click
            scrollIndicator.addEventListener('click', () => {
                const nextSection = heroSection.nextElementSibling;
                if (nextSection) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: nextSection,
                            offsetY: 80
                        },
                        ease: "power2.inOut"
                    });
                }
            });
        }
    }
    
    // Create scroll progress indicator
    if (!document.querySelector('.scroll-progress')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            width: 0%;
            background: linear-gradient(90deg, #6366f1, #10b981);
            z-index: 1000;
        `;
        
        document.body.appendChild(progressBar);
        
        // Animate progress bar with scroll
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
    }
}

/**
 * Set up interactive elements with enhanced effects
 */
function setupInteractiveElements() {
    // Add button hover effects
    const buttons = document.querySelectorAll('.btn, .filter-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -3,
                boxShadow: '0 5px 15px rgba(99, 102, 241, 0.4)',
                duration: 0.3
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
                duration: 0.3
            });
        });
    });
}

/**
 * Initialize section-specific animations
 */
function initSectionAnimations() {
    // Basic animations for contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                gsap.to(this, {
                    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
                    borderColor: 'var(--color-primary)',
                    duration: 0.3
                });
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    gsap.to(this, {
                        boxShadow: 'none',
                        borderColor: 'var(--color-gray-800)',
                        duration: 0.3
                    });
                }
            });
        });
    }
}

// Initialize on window load
window.addEventListener('load', function() {
    // Try to initialize animations
    try {
        initModernAnimations();
    } catch (err) {
        console.error('Error initializing modern animations:', err);
        
        // Fallback: force all elements to be visible
        if (window.MNOUtils && MNOUtils.forceVisibility) {
            MNOUtils.forceVisibility();
        }
    }
});