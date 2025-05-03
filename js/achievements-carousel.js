/**
 * Ultra-Modern Achievements Carousel
 * Sleek, High-Impact Design with Zero Fade or Overlap Issues
 */

function initAchievementsCarousel() {
    // Force all achievements to be fully visible immediately
    document.querySelectorAll('.achievement-item').forEach(item => {
        item.style.opacity = '0';
        item.style.visibility = 'hidden';
        item.style.position = 'absolute'; // Prevent overlap
    });
    
    // Immediately make the first one active to prevent flicker
    const firstItem = document.querySelector('.achievement-item');
    if (firstItem) {
        firstItem.classList.add('active');
        firstItem.style.position = 'relative';
        firstItem.style.opacity = '1';
        firstItem.style.visibility = 'visible';
        firstItem.style.transform = 'translateX(0)';
    }
    
    // Core carousel elements
    const items = document.querySelectorAll('.achievement-item');
    const dots = document.querySelectorAll('.achievements-dot');
    const prevBtn = document.querySelector('.achievements-prev');
    const nextBtn = document.querySelector('.achievements-next');
    const stage = document.querySelector('.achievement-stage');
    
    // Verify essential elements
    if (!items.length || !stage) {
        console.warn('Achievement carousel elements not found');
        return;
    }
    
    // Current slide tracking
    let currentIndex = 0;
    const itemCount = items.length;
    
    // Set initial stage height
    updateStageHeight(true);
    
    // Dynamic height adjustment (prevents layout shift)
    function updateStageHeight(immediate = false) {
        const activeItem = items[currentIndex];
        if (!activeItem) return;
        
        const newHeight = activeItem.offsetHeight;
        
        if (window.gsap && !immediate) {
            gsap.to(stage, {
                height: newHeight,
                duration: 0.4,
                ease: "power2.out"
            });
        } else {
            // Immediate update without animation
            stage.style.height = `${newHeight}px`;
        }
    }
    
    // Add enhanced visual effects to active slide
    function enhanceActiveSlide(item) {
        if (!window.gsap) return;
        
        // Add subtle floating animation to active image
        const image = item.querySelector('.achievement-image img');
        if (image) {
            gsap.to(image, {
                scale: 1.05,
                duration: 10,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    // Update the active achievement
    function updateCarousel(newIndex, isInitial = false) {
        // Validate index
        if (newIndex < 0) newIndex = itemCount - 1;
        if (newIndex >= itemCount) newIndex = 0;
        
        // Get relevant items
        const prevItem = items[currentIndex];
        const nextItem = items[newIndex];
        
        if (!prevItem || !nextItem) return;
        
        // Determine animation direction
        const isForward = (newIndex > currentIndex) || (currentIndex === itemCount - 1 && newIndex === 0);
        
        // Update with GSAP if available (for slick animations)
        if (window.gsap && !isInitial) {
            // Reset any existing animations
            gsap.killTweensOf(prevItem);
            gsap.killTweensOf(nextItem);
            
            // Timeline for coordinated animations
            const tl = gsap.timeline({
                defaults: { 
                    ease: "power3.inOut",
                    duration: 0.7
                }
            });
            
            // Set next item ready for animation
            gsap.set(nextItem, {
                position: 'absolute',
                autoAlpha: 0,
                x: isForward ? 100 : -100,
                zIndex: 2,
                scale: 0.95
            });
            
            // Animate current item out
            tl.to(prevItem, {
                x: isForward ? -100 : 100,
                autoAlpha: 0,
                scale: 0.95,
                onComplete: () => {
                    // Update classes
                    prevItem.classList.remove('active');
                    
                    // Reset position for next cycle
                    gsap.set(prevItem, { 
                        clearProps: "all",
                        position: 'absolute',
                        opacity: 0,
                        visibility: 'hidden'
                    });
                }
            });
            
            // Animate new item in (with slight overlap for smoothness)
            tl.to(nextItem, {
                x: 0,
                autoAlpha: 1,
                scale: 1,
                position: 'relative',
                onStart: () => {
                    nextItem.classList.add('active');
                },
                onComplete: () => {
                    // Apply visual enhancements to active slide
                    enhanceActiveSlide(nextItem);
                    
                    // Update height after animation
                    updateStageHeight();
                }
            }, "-=0.4");
            
        } else {
            // Basic non-GSAP transition (for initial setup or fallback)
            items.forEach(item => {
                item.classList.remove('active');
                item.style.opacity = '0';
                item.style.transform = 'translateX(50px)';
                item.style.position = 'absolute';
                item.style.visibility = 'hidden';
                item.style.zIndex = '1';
            });
            
            nextItem.classList.add('active');
            nextItem.style.opacity = '1';
            nextItem.style.transform = 'translateX(0)';
            nextItem.style.position = 'relative';
            nextItem.style.visibility = 'visible';
            nextItem.style.zIndex = '2';
            
            // Update height immediately
            updateStageHeight(true);
        }
        
        // Update indicators
        updateIndicators(newIndex);
        
        // Store current index
        currentIndex = newIndex;
    }
    
    // Update navigation indicators (dots)
    function updateIndicators(activeIndex) {
        if (!dots.length) return;
        
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
                if (window.gsap) {
                    gsap.to(dot, {
                        scale: 1.2,
                        backgroundColor: 'var(--color-primary)',
                        duration: 0.3
                    });
                }
            } else {
                dot.classList.remove('active');
                if (window.gsap) {
                    gsap.to(dot, {
                        scale: 1,
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        duration: 0.3
                    });
                }
            }
        });
    }
    
    // Button click feedback animation
    function animateButtonPress(button) {
        if (!window.gsap) return;
        
        gsap.timeline()
            .to(button, {
                scale: 0.9,
                duration: 0.1
            })
            .to(button, {
                scale: 1,
                duration: 0.2,
                ease: "back.out(3)"
            });
    }
    
    // Set up all event listeners
    function initEvents() {
        // Previous slide button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                updateCarousel(currentIndex - 1);
                animateButtonPress(prevBtn);
            });
        }
        
        // Next slide button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                updateCarousel(currentIndex + 1);
                animateButtonPress(nextBtn);
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateCarousel(index);
                animateButtonPress(dot);
            });
        });
        
        // Touch swipe support
        if (stage) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            stage.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            stage.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                
                if (touchEndX < touchStartX - 50) {
                    updateCarousel(currentIndex + 1);
                } else if (touchEndX > touchStartX + 50) {
                    updateCarousel(currentIndex - 1);
                }
            }, { passive: true });
        }
        
        // Window resize handler
        window.addEventListener('resize', function() {
            updateStageHeight(true);
        });
    }
    
    // Autoplay functionality
    let autoplayTimer;
    
    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            updateCarousel(currentIndex + 1);
        }, 6000); // Slightly longer interval for better UX
    }
    
    function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
    }
    
    // Pause autoplay on interaction
    const achievementsSection = document.querySelector('.achievements');
    if (achievementsSection) {
        achievementsSection.addEventListener('mouseenter', stopAutoplay);
        achievementsSection.addEventListener('mouseleave', startAutoplay);
        achievementsSection.addEventListener('touchstart', stopAutoplay, { passive: true });
        achievementsSection.addEventListener('touchend', startAutoplay, { passive: true });
    }
    
    // Ensure proper content wrap layout
    const contentWraps = document.querySelectorAll('.achievement-content-wrap');
    contentWraps.forEach(wrap => {
        wrap.style.display = 'grid';
        
        // Check viewport width to adjust grid layout
        if (window.innerWidth <= 992) {
            wrap.style.gridTemplateColumns = '1fr';
        } else {
            wrap.style.gridTemplateColumns = '1fr 1.5fr';
        }
        
        // Ensure gap is consistent
        wrap.style.gap = 'var(--spacing-xl)';
    });
    
    // Fix image container issues
    const imageContainers = document.querySelectorAll('.achievement-image');
    imageContainers.forEach(img => {
        img.style.height = '100%';
        img.style.minHeight = '30rem';
        img.style.position = 'relative';
        img.style.zIndex = '1';
        
        // Ensure images inside display properly
        const imageElement = img.querySelector('img');
        if (imageElement) {
            imageElement.style.width = '100%';
            imageElement.style.height = '100%';
            imageElement.style.objectFit = 'cover';
        }
    });
    
    // Initialize carousel
    function initialize() {
        // Set up event listeners
        initEvents();
        
        // Apply initial animations to active slide
        const activeItem = document.querySelector('.achievement-item.active');
        if (activeItem) {
            enhanceActiveSlide(activeItem);
        }
        
        // Start autoplay
        startAutoplay();
    }
    
    // Run initialization
    initialize();
    
    // Public API
    return {
        goToSlide: updateCarousel,
        startAutoplay,
        stopAutoplay
    };
}

// Initialize immediately when loaded
document.addEventListener('DOMContentLoaded', () => {
    // Force all elements to be visible first (prevents fade issues)
    document.querySelectorAll('.achievement-item, .achievement-content-wrap, .achievement-image, .achievement-content')
        .forEach(el => {
            // Make sure each element has visibility but starts hidden
            el.style.visibility = 'visible';
        });
    
    // Add CSS fixes
    const style = document.createElement('style');
    style.textContent = `
        .achievement-stage {
            position: relative;
            width: 100%;
            overflow: hidden;
            transition: height 0.4s ease;
            min-height: 400px;
        }
        
        .achievement-item {
            transition: transform 0.6s ease, opacity 0.6s ease;
        }
        
        .achievement-item.active {
            position: relative;
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
            z-index: 2;
        }
        
        @media (max-width: 992px) {
            .achievement-content-wrap {
                grid-template-columns: 1fr !important;
            }
            
            .achievement-stage {
                min-height: 650px;
            }
        }
        
        @media (max-width: 768px) {
            .achievement-stage {
                min-height: 750px;
            }
        }
        
        @media (max-width: 576px) {
            .achievement-stage {
                min-height: 800px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize with a slight delay to ensure DOM is ready
    setTimeout(() => {
        const carousel = initAchievementsCarousel();
        window.achievementsCarousel = carousel;
    }, 100);
});