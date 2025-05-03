/**
 * Utility Functions for MNO AI LABS
 * Contains helper functions and shared utilities
 */

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Detect if device is mobile
function isMobile() {
    return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Detect if device supports hover
function supportsHover() {
    return window.matchMedia('(hover: hover)').matches;
}

// Force set opacity to 1 on all elements
function forceVisibility() {
    // List of selectors that may have animation issues
    const selectors = [
        '.hero-content', '.hero-text', '.title span', '.description',
        '.hero-buttons', '.btn', '.stat-item', '.stat-number',
        '.section-header', '.section-title', '.section-description',
        '.project-item', '.team-member', '.achievement-item',
        '.featured-item', '.contact-form-container', '.info-card', 
        '.social-card', '.footer-grid', '.footer-brand',
        '.footer-links', '.footer-newsletter', '.achievement-content-wrap'
    ];
    
    // Fix visibility of each element
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            // Remove any inline styles that might be causing fading issues
            if (element.style.opacity !== undefined && element.style.opacity !== '1') {
                element.style.opacity = '1';
            }
            if (element.style.visibility !== undefined && element.style.visibility !== 'visible') {
                element.style.visibility = 'visible';
            }
            
            // Remove transform styles that might be causing elements to be out of place
            if (element.style.transform && element.style.transform !== 'none') {
                element.style.transform = 'none';
            }
        });
    });
    
    // Also ensure active carousel items are visible
    document.querySelectorAll('.active').forEach(item => {
        item.style.opacity = '1';
        item.style.visibility = 'visible';
    });
}

// Create typing animation on element
function createTypewriterEffect(element, text, options = {}) {
    if (!element) return;
    
    // Default options
    const settings = {
        speed: options.speed || 50,               // Characters per second
        delay: options.delay || 0,                // Delay before starting
        cursor: options.cursor !== false,         // Show cursor
        cursorSpeed: options.cursorSpeed || 500,  // Cursor blink speed
        onComplete: options.onComplete || null    // Callback when completed
    };
    
    // Clear any existing content and styles
    element.textContent = '';
    element.style.whiteSpace = 'pre-wrap';
    
    // Add cursor if enabled
    let cursor;
    if (settings.cursor) {
        cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.textContent = '|';
        cursor.style.animation = `cursorBlink ${settings.cursorSpeed}ms step-end infinite`;
        element.appendChild(cursor);
        
        // Add cursor animation if it doesn't exist
        if (!document.querySelector('#cursor-blink-style')) {
            const style = document.createElement('style');
            style.id = 'cursor-blink-style';
            style.textContent = '@keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }';
            document.head.appendChild(style);
        }
    }
    
    // Start typing after specified delay
    setTimeout(() => {
        let charIndex = 0;
        const textNode = document.createTextNode('');
        element.insertBefore(textNode, cursor);
        
        const typeInterval = setInterval(() => {
            if (charIndex < text.length) {
                textNode.nodeValue += text.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                
                // Remove cursor blinking after typing is complete
                if (settings.cursor && !options.keepCursor) {
                    setTimeout(() => {
                        if (cursor && cursor.parentNode) {
                            cursor.style.animation = 'none';
                            gsap.to(cursor, {
                                opacity: 0,
                                duration: 0.5
                            });
                        }
                    }, 1000);
                }
                
                // Call completion callback if provided
                if (typeof settings.onComplete === 'function') {
                    settings.onComplete();
                }
            }
        }, 1000 / settings.speed);
    }, settings.delay);
    
    return element;
}

// Split text for animated reveal
function splitText(element, config = {}) {
    if (!element) return null;
    
    // Default config
    const settings = {
        type: config.type || 'chars',      // 'chars', 'words', or 'lines'
        tag: config.tag || 'span',         // HTML tag to wrap the text units
        className: config.className || ''   // Class to add to each wrapper
    };
    
    // Get original text content
    const text = element.textContent.trim();
    element.textContent = '';
    
    // Split based on type
    let units = [];
    
    if (settings.type === 'chars') {
        units = text.split('');
    } else if (settings.type === 'words') {
        units = text.split(' ').map(word => (word + ' '));
    } else if (settings.type === 'lines') {
        // Basic line split (not as accurate as GSAP SplitText)
        units = text.split('\n');
    }
    
    // Create wrappers
    const wrappers = [];
    units.forEach(unit => {
        const wrapper = document.createElement(settings.tag);
        if (settings.className) wrapper.className = settings.className;
        wrapper.textContent = unit;
        element.appendChild(wrapper);
        wrappers.push(wrapper);
    });
    
    return wrappers;
}

// Convert color to RGBA
function colorToRGBA(color, alpha = 1) {
    // Create temporary element to compute style
    const el = document.createElement('div');
    el.style.color = color;
    document.body.appendChild(el);
    
    // Get computed color
    const computed = window.getComputedStyle(el).color;
    document.body.removeChild(el);
    
    // Parse the computed color
    const match = computed.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (match) {
        return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
    }
    
    // Return original if no match
    return color;
}

// Detect browser capabilities for animations
function detectBrowserCapabilities() {
    return {
        webGL: (function() {
            try {
                const canvas = document.createElement('canvas');
                return !!window.WebGLRenderingContext && 
                       (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
            } catch(e) {
                return false;
            }
        })(),
        webAnimations: 'animate' in document.documentElement,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highPerformance: !(navigator.deviceMemory && navigator.deviceMemory < 4) && 
                        !(navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
    };
}

// Create a glitch text effect
function glitchText(element, options = {}) {
    if (!element) return;
    
    // Default options
    const settings = {
        duration: options.duration || 2000,
        intensity: options.intensity || 0.5,
        glitchLetters: options.glitchLetters || '!<>-_\\/[]{}—=+*^?#________',
        originalText: options.text || element.textContent,
        onComplete: options.onComplete || null
    };
    
    // Normalize intensity between 0 and 1
    const intensity = Math.min(1, Math.max(0, settings.intensity));
    
    // Calculate iterations based on duration and intensity
    const baseIterations = 10;
    const iterations = Math.floor(baseIterations * intensity);
    const interval = settings.duration / iterations;
    
    let counter = 0;
    const originalText = settings.originalText;
    const textLength = originalText.length;
    
    const glitchInterval = setInterval(() => {
        // Create glitched text by replacing random characters
        let glitchedText = '';
        const glitchAmount = Math.floor(textLength * intensity * Math.random());
        
        for (let i = 0; i < textLength; i++) {
            // Determine if this character should be glitched
            if (Math.random() < intensity && glitchAmount > 0) {
                // Replace with a random glitch character
                const randomChar = settings.glitchLetters.charAt(
                    Math.floor(Math.random() * settings.glitchLetters.length)
                );
                glitchedText += randomChar;
            } else {
                // Keep original character
                glitchedText += originalText.charAt(i);
            }
        }
        
        // Update text
        element.textContent = glitchedText;
        
        // Increment counter
        counter++;
        
        // When complete, restore original text
        if (counter >= iterations) {
            clearInterval(glitchInterval);
            element.textContent = originalText;
            
            // Call completion callback if provided
            if (typeof settings.onComplete === 'function') {
                settings.onComplete();
            }
        }
    }, interval);
    
    return {
        stop: () => {
            clearInterval(glitchInterval);
            element.textContent = originalText;
        }
    };
}

// Add particle effects
function createParticles(container, options = {}) {
    if (!container) return;
    
    // Default options
    const settings = {
        count: options.count || 50,
        colors: options.colors || ['#6366f1', '#10b981', '#ec4899'],
        size: options.size || { min: 3, max: 8 },
        duration: options.duration || { min: 2, max: 5 },
        speed: options.speed || { x: 2, y: 2 },
        opacity: options.opacity || { min: 0.3, max: 0.8 },
        randomize: options.randomize !== false,
        direction: options.direction || 'outward',
        trigger: options.trigger || 'auto',
        lifetime: options.lifetime || 0
    };
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: 1;
    `;
    
    // Set container position if not already set
    if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
    }
    
    container.appendChild(particleContainer);
    
    // Function to create a single particle
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * (settings.size.max - settings.size.min) + settings.size.min;
        const color = settings.colors[Math.floor(Math.random() * settings.colors.length)];
        const opacity = Math.random() * (settings.opacity.max - settings.opacity.min) + settings.opacity.min;
        const duration = Math.random() * (settings.duration.max - settings.duration.min) + settings.duration.min;
        
        // Initial position (center or random)
        const startX = settings.randomize ? Math.random() * 100 : 50;
        const startY = settings.randomize ? Math.random() * 100 : 50;
        
        // Set initial styles
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: 50%;
            top: ${startY}%;
            left: ${startX}%;
            opacity: ${opacity};
            pointer-events: none;
            will-change: transform, opacity;
        `;
        
        // Append to container
        particleContainer.appendChild(particle);
        
        // Calculate end position
        let endX, endY;
        if (settings.direction === 'outward') {
            // Random angle
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 50; // Ensure it goes off-screen
            
            // Convert to percentage coordinates
            endX = 50 + Math.cos(angle) * distance;
            endY = 50 + Math.sin(angle) * distance;
        } else if (settings.direction === 'upward') {
            endX = startX + (Math.random() - 0.5) * 50;
            endY = -10; // Above the container
        } else if (settings.direction === 'vortex') {
            // Spiral pattern
            const startAngle = Math.atan2(startY - 50, startX - 50);
            const endAngle = startAngle + Math.PI * 2;
            const endDistance = Math.random() * 100 + 50;
            
            endX = 50 + Math.cos(endAngle) * endDistance;
            endY = 50 + Math.sin(endAngle) * endDistance;
        } else {
            // Random direction
            endX = Math.random() * 100;
            endY = Math.random() * 100;
        }
        
        // Animate with GSAP if available, otherwise use CSS
        if (window.gsap) {
            gsap.to(particle, {
                left: `${endX}%`,
                top: `${endY}%`,
                opacity: 0,
                duration: duration,
                ease: "power2.out",
                onComplete: () => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }
            });
        } else {
            // CSS fallback
            particle.style.transition = `left ${duration}s ease-out, top ${duration}s ease-out, opacity ${duration}s ease-out`;
            setTimeout(() => {
                particle.style.left = `${endX}%`;
                particle.style.top = `${endY}%`;
                particle.style.opacity = 0;
            }, 10);
            
            // Remove when animation completes
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration * 1000);
        }
    }
    
    // Create initial batch of particles
    if (settings.trigger === 'auto' || settings.trigger === 'load') {
        for (let i = 0; i < settings.count; i++) {
            setTimeout(createParticle, Math.random() * 1000);
        }
    }
    
    // Setup event-based particles
    if (settings.trigger === 'hover' || settings.trigger === 'both') {
        container.addEventListener('mouseenter', () => {
            for (let i = 0; i < settings.count / 2; i++) {
                setTimeout(createParticle, Math.random() * 500);
            }
        });
    }
    
    if (settings.trigger === 'click' || settings.trigger === 'both') {
        container.addEventListener('click', (e) => {
            // Create particles centered at click position
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            for (let i = 0; i < settings.count; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random properties
                const size = Math.random() * (settings.size.max - settings.size.min) + settings.size.min;
                const color = settings.colors[Math.floor(Math.random() * settings.colors.length)];
                const opacity = Math.random() * (settings.opacity.max - settings.opacity.min) + settings.opacity.min;
                const duration = Math.random() * (settings.duration.max - settings.duration.min) + settings.duration.min;
                
                // Initial position (at click point)
                particle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background-color: ${color};
                    border-radius: 50%;
                    top: ${y}%;
                    left: ${x}%;
                    opacity: ${opacity};
                    pointer-events: none;
                `;
                
                // Append to container
                particleContainer.appendChild(particle);
                
                // Random angle for movement
                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 100;
                
                // Destination position
                const endX = x + Math.cos(angle) * distance;
                const endY = y + Math.sin(angle) * distance;
                
                // Animate with GSAP if available
                if (window.gsap) {
                    gsap.to(particle, {
                        left: `${endX}%`,
                        top: `${endY}%`,
                        opacity: 0,
                        duration: duration,
                        delay: Math.random() * 0.2,
                        ease: "power2.out",
                        onComplete: () => {
                            if (particle.parentNode) {
                                particle.parentNode.removeChild(particle);
                            }
                        }
                    });
                } else {
                    // CSS Fallback
                    setTimeout(() => {
                        particle.style.transition = `left ${duration}s ease-out, top ${duration}s ease-out, opacity ${duration}s ease-out`;
                        particle.style.left = `${endX}%`;
                        particle.style.top = `${endY}%`;
                        particle.style.opacity = 0;
                        
                        // Remove when animation completes
                        setTimeout(() => {
                            if (particle.parentNode) {
                                particle.parentNode.removeChild(particle);
                            }
                        }, duration * 1000);
                    }, Math.random() * 200);
                }
            }
        });
    }
    
    // Remove after lifetime if specified
    if (settings.lifetime > 0) {
        setTimeout(() => {
            if (particleContainer.parentNode) {
                particleContainer.parentNode.removeChild(particleContainer);
            }
        }, settings.lifetime * 1000);
    }
    
    // Return API
    return {
        emit: (count = 10) => {
            for (let i = 0; i < count; i++) {
                setTimeout(createParticle, Math.random() * 500);
            }
        },
        destroy: () => {
            if (particleContainer.parentNode) {
                particleContainer.parentNode.removeChild(particleContainer);
            }
        }
    };
}

// Export utilities for global access
window.MNOUtils = {
    debounce,
    isMobile,
    supportsHover,
    forceVisibility,
    createTypewriterEffect,
    splitText,
    colorToRGBA,
    detectBrowserCapabilities,
    glitchText,
    createParticles
};