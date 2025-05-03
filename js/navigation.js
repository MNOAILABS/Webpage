/**
 * Navigation Initialization for MNO AI LABS
 * Featuring modern animations and interactions
 */

function initNavigation() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Enhanced sticky header effect with GSAP
    if (window.ScrollTrigger && header) {
        ScrollTrigger.create({
            start: 'top-=50',
            onEnter: () => gsap.to(header, { 
                backgroundColor: 'rgba(5, 5, 5, 0.85)', 
                backdropFilter: 'blur(10px)', 
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                padding: '0.8rem 0',
                duration: 0.3
            }),
            onLeaveBack: () => gsap.to(header, { 
                backgroundColor: 'transparent', 
                backdropFilter: 'blur(0px)', 
                boxShadow: 'none',
                padding: '1.6rem 0',
                duration: 0.3
            })
        });
    }
    
    // Logo animation
    const logo = document.querySelector('.logo-img');
    if (logo) {
        // Add hover effect
        logo.addEventListener('mouseenter', () => {
            gsap.to(logo, {
                scale: 1.1,
                rotation: 5,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
        
        logo.addEventListener('mouseleave', () => {
            gsap.to(logo, {
                scale: 1,
                rotation: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }
    
    // Mobile menu toggle with GSAP animation
    if (menuToggle && hamburger && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            
            if (!mobileMenu.classList.contains('active')) {
                // Opening animation
                gsap.set(mobileMenu, { display: 'flex' });
                
                // Animate background first
                gsap.fromTo(mobileMenu, 
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: "power2.out" }
                );
                
                // Then animate the menu items with stagger
                gsap.fromTo('.mobile-nav-item', 
                    { opacity: 0, y: -30, rotation: -5 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        rotation: 0,
                        stagger: 0.07, 
                        duration: 0.5,
                        ease: "back.out(1.7)" 
                    }
                );
                
                document.body.classList.add('menu-open');
                mobileMenu.classList.add('active');
            } else {
                // Closing animation - reverse stagger
                gsap.to('.mobile-nav-item', { 
                    opacity: 0, 
                    y: -20,
                    stagger: 0.05,
                    duration: 0.3,
                    ease: "power2.in"
                });
                
                gsap.to(mobileMenu, { 
                    opacity: 0, 
                    duration: 0.3, 
                    delay: 0.2,
                    ease: "power2.in",
                    onComplete: () => {
                        mobileMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        gsap.set(mobileMenu, { display: 'none' });
                    }
                });
            }
        });
    }
    
    // Nav links hover effects with floating particles
    navLinks.forEach(link => {
        // Create particle container for each link
        const particleContainer = document.createElement('div');
        particleContainer.classList.add('nav-particles');
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            opacity: 0;
        `;
        link.appendChild(particleContainer);
        
        // Create particles
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.classList.add('nav-particle');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background-color: var(--color-primary);
                opacity: 0;
                pointer-events: none;
            `;
            particleContainer.appendChild(particle);
        }
        
        // Mouse enter animation
        link.addEventListener('mouseenter', () => {
            // Show particle container
            gsap.to(particleContainer, { opacity: 1, duration: 0.2 });
            
            // Animate each particle
            particleContainer.querySelectorAll('.nav-particle').forEach((particle, i) => {
                gsap.set(particle, {
                    x: '50%',
                    y: '100%',
                    scale: 0,
                    opacity: 0
                });
                
                gsap.to(particle, {
                    x: `${(Math.random() - 0.5) * 50 + 50}%`,
                    y: `${Math.random() * 50}%`,
                    scale: Math.random() * 1 + 0.5,
                    opacity: Math.random() * 0.7 + 0.3,
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: "power3.out"
                });
            });
        });
        
        // Mouse leave animation
        link.addEventListener('mouseleave', () => {
            gsap.to(particleContainer, { opacity: 0, duration: 0.3 });
        });
    });
    
    // Enhanced smooth scroll with GSAP
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 80;
                
                // Update active link
                navLinks.forEach(nav => {
                    nav.classList.remove('active');
                    gsap.to(nav.querySelector('.nav-underline'), {
                        scaleX: 0,
                        duration: 0.3,
                        ease: "power2.in"
                    });
                });
                
                this.classList.add('active');
                gsap.to(this.querySelector('.nav-underline'), {
                    scaleX: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Create a "trail" effect when clicking
                const trail = document.createElement('div');
                trail.classList.add('click-trail');
                trail.style.cssText = `
                    position: fixed;
                    top: ${e.clientY}px;
                    left: ${e.clientX}px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: var(--color-primary);
                    pointer-events: none;
                    z-index: 9999;
                    opacity: 0.8;
                `;
                document.body.appendChild(trail);
                
                // Animate the trail
                gsap.to(trail, {
                    width: 50,
                    height: 50,
                    x: -25,
                    y: -25,
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        trail.remove();
                    }
                });
                
                // Smooth scroll with bounce effect
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { 
                        y: targetElement, 
                        offsetY: headerHeight 
                    },
                    ease: "power3.out"
                });
            }
        });
    });
    
    // Mobile navigation click handling
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu
                hamburger.classList.remove('active');
                
                gsap.to(mobileMenu, { 
                    opacity: 0, 
                    y: '-100%', 
                    duration: 0.5, 
                    ease: "power3.in",
                    onComplete: () => {
                        mobileMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        gsap.set(mobileMenu, { display: 'none' });
                        
                        // Scroll to section after menu closes
                        const headerHeight = 80;
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: { 
                                y: targetElement, 
                                offsetY: headerHeight 
                            },
                            ease: "power3.inOut"
                        });
                    }
                });
            }
        });
    });
    
    // Update active nav link on scroll
    if (window.ScrollTrigger) {
        ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
                const scroll = self.scroll();
                
                // Find current section
                const sections = document.querySelectorAll('section[id]');
                let currentSection = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 100;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scroll >= sectionTop && scroll < sectionTop + sectionHeight) {
                        currentSection = '#' + section.getAttribute('id');
                    }
                });
                
                // Update navigation
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    
                    if (href === currentSection) {
                        // Activate this link
                        link.classList.add('active');
                        gsap.to(link.querySelector('.nav-underline'), {
                            scaleX: 1,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    } else {
                        // Deactivate this link
                        link.classList.remove('active');
                        gsap.to(link.querySelector('.nav-underline'), {
                            scaleX: 0,
                            duration: 0.3,
                            ease: "power2.in"
                        });
                    }
                });
            }
        });
    }
}