/**
 * Contact Form Interactions for MNO AI LABS
 * Enhanced with modern animations and effects
 * Updated with FormSubmit.co integration for GitHub Pages
 */

function initContactForm() {
    const form = document.querySelector('#contactForm');
    if (!form) return;
    
    // Animate form fields on focus
    const formInputs = form.querySelectorAll('.form-input, .form-textarea');
    
    formInputs.forEach(input => {
        // Initial state
        const inputLabel = input.previousElementSibling;
        
        // Focus event with enhanced animation
        input.addEventListener('focus', () => {
            gsap.to(inputLabel, {
                y: -5,
                opacity: 1,
                color: '#6366f1',
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(input, {
                borderColor: '#6366f1',
                boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Add particle effect
            createInputParticles(input);
            
            // Add ripple effect
            createInputRipple(input, event);
        });
        
        // Blur event
        input.addEventListener('blur', () => {
            gsap.to(inputLabel, {
                y: 0,
                opacity: 0.8,
                color: '#9ca3af',
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(input, {
                borderColor: input.value ? '#4b5563' : '#1f2937',
                boxShadow: 'none',
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        // Keydown animation
        input.addEventListener('keydown', (e) => {
            // Create typing particles on keydown
            if (e.key.length === 1) {
                createTypingParticle(input, e.key);
            }
        });
    });
    
    // Create particle effect for input fields
    function createInputParticles(input) {
        // Check if particles already exist
        const existingParticles = input.parentElement.querySelector('.input-particles');
        if (existingParticles) return;
        
        // Create particle container
        const particleContainer = document.createElement('div');
        particleContainer.className = 'input-particles';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        `;
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(particleContainer);
        
        // Create particles
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: var(--color-primary-light);
                top: 50%;
                right: 10px;
                opacity: 0;
            `;
            particleContainer.appendChild(particle);
            
            // Animate particle
            gsap.to(particle, {
                x: Math.random() * 50 - 25,
                y: Math.random() * 60 - 30,
                scale: Math.random() * 1 + 0.5,
                opacity: Math.random() * 0.6,
                duration: 0.6 + Math.random() * 0.8,
                onComplete: () => {
                    gsap.to(particle, {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            particle.remove();
                        }
                    });
                }
            });
        }
        
        // Remove container after animation
        setTimeout(() => {
            gsap.to(particleContainer, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    particleContainer.remove();
                }
            });
        }, 1500);
    }
    
    // Create ripple effect for input focus
    function createInputRipple(input, event) {
        // Create ripple element
        const ripple = document.createElement('div');
        ripple.className = 'input-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 10px;
            height: 10px;
            background-color: rgba(99, 102, 241, 0.2);
            border-radius: 50%;
            transform: scale(0);
            pointer-events: none;
        `;
        
        // Position at input start
        ripple.style.top = '50%';
        ripple.style.left = '10px';
        
        // Add to input container
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(ripple);
        
        // Animate ripple
        gsap.to(ripple, {
            scale: 10,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                ripple.remove();
            }
        });
    }
    
    // Create typing particle effect
    function createTypingParticle(input, key) {
        // Create particle for character
        const particle = document.createElement('div');
        particle.className = 'typing-particle';
        particle.textContent = key;
        particle.style.cssText = `
            position: absolute;
            font-size: 1.6rem;
            color: var(--color-primary);
            pointer-events: none;
            opacity: 0;
            font-weight: 600;
        `;
        
        // Position at cursor approximate position
        const inputRect = input.getBoundingClientRect();
        // Rough estimate for cursor position
        const cursorX = input.value.length * 10 + 20;
        
        particle.style.top = '50%';
        particle.style.left = `${cursorX}px`;
        particle.style.transform = 'translate(-50%, -50%)';
        
        // Add to input container
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(particle);
        
        // Animate particle
        gsap.to(particle, {
            y: -20,
            opacity: 0.8,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(particle, {
                    y: -40,
                    x: Math.random() * 40 - 20,
                    opacity: 0,
                    duration: 0.4,
                    delay: 0.1,
                    onComplete: () => {
                        particle.remove();
                    }
                });
            }
        });
    }
    
    // Enhanced form submission with FormSubmit API for GitHub Pages
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form fields
        const isValid = validateForm(form);
        
        if (isValid) {
            // Animate button
            const submitBtn = form.querySelector('button[type="submit"]');
            
            // Ripple effect
            const btnRect = submitBtn.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: ${e.clientY - btnRect.top}px;
                left: ${e.clientX - btnRect.left}px;
                width: 5px;
                height: 5px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 50%;
                transform: scale(1);
                opacity: 1;
                z-index: 10;
            `;
            submitBtn.style.position = 'relative';
            submitBtn.style.overflow = 'hidden';
            submitBtn.appendChild(ripple);
            
            gsap.to(ripple, {
                scale: 25,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => {
                    ripple.remove();
                }
            });
            
            // Button click animation
            gsap.to(submitBtn, {
                scale: 0.95,
                duration: 0.1,
                ease: "power1.in",
                onComplete: () => {
                    gsap.to(submitBtn, {
                        scale: 1,
                        duration: 0.3,
                        ease: "elastic.out(1, 0.5)"
                    });
                    
                    // Submit the form using fetch API
                    const formData = new FormData(form);
                    
                    // Add FormSubmit specific fields
                    formData.append('_subject', 'New contact from MNO AI Labs website');
                    
                    // Submit to FormSubmit's AJAX endpoint
                    fetch('https://formsubmit.co/ajax/mnoailabs@gmail.com', {
                        method: 'POST',
                        headers: { 
                            'Accept': 'application/json'
                        },
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        if (data.success === 'true' || data.success === true) {
                            // Show success message with enhanced animation
                            showFormSuccess(form);
                            // Reset form
                            form.reset();
                        } else {
                            // Show error message
                            showFormError(form, 'The form submission was unsuccessful. Please try again.');
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        // Show error message
                        showFormError(form, 'An error occurred while submitting the form. Please try again later or contact us directly at mnoailabs@gmail.com');
                    });
                }
            });
        }
    });
    
    // Form validation
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            const errorMessage = input.parentElement.querySelector('.error-message');
            
            // Remove existing error message
            if (errorMessage) {
                errorMessage.remove();
            }
            
            // Check if input is empty
            if (!input.value.trim()) {
                isValid = false;
                
                // Create error message
                const error = document.createElement('div');
                error.className = 'error-message';
                error.textContent = `${input.placeholder || 'This field'} is required`;
                error.style.cssText = `
                    color: #ef4444;
                    font-size: 1.2rem;
                    margin-top: 0.5rem;
                    opacity: 0;
                    transform: translateY(-5px);
                `;
                
                // Add error to DOM
                input.parentElement.appendChild(error);
                
                // Animate error appearance
                gsap.to(error, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Highlight input
                gsap.to(input, {
                    borderColor: '#ef4444',
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Shake animation for invalid field
                gsap.to(input, {
                    x: 10,
                    duration: 0.1,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 3
                });
            }
            
            // Handle email validation
            if (input.type === 'email' && input.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value)) {
                    isValid = false;
                    
                    // Create error message
                    const error = document.createElement('div');
                    error.className = 'error-message';
                    error.textContent = 'Please enter a valid email address';
                    error.style.cssText = `
                        color: #ef4444;
                        font-size: 1.2rem;
                        margin-top: 0.5rem;
                        opacity: 0;
                        transform: translateY(-5px);
                    `;
                    
                    // Add error to DOM
                    input.parentElement.appendChild(error);
                    
                    // Animate error appearance
                    gsap.to(error, {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    
                    // Highlight input
                    gsap.to(input, {
                        borderColor: '#ef4444',
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    
                    // Shake animation for invalid field
                    gsap.to(input, {
                        x: 10,
                        duration: 0.1,
                        ease: "power2.out",
                        yoyo: true,
                        repeat: 3
                    });
                }
            }
        });
        
        return isValid;
    }
    
    // Add error message function
    function showFormError(form, errorText) {
        // Create error message container
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-error';
        errorMessage.innerHTML = `
            <div class="error-icon">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <h3>Submission Failed</h3>
            <p>${errorText}</p>
        `;
        
        // Style the message
        errorMessage.style.cssText = `
            position: absolute;
            inset: 0;
            background-color: rgba(15, 15, 15, 0.9);
            backdrop-filter: blur(10px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            border-radius: 8px;
            padding: 2rem;
            opacity: 0;
            z-index: 10;
        `;
        
        // Style the icon
        const iconStyle = document.createElement('style');
        iconStyle.textContent = `
            .form-error .error-icon {
                width: 6rem;
                height: 6rem;
                background: linear-gradient(135deg, #ef4444, #f87171);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 2rem;
                color: white;
                font-size: 2.5rem;
                transform: scale(0);
            }
            
            .form-error h3 {
                font-size: 2.4rem;
                margin-bottom: 1rem;
                color: #ef4444;
                opacity: 0;
                transform: translateY(20px);
            }
            
            .form-error p {
                font-size: 1.6rem;
                opacity: 0;
                transform: translateY(20px);
                color: #f87171;
            }
        `;
        document.head.appendChild(iconStyle);
        
        // Add to form
        form.style.position = 'relative';
        form.appendChild(errorMessage);
        
        // Create animation timeline
        const timeline = gsap.timeline();
        
        // Fade in the message
        timeline.fromTo(errorMessage, 
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
        );
        
        // Animate icon
        timeline.to('.form-error .error-icon', {
            scale: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)"
        });
        
        // Animate the text with stagger
        timeline.to('.form-error h3', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        }, "-=0.4");
        
        timeline.to('.form-error p', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.4)"
        }, "-=0.3");
        
        // Auto-remove after delay
        timeline.to({}, {
            duration: 4,
            onComplete: () => {
                // Remove error message
                gsap.to(errorMessage, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => errorMessage.remove()
                });
            }
        });
    }
}

/**
 * Show enhanced form submission success message
 */
function showFormSuccess(form) {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div class="success-icon">
            <i class="fas fa-check"></i>
        </div>
        <h3>Message Sent!</h3>
        <p>We'll get back to you as soon as possible.</p>
    `;
    
    // Style the message
    successMessage.style.cssText = `
        position: absolute;
        inset: 0;
        background-color: rgba(15, 15, 15, 0.9);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-radius: 8px;
        padding: 2rem;
        opacity: 0;
        z-index: 10;
    `;
    
    // Style the icon
    const iconStyle = document.createElement('style');
    iconStyle.textContent = `
        .form-success .success-icon {
            width: 6rem;
            height: 6rem;
            background: linear-gradient(135deg, #6366f1, #10b981);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
            color: white;
            font-size: 2.5rem;
            transform: scale(0);
        }
        
        .form-success h3 {
            font-size: 2.4rem;
            margin-bottom: 1rem;
            opacity: 0;
            transform: translateY(20px);
        }
        
        .form-success p {
            font-size: 1.6rem;
            opacity: 0;
            transform: translateY(20px);
        }
    `;
    document.head.appendChild(iconStyle);
    
    // Add to form
    form.style.position = 'relative';
    form.appendChild(successMessage);
    
    // Create animation timeline
    const timeline = gsap.timeline();
    
    // Fade in the message with a reveal effect
    timeline.fromTo(successMessage, 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
    );
    
    // Add particles around the success icon
    const particleCount = 12;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #10b981);
            opacity: 0;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: -1;
        `;
        successMessage.appendChild(particle);
        particles.push(particle);
    }
    
    // Animate the icon with particles
    timeline.to('.form-success .success-icon', {
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)",
        onStart: () => {
            // Animate particles outward
            particles.forEach((particle, i) => {
                const angle = (i / particleCount) * Math.PI * 2;
                const radius = 100;
                
                gsap.to(particle, {
                    x: Math.cos(angle) * radius + '%',
                    y: Math.sin(angle) * radius + '%',
                    opacity: 0.7,
                    duration: 0.8,
                    delay: 0.2,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(particle, {
                            opacity: 0,
                            duration: 0.5
                        });
                    }
                });
            });
        }
    });
    
    // Animate the text with stagger
    timeline.to('.form-success h3', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
    }, "-=0.4");
    
    timeline.to('.form-success p', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.4)"
    }, "-=0.3");
    
    // Add typing effect to success message
    const typingEffect = document.createElement('div');
    typingEffect.className = 'typing-effect';
    typingEffect.style.cssText = `
        position: absolute;
        top: 85%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 5px;
        opacity: 0;
    `;
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: var(--color-primary);
        `;
        typingEffect.appendChild(dot);
    }
    
    successMessage.appendChild(typingEffect);
    
    // Animate typing effect
    timeline.to(typingEffect, {
        opacity: 1,
        duration: 0.3,
        delay: 0.5
    }).to(typingEffect.children, {
        y: -10,
        stagger: 0.1,
        repeat: 5,
        yoyo: true,
        duration: 0.3,
        ease: "power2.inOut"
    }).to(typingEffect, {
        opacity: 0,
        duration: 0.3
    });
    
    // Reset the form after delay
    timeline.to({}, {
        duration: 3,
        onComplete: () => {
            // Remove success message
            gsap.to(successMessage, {
                opacity: 0,
                scale: 0.9,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    successMessage.remove();
                    
                    // Reset input styles
                    const formInputs = form.querySelectorAll('.form-input, .form-textarea');
                    formInputs.forEach(input => {
                        gsap.set(input, {
                            borderColor: '#1f2937',
                            boxShadow: 'none'
                        });
                    });
                }
            });
        }
    });
}