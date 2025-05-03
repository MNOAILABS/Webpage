/**
 * Modern Loading Screen Animation
 * MNO AI LABS - Cutting-Edge Design
 */

(() => {
    // Show loading animation with modern mesh effect
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (loadingScreen) {
        // Create the modern loading effects
        initModernLoadingEffects();
        
        // Handle the loading screen removal
        window.addEventListener('load', () => {
            setTimeout(() => {
                removeLoadingScreen();
            }, 1500); // Delay for visual effect
        });
    }

    /**
     * Initialize modern loading effects
     */
    function initModernLoadingEffects() {
        // Create geometric shapes for loading animation
        createGeometricShapes();
        
        // Add glitch text effect to logo if applicable
        const logoElement = document.querySelector('.loader-logo');
        if (logoElement) {
            // Add glitch effect timing
            setTimeout(() => {
                addGlitchEffect(logoElement);
            }, 500);
            
            setTimeout(() => {
                removeGlitchEffect(logoElement);
            }, 1000);
        }
    }

    /**
     * Create geometric shapes for modern loading effect
     */
    function createGeometricShapes() {
        const shapesContainer = document.querySelector('.loading-geometric-shapes');
        if (!shapesContainer) return;
        
        // Number of shapes to create
        const shapeCount = 20;
        
        // Shape types
        const shapeTypes = ['diamond', 'triangle', 'circle', 'line'];
        
        // Create shapes
        for (let i = 0; i < shapeCount; i++) {
            const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            const shape = document.createElement('div');
            
            // Set base styles for all shapes
            shape.style.cssText = `
                position: absolute;
                opacity: 0;
                transform: scale(0) rotate(0deg);
                pointer-events: none;
                z-index: 1;
            `;
            
            // Determine size - make some bigger for variety
            const size = Math.random() < 0.7 ? 
                Math.random() * 10 + 5 + 'px' : 
                Math.random() * 30 + 20 + 'px';
            
            // Random position within the loading container
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            
            // Set shape-specific styles
            switch (shapeType) {
                case 'diamond':
                    shape.style.width = size;
                    shape.style.height = size;
                    shape.style.backgroundColor = 'rgba(99, 102, 241, ' + (Math.random() * 0.5 + 0.1) + ')';
                    shape.style.transform = 'rotate(45deg)';
                    break;
                    
                case 'triangle':
                    const triangleSize = parseInt(size);
                    shape.style.width = '0';
                    shape.style.height = '0';
                    shape.style.borderLeft = triangleSize / 2 + 'px solid transparent';
                    shape.style.borderRight = triangleSize / 2 + 'px solid transparent';
                    shape.style.borderBottom = triangleSize + 'px solid rgba(16, 185, 129, ' + (Math.random() * 0.5 + 0.1) + ')';
                    break;
                    
                case 'circle':
                    shape.style.width = size;
                    shape.style.height = size;
                    shape.style.borderRadius = '50%';
                    shape.style.backgroundColor = 'rgba(236, 72, 153, ' + (Math.random() * 0.5 + 0.1) + ')';
                    break;
                    
                case 'line':
                    shape.style.width = Math.random() * 30 + 20 + 'px';
                    shape.style.height = '1px';
                    shape.style.backgroundColor = 'rgba(99, 102, 241, ' + (Math.random() * 0.5 + 0.2) + ')';
                    break;
            }
            
            // Add to container
            shapesContainer.appendChild(shape);
            
            // Animate in with random delay
            gsap.to(shape, {
                opacity: Math.random() * 0.8 + 0.2,
                scale: 1,
                rotation: Math.random() * 360,
                duration: 0.8,
                delay: Math.random() * 1.5,
                ease: 'elastic.out(1, 0.3)',
                onComplete: () => {
                    // Float animation
                    gsap.to(shape, {
                        x: Math.random() * 40 - 20,
                        y: Math.random() * 40 - 20,
                        rotation: '+=' + (Math.random() * 180 - 90),
                        duration: Math.random() * 4 + 3,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut'
                    });
                }
            });
        }
    }

    /**
     * Add glitch effect to an element
     */
    function addGlitchEffect(element) {
        // Clone the element twice for glitch effect
        const glitch1 = element.cloneNode(true);
        const glitch2 = element.cloneNode(true);
        
        glitch1.style.position = 'absolute';
        glitch1.style.top = '0';
        glitch1.style.left = '0';
        glitch1.style.width = '100%';
        glitch1.style.height = '100%';
        glitch1.style.clipPath = 'polygon(0 0, 100% 0, 100% 45%, 0 45%)';
        glitch1.style.transform = 'translate(-5px, 0)';
        glitch1.style.filter = 'hue-rotate(90deg)';
        glitch1.classList.add('glitch-clone');
        
        glitch2.style.position = 'absolute';
        glitch2.style.top = '0';
        glitch2.style.left = '0';
        glitch2.style.width = '100%';
        glitch2.style.height = '100%';
        glitch2.style.clipPath = 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)';
        glitch2.style.transform = 'translate(5px, 0)';
        glitch2.style.filter = 'hue-rotate(180deg)';
        glitch2.classList.add('glitch-clone');
        
        const container = element.parentElement;
        container.style.position = 'relative';
        container.appendChild(glitch1);
        container.appendChild(glitch2);
        
        // Animate glitch effect
        gsap.to([glitch1, glitch2], {
            x: (i) => [5, -5][i],
            y: (i) => [-5, 5][i],
            duration: 0.1,
            repeat: 5,
            yoyo: true,
            ease: 'none'
        });
    }

    /**
     * Remove glitch effect from an element
     */
    function removeGlitchEffect(element) {
        const glitchElements = element.parentElement.querySelectorAll('.glitch-clone');
        glitchElements.forEach(el => {
            gsap.to(el, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => el.remove()
            });
        });
    }

    /**
     * Remove the loading screen with animation
     */
    function removeLoadingScreen() {
        if (!loadingScreen) return;
        
        // Create a flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            inset: 0;
            background-color: white;
            opacity: 0;
            z-index: 10;
        `;
        loadingScreen.appendChild(flash);
        
        // Timeline for loading exit
        const exitTimeline = gsap.timeline();
        
        // Flash effect
        exitTimeline.to(flash, {
            opacity: 0.8,
            duration: 0.1,
            ease: 'power2.out'
        });
        
        exitTimeline.to(flash, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        });
        
        // Scale logo
        exitTimeline.to('.loader-logo', {
            scale: 1.5,
            opacity: 0,
            duration: 0.5,
            ease: 'back.in(1.7)'
        }, '-=0.2');
        
        // Fade out geometric shapes
        exitTimeline.to('.loading-geometric-shapes > div', {
            opacity: 0,
            scale: 0,
            stagger: 0.02,
            duration: 0.4,
            ease: 'power2.in'
        }, '-=0.4');
        
        // Slide out loading screen
        exitTimeline.to(loadingScreen, {
            y: '-100%',
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
                loadingScreen.style.display = 'none';
                
                // Initialize remaining animations once loading is complete
                if (window.initPageAnimations && typeof window.initPageAnimations === 'function') {
                    window.initPageAnimations();
                }
            }
        });
    }
})();