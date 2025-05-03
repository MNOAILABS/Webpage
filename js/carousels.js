/**
 * Enhanced Carousel Implementations for MNO AI LABS
 * Fixes carousel issues and improves animations
 */

/**
 * Initialize the Achievements Carousel with improved transitions
 */
function initAchievementsCarousel() {
    const items = document.querySelectorAll('.achievement-item');
    const dots = document.querySelectorAll('.achievements-dot');
    const prevBtn = document.querySelector('.achievements-prev');
    const nextBtn = document.querySelector('.achievements-next');
    
    if (!items.length) return;
    
    // Set up variables
    let currentIndex = 0;
    const itemCount = items.length;
    
    // Show only the active item
    items.forEach((item, index) => {
        if (index !== 0) {
            item.classList.remove('active');
            gsap.set(item, { 
                opacity: 0,
                visibility: 'hidden',
                x: 50,
                scale: 0.9
            });
        } else {
            gsap.set(item, { 
                opacity: 1,
                visibility: 'visible',
                x: 0,
                scale: 1
            });
        }
    });
    
    // Function to update carousel with improved animations
    function updateAchievementCarousel(newIndex) {
        // Handle index bounds
        if (newIndex < 0) newIndex = itemCount - 1;
        if (newIndex >= itemCount) newIndex = 0;
        
        // If the same index, do nothing
        if (newIndex === currentIndex) return;
        
        // Get current and next items
        const currentItem = items[currentIndex];
        const nextItem = items[newIndex];
        
        // Determine animation direction
        const isForward = (newIndex > currentIndex) || (currentIndex === itemCount - 1 && newIndex === 0);
        
        // Create smoother transition with GSAP timeline
        const timeline = gsap.timeline({
            defaults: {
                ease: "power3.inOut",
                duration: 0.6
            }
        });
        
        // Animate out current item
        timeline.to(currentItem, {
            x: isForward ? -50 : 50,
            opacity: 0,
            scale: 0.95,
            onComplete: () => {
                currentItem.classList.remove('active');
                gsap.set(currentItem, { visibility: 'hidden' });
            }
        });
        
        // Prepare next item for animation
        gsap.set(nextItem, {
            visibility: 'visible',
            x: isForward ? 50 : -50,
            opacity: 0,
            scale: 0.95
        });
        
        // Animate in next item
        timeline.to(nextItem, {
            x: 0,
            opacity: 1,
            scale: 1,
            onStart: () => {
                nextItem.classList.add('active');
            }
        }, "-=0.4"); // Slight overlap for smoother transition
        
        // Update current index
        currentIndex = newIndex;
        
        // Update dots
        updateAchievementDots();
    }
    
    // Update dots function
    function updateAchievementDots() {
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
                gsap.to(dot, {
                    scale: 1.2,
                    background: 'var(--color-primary)',
                    duration: 0.3
                });
            } else {
                dot.classList.remove('active');
                gsap.to(dot, {
                    scale: 1,
                    background: 'rgba(99, 102, 241, 0.2)',
                    duration: 0.3
                });
            }
        });
    }
    
    // Set consistent styles for arrow buttons (fixing inconsistency issue)
    const arrowButtonStyle = {
        inactiveStyle: {
            backgroundColor: 'rgba(15, 15, 15, 0.5)',
            color: 'var(--color-white)',
            scale: 1,
            boxShadow: 'none'
        },
        hoverStyle: {
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-white)',
            scale: 1.1,
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
        }
    };
    
    // Apply consistent styles to all carousel navigation arrows
    const applyArrowStyles = () => {
        // Get all carousel arrow buttons
        const allArrowButtons = document.querySelectorAll(
            '.carousel-arrow, .achievements-prev, .achievements-next'
        );
        
        // Apply consistent styles to all
        allArrowButtons.forEach(btn => {
            gsap.set(btn, arrowButtonStyle.inactiveStyle);
            
            // Reset any inconsistent styles
            btn.style.backgroundColor = 'rgba(15, 15, 15, 0.5)';
            btn.style.color = 'var(--color-white)';
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
        });
    };
    
    // Add event listeners to controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            updateAchievementCarousel(currentIndex - 1);
            applyArrowStyles(); // Reset styles after click
        });
        
        // Enhanced hover animations with consistent styling
        prevBtn.addEventListener('mouseenter', () => {
            gsap.to(prevBtn, arrowButtonStyle.hoverStyle);
        });
        
        prevBtn.addEventListener('mouseleave', () => {
            gsap.to(prevBtn, arrowButtonStyle.inactiveStyle);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            updateAchievementCarousel(currentIndex + 1);
            applyArrowStyles(); // Reset styles after click
        });
        
        // Enhanced hover animations with consistent styling
        nextBtn.addEventListener('mouseenter', () => {
            gsap.to(nextBtn, arrowButtonStyle.hoverStyle);
        });
        
        nextBtn.addEventListener('mouseleave', () => {
            gsap.to(nextBtn, arrowButtonStyle.inactiveStyle);
        });
    }
    
    // Add click handlers for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateAchievementCarousel(index);
        });
    });
    
    // Add touch swipe support
    const achievementStage = document.querySelector('.achievement-stage');
    if (achievementStage) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        achievementStage.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        achievementStage.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            // Detect swipe direction
            if (touchEndX < touchStartX - 50) {
                // Swipe left - go to next
                updateAchievementCarousel(currentIndex + 1);
            } else if (touchEndX > touchStartX + 50) {
                // Swipe right - go to previous
                updateAchievementCarousel(currentIndex - 1);
            }
        }
    }
    
    // Auto play with pause on hover
    let autoplayInterval = setInterval(() => {
        updateAchievementCarousel(currentIndex + 1);
    }, 5000);
    
    const achievementsSection = document.querySelector('.achievements');
    if (achievementsSection) {
        achievementsSection.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        achievementsSection.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => {
                updateAchievementCarousel(currentIndex + 1);
            }, 5000);
        });
    }
    
    // Apply consistent styles immediately
    applyArrowStyles();
}

/**
 * Initialize Featured Projects Carousel with improved functionality
 */
function initFeaturedCarousel() {
    const track = document.querySelector('.featured-track');
    const items = document.querySelectorAll('.featured-item');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (!track || items.length === 0) return;
    
    // Set track width
    gsap.set(track, { 
        width: `${items.length * 100}%`,
        display: 'flex'
    });
    
    // Determine items per view based on viewport
    const updateItemWidth = () => {
        const viewportWidth = window.innerWidth;
        
        if (viewportWidth > 992) {
            // Desktop: 3 items per view
            gsap.set(items, { width: `${100 / 3}%` });
            return 3;
        } else if (viewportWidth > 768) {
            // Tablet: 2 items per view
            gsap.set(items, { width: `${100 / 2}%` });
            return 2;
        } else {
            // Mobile: 1 item per view
            gsap.set(items, { width: '100%' });
            return 1;
        }
    };
    
    // Get initial items per view
    let itemsPerView = updateItemWidth();
    
    // Current slide index
    let currentIndex = 0;
    
    // Fix for initially not showing items properly
    items.forEach((item, index) => {
        if (index < itemsPerView) {
            item.classList.add('active');
            gsap.set(item, { opacity: 1, scale: 1 });
        } else {
            item.classList.remove('active');
            gsap.set(item, { opacity: 0.7, scale: 0.95 });
        }
    });
    
    // Set consistent styles for arrow buttons (fixing inconsistency issue)
    const arrowButtonStyle = {
        inactiveStyle: {
            backgroundColor: 'rgba(15, 15, 15, 0.5)',
            color: 'var(--color-white)',
            scale: 1,
            boxShadow: 'none'
        },
        hoverStyle: {
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-white)',
            scale: 1.1,
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
        }
    };
    
    // Apply consistent styles to all carousel navigation arrows
    const applyArrowStyles = () => {
        // Get all carousel arrow buttons
        const allArrowButtons = document.querySelectorAll(
            '.carousel-arrow, .achievements-prev, .achievements-next'
        );
        
        // Apply consistent styles to all
        allArrowButtons.forEach(btn => {
            gsap.set(btn, arrowButtonStyle.inactiveStyle);
            
            // Reset any inconsistent styles
            btn.style.backgroundColor = 'rgba(15, 15, 15, 0.5)';
            btn.style.color = 'var(--color-white)';
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
        });
    };
    
    // Function to update carousel with improved animations
    function updateFeaturedCarousel(index, instant = false) {
        // Keep index in bounds
        const maxIndex = items.length - itemsPerView;
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        if (!instant) {
            // Use GSAP for smooth animation
            gsap.to(track, {
                x: `${-currentIndex * (100 / items.length)}%`,
                duration: 0.8,
                ease: "power3.out"
            });
        } else {
            // Instant update without animation
            gsap.set(track, {
                x: `${-currentIndex * (100 / items.length)}%`
            });
        }
        
        // Update active state for all items
        items.forEach((item, i) => {
            if (i >= currentIndex && i < currentIndex + itemsPerView) {
                item.classList.add('active');
                gsap.to(item, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6
                });
            } else {
                item.classList.remove('active');
                gsap.to(item, {
                    opacity: 0.7,
                    scale: 0.95,
                    duration: 0.6
                });
            }
        });
        
        // Update dots
        updateFeaturedDots();
        
        // Reset arrow button styles for consistency
        applyArrowStyles();
    }
    
    // Update dots function
    function updateFeaturedDots() {
        // Calculate which dot should be active based on current position
        const activeDotIndex = Math.floor(currentIndex / itemsPerView);
        
        dots.forEach((dot, i) => {
            if (i === activeDotIndex) {
                dot.classList.add('active');
                gsap.to(dot, {
                    scale: 1.2,
                    background: 'var(--color-primary)',
                    duration: 0.3
                });
            } else {
                dot.classList.remove('active');
                gsap.to(dot, {
                    scale: 1,
                    background: 'rgba(99, 102, 241, 0.2)',
                    duration: 0.3
                });
            }
        });
    }
    
    // Initialize carousel
    updateFeaturedCarousel(0, true);
    
    // Add button event listeners with improved hover effects
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            updateFeaturedCarousel(currentIndex - itemsPerView);
        });
        
        // Improved hover effect with consistent styling
        prevBtn.addEventListener('mouseenter', () => {
            gsap.to(prevBtn, arrowButtonStyle.hoverStyle);
        });
        
        prevBtn.addEventListener('mouseleave', () => {
            gsap.to(prevBtn, arrowButtonStyle.inactiveStyle);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            updateFeaturedCarousel(currentIndex + itemsPerView);
        });
        
        // Improved hover effect with consistent styling
        nextBtn.addEventListener('mouseenter', () => {
            gsap.to(nextBtn, arrowButtonStyle.hoverStyle);
        });
        
        nextBtn.addEventListener('mouseleave', () => {
            gsap.to(nextBtn, arrowButtonStyle.inactiveStyle);
        });
    }
    
    // Add dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            updateFeaturedCarousel(index * itemsPerView);
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Update items per view and width
        const newItemsPerView = updateItemWidth();
        
        // Only update if items per view has changed
        if (newItemsPerView !== itemsPerView) {
            itemsPerView = newItemsPerView;
            
            // Ensure current index is still valid
            if (currentIndex > items.length - itemsPerView) {
                currentIndex = items.length - itemsPerView;
            }
            
            // Update carousel with new dimensions
            updateFeaturedCarousel(currentIndex, true);
        }
    });
    
    // Add swipe support for mobile
    let startX, moveX;
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
        moveX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', () => {
        if (startX && moveX) {
            const diff = startX - moveX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    // Swipe left, go to next
                    updateFeaturedCarousel(currentIndex + itemsPerView);
                } else {
                    // Swipe right, go to previous
                    updateFeaturedCarousel(currentIndex - itemsPerView);
                }
            }
        }
        
        // Reset values
        startX = null;
        moveX = null;
    }, { passive: true });
    
    // Auto-advance carousel with pause on hover
    let autoAdvance = setInterval(() => {
        const nextIndex = currentIndex + itemsPerView;
        if (nextIndex >= items.length) {
            updateFeaturedCarousel(0);
        } else {
            updateFeaturedCarousel(nextIndex);
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
                    updateFeaturedCarousel(0);
                } else {
                    updateFeaturedCarousel(nextIndex);
                }
            }, 6000);
        });
    }
    
    // Apply consistent styles immediately
    applyArrowStyles();
}

/**
 * Initialize Teams Carousel with fixed switching functionality
 * - Added navigation buttons for quick team selection
 */
function initTeamCarousel() {
    const teamSections = document.querySelectorAll('.team-section');
    const teamDots = document.querySelectorAll('.team-dot');
    
    if (!teamSections.length) return;
    
    // Create team quick selection tabs
    createTeamNavTabs();
    
    // Add team navigation buttons (prev/next)
    addTeamNavigationButtons();
    
    // Set consistent styles for arrow buttons (fixing inconsistency issue)
    const arrowButtonStyle = {
        inactiveStyle: {
            backgroundColor: 'rgba(15, 15, 15, 0.5)',
            color: 'var(--color-white)',
            scale: 1,
            boxShadow: 'none'
        },
        hoverStyle: {
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-white)',
            scale: 1.1,
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
        }
    };
    
    // Apply consistent styles to all carousel navigation arrows
    function applyArrowStyles() {
        // Get all carousel arrow buttons
        const allArrowButtons = document.querySelectorAll(
            '.carousel-arrow, .achievements-prev, .achievements-next, .team-prev, .team-next'
        );
        
        // Apply consistent styles to all
        allArrowButtons.forEach(btn => {
            gsap.set(btn, arrowButtonStyle.inactiveStyle);
            
            // Reset any inconsistent styles
            btn.style.backgroundColor = 'rgba(15, 15, 15, 0.5)';
            btn.style.color = 'var(--color-white)';
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
        });
    }
    
    // Fix the wrong variable name in the original code
    function switchTeam(index) {
        const previousIndex = Array.from(teamSections).findIndex(section => 
            section.classList.contains('active')
        );
        
        if (index === previousIndex) return;
        
        const previousSection = teamSections[previousIndex];
        const nextSection = teamSections[index];
        
        if (!previousSection || !nextSection) return;
        
        // Create timeline for seamless transition
        const timeline = gsap.timeline({
            defaults: {
                duration: 0.5,
                ease: "power2.inOut"
            }
        });
        
        // Update team dots
        if (teamDots.length > 0) {
            teamDots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                    gsap.to(dot, {
                        scale: 1.2,
                        backgroundColor: 'var(--color-primary)',
                        duration: 0.3
                    });
                } else {
                    dot.classList.remove('active');
                    gsap.to(dot, {
                        scale: 1,
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        duration: 0.3
                    });
                }
            });
        }
        
        // Update team tabs
        updateTeamTabs(index);
        
        // Get team members from both sections
        const prevMembers = previousSection.querySelectorAll('.team-member');
        const nextMembers = nextSection.querySelectorAll('.team-member');
        
        // Fade out current team members with stagger
        timeline.to(prevMembers, {
            opacity: 0,
            y: -20,
            stagger: 0.05,
            duration: 0.4
        });
        
        // Fade out current section
        timeline.to(previousSection, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                // Hide previous section
                previousSection.classList.remove('active');
                gsap.set(previousSection, {
                    visibility: 'hidden',
                    position: 'absolute'
                });
                
                // Show next section
                nextSection.classList.add('active');
                gsap.set(nextSection, {
                    visibility: 'visible',
                    position: 'relative',
                    opacity: 0
                });
                
                // Reset positions of next members for animation
                gsap.set(nextMembers, {
                    opacity: 0,
                    y: 30
                });
            }
        });
        
        // Fade in next section
        timeline.to(nextSection, {
            opacity: 1,
            duration: 0.4
        });
        
        // Fade in team members with stagger
        timeline.to(nextMembers, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.out(1.4)"
        }, "-=0.2");
        
        // Reset arrow button styles for consistency
        applyArrowStyles();
    }
    
    // Expose switchTeam function globally
    window.switchTeam = switchTeam;
    
    /**
     * Create quick selection tabs for teams
     */
    function createTeamNavTabs() {
        // First check if tabs already exist
        if (document.querySelector('.team-tabs')) return;
        
        // Create tabs container
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'team-tabs';
        tabsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            margin-bottom: 3rem;
            flex-wrap: wrap;
            gap: 1rem;
        `;
        
        // Create a tab for each team
        teamSections.forEach((section, index) => {
            // Get team title
            const teamTitle = section.querySelector('.team-title')?.textContent || `Team ${index + 1}`;
            
            // Create tab
            const tab = document.createElement('button');
            tab.className = `team-tab neo-brutalism ${index === 0 ? 'active' : ''}`;
            tab.setAttribute('data-index', index);
            tab.textContent = teamTitle;
            tab.style.cssText = `
                padding: 0.8rem 1.6rem;
                font-size: 1.4rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                background-color: ${index === 0 ? 'var(--color-primary)' : 'transparent'};
                color: ${index === 0 ? 'var(--color-white)' : 'var(--color-gray-300)'};
            `;
            
            // Add click handler
            tab.addEventListener('click', () => {
                switchTeam(index);
            });
            
            // Add hover effect
            tab.addEventListener('mouseenter', () => {
                if (!tab.classList.contains('active')) {
                    gsap.to(tab, {
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        color: 'var(--color-white)',
                        scale: 1.05,
                        duration: 0.3
                    });
                }
            });
            
            tab.addEventListener('mouseleave', () => {
                if (!tab.classList.contains('active')) {
                    gsap.to(tab, {
                        backgroundColor: 'transparent',
                        color: 'var(--color-gray-300)',
                        scale: 1,
                        duration: 0.3
                    });
                }
            });
            
            tabsContainer.appendChild(tab);
        });
        
        // Add tabs before the team carousel
        const teamCarousel = document.querySelector('.teams-carousel');
        if (teamCarousel && teamCarousel.parentNode) {
            teamCarousel.parentNode.insertBefore(tabsContainer, teamCarousel);
        }
    }
    
    /**
     * Update team tabs to reflect active team
     */
    function updateTeamTabs(activeIndex) {
        const tabs = document.querySelectorAll('.team-tab');
        
        tabs.forEach((tab, index) => {
            if (index === activeIndex) {
                tab.classList.add('active');
                gsap.to(tab, {
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-white)',
                    scale: 1.05,
                    duration: 0.3
                });
            } else {
                tab.classList.remove('active');
                gsap.to(tab, {
                    backgroundColor: 'transparent',
                    color: 'var(--color-gray-300)',
                    scale: 1,
                    duration: 0.3
                });
            }
        });
    }
    
    /**
     * Add navigation buttons (prev/next) to team section
     */
    function addTeamNavigationButtons() {
        // First check if buttons already exist
        if (document.querySelector('.team-prev, .team-next')) return;
        
        // Create navigation container
        const navContainer = document.createElement('div');
        navContainer.className = 'team-navigation';
        navContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 3rem;
        `;
        
        // Create previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'team-prev carousel-arrow neo-brutalism';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.style.cssText = `
            width: 4.2rem;
            height: 4.2rem;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(15, 15, 15, 0.5);
            color: var(--color-white);
            font-size: 1.6rem;
            transition: all 0.3s ease;
            cursor: pointer;
        `;
        
        // Create next button
        const nextButton = document.createElement('button');
        nextButton.className = 'team-next carousel-arrow neo-brutalism';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.style.cssText = `
            width: 4.2rem;
            height: 4.2rem;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(15, 15, 15, 0.5);
            color: var(--color-white);
            font-size: 1.6rem;
            transition: all 0.3s ease;
            cursor: pointer;
        `;
        
        // Add click handlers
        prevButton.addEventListener('click', () => {
            const activeIndex = Array.from(teamSections).findIndex(section => 
                section.classList.contains('active')
            );
            const prevIndex = activeIndex <= 0 ? teamSections.length - 1 : activeIndex - 1;
            switchTeam(prevIndex);
        });
        
        nextButton.addEventListener('click', () => {
            const activeIndex = Array.from(teamSections).findIndex(section => 
                section.classList.contains('active')
            );
            const nextIndex = activeIndex >= teamSections.length - 1 ? 0 : activeIndex + 1;
            switchTeam(nextIndex);
        });
        
        // Add hover animations
        prevButton.addEventListener('mouseenter', () => {
            gsap.to(prevButton, arrowButtonStyle.hoverStyle);
        });
        
        prevButton.addEventListener('mouseleave', () => {
            gsap.to(prevButton, arrowButtonStyle.inactiveStyle);
        });
        
        nextButton.addEventListener('mouseenter', () => {
            gsap.to(nextButton, arrowButtonStyle.hoverStyle);
        });
        
        nextButton.addEventListener('mouseleave', () => {
            gsap.to(nextButton, arrowButtonStyle.inactiveStyle);
        });
        
        // Add buttons to container
        navContainer.appendChild(prevButton);
        navContainer.appendChild(nextButton);
        
        // Add container after team indicator
        const teamIndicator = document.querySelector('.team-indicator');
        if (teamIndicator && teamIndicator.parentNode) {
            teamIndicator.parentNode.insertBefore(navContainer, teamIndicator.nextSibling);
        }
    }
    
    // Set up event listeners for dots
    teamDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            switchTeam(index);
        });
        
        // Enhanced hover effects
        dot.addEventListener('mouseenter', () => {
            if (!dot.classList.contains('active')) {
                gsap.to(dot, {
                    scale: 1.1,
                    backgroundColor: 'rgba(99, 102, 241, 0.4)',
                    boxShadow: '0 0 8px rgba(99, 102, 241, 0.4)',
                    duration: 0.3
                });
            }
        });
        
        dot.addEventListener('mouseleave', () => {
            if (!dot.classList.contains('active')) {
                gsap.to(dot, {
                    scale: 1,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    boxShadow: 'none',
                    duration: 0.3
                });
            }
        });
    });
    
    // Set up automatic switching
    let teamInterval = setInterval(() => {
        const activeIndex = Array.from(teamSections).findIndex(section => 
            section.classList.contains('active')
        );
        const nextIndex = (activeIndex + 1) % teamSections.length;
        switchTeam(nextIndex);
    }, 7000);
    
    // Pause auto-switching on hover
    const teamsCarousel = document.querySelector('.teams-carousel');
    if (teamsCarousel) {
        teamsCarousel.addEventListener('mouseenter', () => {
            clearInterval(teamInterval);
        });
        
        teamsCarousel.addEventListener('mouseleave', () => {
            teamInterval = setInterval(() => {
                const activeIndex = Array.from(teamSections).findIndex(section => 
                    section.classList.contains('active')
                );
                const nextIndex = (activeIndex + 1) % teamSections.length;
                switchTeam(nextIndex);
            }, 7000);
        });
    }
    
    // Apply consistent styles immediately
    applyArrowStyles();
}

/**
 * Initialize project filters with improved hover effects
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (!filterButtons.length || !projectItems.length) return;
    
    // Fix initial animation of projects
    gsap.set(projectItems, { opacity: 1, y: 0 }); // Ensure visible first
    
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
                
                // Custom hover timeline
                const hoverTl = gsap.timeline({ paused: true });
                hoverTl.to(overlay, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3
                })
                .to(item, {
                    y: -10,
                    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
                    duration: 0.4
                }, 0);
                
                // Attach events
                item.addEventListener('mouseenter', () => hoverTl.play());
                item.addEventListener('mouseleave', () => hoverTl.reverse());
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
            
            // First ensure all items are visible
            projectItems.forEach(item => {
                gsap.set(item, { display: 'block', opacity: 1 });
            });
            
            // First, animate current items
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
                case 'healthcare':
                    particleColor = 'rgba(236, 72, 153, 0.7)'; // Pink
                    break;
                case 'finance':
                    particleColor = 'rgba(59, 130, 246, 0.7)'; // Blue
                    break;
                case 'cities':
                    particleColor = 'rgba(16, 185, 129, 0.7)'; // Green
                    break;
                case 'education':
                    particleColor = 'rgba(245, 158, 11, 0.7)'; // Amber
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
}

/**
 * Enhanced Featured Projects Carousel
 * Place this in your main.js or carousels.js file
 */
function initFeaturedCarousel() {
    const track = document.querySelector('.featured-track');
    const items = document.querySelectorAll('.featured-item');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (!track || items.length === 0) return;
    
    // Current slide index
    let currentIndex = 0;
    let itemsPerView = 1; // Default for mobile
    
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
    
    // Add swipe support for mobile
    let startX, moveX;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
      moveX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', () => {
      if (startX && moveX) {
        const diff = startX - moveX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
          if (diff > 0) {
            // Swipe left, go to next
            updateCarousel(currentIndex + itemsPerView);
          } else {
            // Swipe right, go to previous
            updateCarousel(currentIndex - itemsPerView);
          }
        }
      }
      
      // Reset values
      startX = null;
      moveX = null;
    }, { passive: true });
  }
  
  // Call the function when the DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initFeaturedCarousel, 500);
  });