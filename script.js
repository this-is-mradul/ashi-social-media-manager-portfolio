/* ===================================
   Ashi Trivedi Portfolio - Animations
   Using vanilla JS Intersection Observer for reliable visibility
   GSAP for entrance animations only
   =================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initScrollAnimations();
    initNavigation();
    initSmoothScroll();
    initHoverEffects();
});

/* ===================================
   HERO ANIMATIONS (GSAP on load)
   =================================== */
function initHeroAnimations() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Hero section animations
    gsap.from('.hero-label', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.2
    });

    gsap.from('.hero-tagline', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4
    });

    gsap.from('.hero-description', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.6
    });

    gsap.from('.hero-image', {
        opacity: 0,
        scale: 0.95,
        duration: 1,
        delay: 0.3
    });

    gsap.from('.hero-name h1', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.8
    });

    gsap.from('.scroll-indicator', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 1.2
    });
}

/* ===================================
   SCROLL ANIMATIONS (Intersection Observer)
   More reliable than GSAP ScrollTrigger for visibility
   =================================== */
function initScrollAnimations() {
    // CSS class to add when element is visible
    const animateClass = 'animate-in';

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-target {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-target.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .animate-target.animate-in-scale {
            opacity: 1;
            transform: scale(1);
        }
        .animate-scale {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .animate-scale.animate-in {
            opacity: 1;
            transform: scale(1);
        }
        /* Stagger delays */
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }
        .stagger-5 { transition-delay: 0.5s; }
        .stagger-6 { transition-delay: 0.6s; }
    `;
    document.head.appendChild(style);

    // Elements to animate
    const animateElements = [
        // Stats
        ...document.querySelectorAll('.stat-item'),
        // Portfolio
        document.querySelector('.portfolio .section-header'),
        ...document.querySelectorAll('.project-card'),
        // About
        document.querySelector('.about .section-header'),
        document.querySelector('.about-text'),
        ...document.querySelectorAll('.highlight-card'),
        // Skills
        document.querySelector('.skills .section-header'),
        ...document.querySelectorAll('.skills-category'),
        // Experience
        document.querySelector('.experience .section-header'),
        ...document.querySelectorAll('.timeline-item'),
        // Clients
        document.querySelector('.clients .section-header'),
        ...document.querySelectorAll('.client-item'),
        // Contact
        document.querySelector('.contact .section-label'),
        document.querySelector('.contact-title'),
        ...document.querySelectorAll('.contact-link')
    ].filter(Boolean);

    // Add animate-target class and stagger delays
    animateElements.forEach((el, index) => {
        el.classList.add('animate-target');

        // Add stagger for grouped elements
        if (el.classList.contains('stat-item') ||
            el.classList.contains('project-card') ||
            el.classList.contains('highlight-card') ||
            el.classList.contains('skills-category') ||
            el.classList.contains('timeline-item') ||
            el.classList.contains('client-item') ||
            el.classList.contains('contact-link')) {
            const siblings = el.parentElement?.querySelectorAll('.' + el.classList[0]);
            if (siblings) {
                const siblingIndex = Array.from(siblings).indexOf(el);
                if (siblingIndex <= 5) {
                    el.classList.add(`stagger-${siblingIndex + 1}`);
                }
            }
        }
    });

    // Use smaller scale for client items
    document.querySelectorAll('.client-item').forEach(el => {
        el.classList.remove('animate-target');
        el.classList.add('animate-scale');
    });

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animateClass);
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements
    animateElements.forEach(el => observer.observe(el));
    document.querySelectorAll('.client-item').forEach(el => observer.observe(el));
}

/* ===================================
   NAVIGATION
   =================================== */
let navLinks, sections;

// Make updateActiveNav globally accessible
function updateActiveNav() {
    const scrollPos = window.scrollY + 100; // Offset for better detection
    let activeNav = '';

    // Get section positions
    const aboutSection = document.getElementById('about');
    const skillsSection = document.getElementById('skills');
    const contentStrategySection = document.getElementById('content-strategy');
    const experienceSection = document.getElementById('experience');
    const clientsSection = document.getElementById('clients');
    const contactSection = document.getElementById('contact');

    // Determine active nav based on scroll position
    if (scrollPos < (skillsSection?.offsetTop || 0)) {
        // Top of page to before Skills section - About is active
        activeNav = 'about';
    } else if (scrollPos >= (skillsSection?.offsetTop || 0) && scrollPos < (contentStrategySection?.offsetTop || 0)) {
        // Skills section - Skills is active
        activeNav = 'skills';
    } else if (scrollPos >= (contentStrategySection?.offsetTop || 0) && scrollPos < (clientsSection?.offsetTop || 0)) {
        // Content Strategy and Experience sections - Work is active
        activeNav = 'content-strategy';
    } else if (scrollPos >= (clientsSection?.offsetTop || 0) && scrollPos < (contactSection?.offsetTop || 0)) {
        // Clients section - Clients is active
        activeNav = 'clients';
    } else if (scrollPos >= (contactSection?.offsetTop || 0)) {
        // Contact section - Contact is active
        activeNav = 'contact';
    }

    // Set the active nav link – only one link is active at a time
    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1); // Remove # prefix
        link.classList.toggle('active', href === activeNav);
    });
}

function initNavigation() {
    navLinks = document.querySelectorAll('.nav-link');
    sections = document.querySelectorAll('section[id]');

    // Initial update
    updateActiveNav();
    
    // Update on scroll using requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ===================================
   SMOOTH SCROLL
   =================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                if (link.classList.contains('nav-link')) {
                    navLinks.forEach(nl => nl.classList.remove('active'));
                    link.classList.add('active');
                }
                
                const offsetTop = targetSection.offsetTop - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll indicator click
    document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
        const statsSection = document.getElementById('stats');
        if (statsSection) {
            statsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

/* ===================================
   HOVER EFFECTS
   =================================== */
function initHoverEffects() {
    // Project card hover with GSAP if available
    if (typeof gsap !== 'undefined') {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
}
