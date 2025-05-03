/**
 * Advanced Typography and Animations for MNO AI LABS
 * Implements modern text effects and smooth animations
 */

// Initialize modern typography animations
function initModernTypography() {
    // Initialize only if needed libraries are available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP library not loaded');
        return;
    }
    
    // Hero section text animations
    animateHeroText();
    
    // Animate section headers on scroll
    animateSectionHeaders();
    
    // Animate stats counters
    animateStatsCounters();
}

/**
 * Hero Section Typography Animation
 * Uses modern clean reveal effects instead of glitchy animations
 */
function animateHeroText() {
    // Get hero text elements
    const heroLabel = document.querySelector('.hero .label');
    const heroTitle = document.querySelector('.hero .title');
    const heroDescription = document.querySelector('.hero .description');
    const heroButtons = document.querySelectorAll('.hero .btn');
    
    if (!heroTitle || !heroLabel) return;
    
    // Remove problematic classes
    heroLabel.classList.remove('glitch-effect');
    
    // Get title spans
    const titleSpans = heroTitle.querySelectorAll('span');
    
    // Clear existing animations and prepare spans
    titleSpans.forEach(span => {
        span.classList.remove('text-animate', 'split-chars', 'cyberpunk-glow', 'gradient-text');
        gsap.set(span, { clearProps: 'all' });
    });
    
    // Find the main highlighted span (AI Innovation)
    const highlightedSpan = titleSpans[1]; // Usually the middle span
    
    if (highlightedSpan) {
        // Add modern gradient instead of glow
        highlightedSpan.classList.add('modern-gradient');
        
        // Apply gradient text styling
        highlightedSpan.style.background = 'linear-gradient(to right, #6366f1, #10b981)';
        highlightedSpan.style.backgroundClip = 'text';
        highlightedSpan.style.webkitBackgroundClip = 'text';
        highlightedSpan.style.color = 'transparent';
        highlightedSpan.style.display = 'inline-block';
    }
    
    // Create clean timeline for hero animations
    const heroTimeline = gsap.timeline({
        defaults: {
            ease: 'power3.out',
            duration: 0.8
        }
    });
    
    // Animate label with clean fade up
    heroTimeline.fromTo(heroLabel, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
    );
    
    // Animate each title span with sequential reveal
    titleSpans.forEach((span, index) => {
        heroTimeline.fromTo(span,
            { y: 40, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.7,
                onComplete: () => {
                    // Add subtle animation to highlighted span
                    if (span === highlightedSpan) {
                        gsap.to(span, {
                            backgroundPosition: '200% center',
                            ease: 'none',
                            duration: 5,
                            repeat: -1
                        });
                    }
                }
            },
            index === 0 ? '-=0.3' : '-=0.5'
        );
    });
    
    // Animate description and buttons
    if (heroDescription) {
        heroTimeline.fromTo(heroDescription,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1 },
            '-=0.4'
        );
    }
    
    if (heroButtons.length) {
        heroTimeline.fromTo(heroButtons,
            { y: 30, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                stagger: 0.15,
                duration: 0.6
            },
            '-=0.5'
        );
    }
}

/**
 * Animate section headers with scroll-triggered reveals
 */
function animateSectionHeaders() {
    if (!window.ScrollTrigger) return;
    
    // Get all section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    sectionHeaders.forEach(header => {
        const title = header.querySelector('.section-title');
        const description = header.querySelector('.section-description');
        
        // Create timeline for each section header
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none none'
            }
        });
        
        if (title) {
            // Initial setup for title animation
            gsap.set(title, { opacity: 0, y: 30 });
            
            // Add to timeline
            timeline.to(title, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'back.out(1.7)'
            });
            
            // Add line animation
            const titleLine = title.querySelector('::after') || title;
            timeline.fromTo(titleLine,
                { width: '0%' },
                { width: '100%', duration: 0.6 },
                '-=0.4'
            );
        }
        
        if (description) {
            // Initial setup
            gsap.set(description, { opacity: 0, y: 20 });
            
            // Add to timeline
            timeline.to(description, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out'
            }, '-=0.4');
        }
    });
}

/**
 * Animate stats counters with improved effects
 */
function animateStatsCounters() {
}

// Export functions for main.js to use
window.initModernTypography = initModernTypography;