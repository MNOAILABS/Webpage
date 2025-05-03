/**
 * Project Filters for MNO AI LABS
 * Updated to work with new project categories
 */

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (!filterButtons.length || !projectItems.length) return;
    
    // Set initial animation index for staggered reveal
    projectItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
    
    // Make all projects visible initially
    gsap.set(projectItems, { opacity: 1, y: 0 });
    
    // Initial load animation with stagger
    gsap.from(projectItems, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(1.4)",
        onComplete: () => {
            // Add hover effect to each project
            projectItems.forEach(item => {
                const overlay = item.querySelector('.project-overlay');
                if (!overlay) return;
                
                // Reset overlay to ensure it's initially hidden
                gsap.set(overlay, { opacity: 0, y: 20 });
            });
        }
    });
    
    // Filter functionality with improved animations
    filterButtons.forEach(button => {
        // Add click handler
        button.addEventListener('click', function() {
            // Only process if this button isn't already active
            if (this.classList.contains('active')) return;
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                gsap.to(btn, {
                    backgroundColor: 'transparent',
                    color: 'var(--color-gray-300)',
                    boxShadow: 'none',
                    duration: 0.3
                });
            });
            
            // Set this button as active with enhanced styling
            this.classList.add('active');
            gsap.to(this, {
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
                scale: 1.05,
                duration: 0.3,
                ease: "back.out(1.7)",
                onComplete: () => {
                    gsap.to(this, { scale: 1, duration: 0.2, delay: 0.1 });
                }
            });
            
            // Filter the projects with improved animation
            const timeline = gsap.timeline();
            
            // First ensure all items are visible to start the animation
            projectItems.forEach(item => {
                gsap.set(item, { display: 'block', opacity: 1 });
            });
            
            // First, animate current items out
            timeline.to(projectItems, {
                opacity: 0,
                y: 20,
                stagger: {
                    each: 0.03,
                    from: "random"
                },
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    // Update visibility based on filter
                    projectItems.forEach(item => {
                        const shouldShow = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
                        gsap.set(item, { 
                            display: shouldShow ? 'block' : 'none',
                        });
                    });
                    
                    // Get visible items
                    const visibleItems = Array.from(projectItems).filter(
                        item => filterValue === 'all' || item.getAttribute('data-category') === filterValue
                    );
                    
                    // Add enhanced spotlight effect
                    createFilterEffect(filterValue);
                    
                    // Animate filtered items back in with improved stagger
                    gsap.to(visibleItems, {
                        opacity: 1,
                        y: 0,
                        stagger: {
                            each: 0.05,
                            from: "center",
                            grid: "auto"
                        },
                        duration: 0.5,
                        ease: "back.out(1.4)"
                    });
                }
            });
        });
        
        // Enhanced hover effects for filter buttons
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                gsap.to(this, {
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)',
                    scale: 1.05,
                    duration: 0.3
                });
            } else {
                // Even for active buttons, add some hover feedback
                gsap.to(this, {
                    boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
                    duration: 0.3
                });
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                gsap.to(this, {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    scale: 1,
                    duration: 0.3
                });
            } else {
                // Reset active button styles
                gsap.to(this, {
                    boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)',
                    duration: 0.3
                });
            }
        });
    });
    
    // Enhanced filter effect animation
    function createFilterEffect(category) {
        // Remove any existing effect
        const existingEffect = document.querySelector('.filter-effect');
        if (existingEffect) {
            existingEffect.remove();
        }
        
        // Create container for filter effects
        const effectsContainer = document.createElement('div');
        effectsContainer.className = 'filter-effect';
        effectsContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        // Create pulse effect
        const pulse = document.createElement('div');
        pulse.className = 'filter-pulse';
        pulse.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, 
                rgba(99, 102, 241, 0.1) 0%, 
                transparent 70%);
            opacity: 0;
        `;
        effectsContainer.appendChild(pulse);
        
        // Create particles for enhanced animation
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'filter-particle';
            
            // Random particle color based on category
            let particleColor;
            switch(category) {
                case 'business':
                    particleColor = 'rgba(236, 72, 153, 0.7)'; // Pink
                    break;
                case 'finance':
                    particleColor = 'rgba(59, 130, 246, 0.7)'; // Blue
                    break;
                case 'travel':
                    particleColor = 'rgba(16, 185, 129, 0.7)'; // Green
                    break;
                case 'media':
                    particleColor = 'rgba(245, 158, 11, 0.7)'; // Amber
                    break;
                case 'research':
                    particleColor = 'rgba(167, 139, 250, 0.7)'; // Purple
                    break;
                default:
                    particleColor = 'rgba(99, 102, 241, 0.7)'; // Indigo (default)
            }
            
            particle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background-color: ${particleColor};
                border-radius: 50%;
                opacity: 0;
                transform: translate(-50%, -50%) scale(0);
            `;
            effectsContainer.appendChild(particle);
        }
        
        // Add to projects grid
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.style.position = 'relative';
            projectsGrid.appendChild(effectsContainer);
            
            // Animate pulse
            gsap.to(pulse, {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(pulse, {
                        opacity: 0,
                        scale: 1.5,
                        duration: 1
                    });
                }
            });
            
            // Animate particles
            const particles = effectsContainer.querySelectorAll('.filter-particle');
            particles.forEach((particle, i) => {
                // Random direction
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 200 + 200;
                
                gsap.to(particle, {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0.8,
                    scale: 1.5,
                    duration: 1 + Math.random() * 1,
                    delay: i * 0.02,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(particle, {
                            opacity: 0,
                            scale: 0,
                            duration: 0.5
                        });
                    }
                });
            });
            
            // Auto-remove after animation completes
            setTimeout(() => {
                gsap.to(effectsContainer, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => effectsContainer.remove()
                });
            }, 2500);
        }
    }
    
    // Add hover effects for project buttons
    document.querySelectorAll('.project-buttons .btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                scale: 1.05,
                boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)',
                duration: 0.3
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                backgroundColor: 'transparent',
                color: 'var(--color-white)',
                scale: 1,
                boxShadow: 'none',
                duration: 0.3
            });
        });
    });
}

// Initialize if document is already loaded
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initProjectFilters, 1);
} else {
    document.addEventListener("DOMContentLoaded", initProjectFilters);
}