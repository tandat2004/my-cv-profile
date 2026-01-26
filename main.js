/**
 * ============================================
 * JOSH COMEAU INSPIRED INTERACTIONS
 * Whimsical, Spring-based, Delightful ✨
 * ============================================
 */

// --- CONFIGURATION ---
const CONFIG = {
    spring: {
        tension: 0.18,
        friction: 0.75,
    },
    particles: {
        count: 8,
        colors: ['#ff5c87', '#a855f7', '#06b6d4', '#fbbf24'],
    },
};

// --- UTILITY FUNCTIONS ---
const lerp = (start, end, factor) => start + (end - start) * factor;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const random = (min, max) => Math.random() * (max - min) + min;

// --- 1. HEADER SCROLL EFFECT ---
const header = document.querySelector('.header');
let lastScrollY = 0;
let ticking = false;

const updateHeader = () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
};

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
});

// --- 2. MOBILE MENU TOGGLE ---
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const menuIcon = menuBtn?.querySelector('i');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');

        // Animate icon
        if (menuIcon) {
            menuIcon.className = isOpen ? 'ph ph-x' : 'ph ph-list';
        }

        // Add bounce animation to menu items
        if (isOpen) {
            const items = navLinks.querySelectorAll('li');
            items.forEach((item, index) => {
                item.style.animation = `slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.05}s forwards`;
            });
        }
    });
}

// --- 3. SMOOTH SCROLL REVEAL ANIMATION ---
const createRevealObserver = () => {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
    };

    const revealCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered delay for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.classList.remove('hidden');
                }, index * 100);

                observer.unobserve(entry.target);
            }
        });
    };

    return new IntersectionObserver(revealCallback, observerOptions);
};

// Apply to sections
const revealObserver = createRevealObserver();
document.querySelectorAll('section').forEach((section) => {
    section.classList.add('hidden');
    revealObserver.observe(section);
});

// Apply to individual elements for stagger effect
const staggerObserver = createRevealObserver();
document.querySelectorAll('.about-card, .blog-card, .timeline-item, .skill-item').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
    el.classList.add('hidden');
    staggerObserver.observe(el);
});

// --- 4. ENHANCED CURSOR GLOW EFFECT ---
const cursorGlow = document.querySelector('.cursor-glow');
let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;

if (cursorGlow) {
    const updateGlow = () => {
        // Smooth interpolation for fluid movement
        glowX = lerp(glowX, mouseX, 0.1);
        glowY = lerp(glowY, mouseY, 0.1);

        const isLight = document.documentElement.classList.contains('light-mode');
        const color1 = isLight ? 'hsla(187, 100%, 45%, 0.05)' : 'hsla(333, 100%, 52%, 0.08)';
        const color2 = isLight ? 'hsla(45, 100%, 55%, 0.02)' : 'hsla(255, 85%, 65%, 0.04)';

        cursorGlow.style.background = `radial-gradient(800px at ${glowX}px ${glowY}px, 
            ${color1}, 
            ${color2} 40%, 
            transparent 70%)`;

        requestAnimationFrame(updateGlow);
    };

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    updateGlow();
}

// --- 5. MAGNETIC BUTTONS EFFECT ---
const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

magneticButtons.forEach((btn) => {
    let btnX = 0;
    let btnY = 0;

    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.2;
        const deltaY = (e.clientY - centerY) * 0.2;

        btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// --- 6. SHURIKEN CURSOR WITH SPRING PHYSICS ---
const shuriken = document.getElementById('shuriken-cursor');
let shurikenX = 0;
let shurikenY = 0;
let velocityX = 0;
let velocityY = 0;
let targetX = 0;
let targetY = 0;

if (shuriken) {
    const updateShuriken = () => {
        // Spring physics
        const dx = targetX - shurikenX;
        const dy = targetY - shurikenY;

        velocityX += dx * CONFIG.spring.tension;
        velocityY += dy * CONFIG.spring.tension;

        velocityX *= CONFIG.spring.friction;
        velocityY *= CONFIG.spring.friction;

        shurikenX += velocityX;
        shurikenY += velocityY;

        // Calculate rotation based on velocity
        const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        const rotation = speed * 20;

        shuriken.style.left = `${shurikenX}px`;
        shuriken.style.top = `${shurikenY}px`;
        shuriken.style.animationDuration = speed > 1 ? '0.3s' : '1.5s';

        requestAnimationFrame(updateShuriken);
    };

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;

        // Create trail particles when moving fast
        const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        if (speed > 3) {
            createTrailParticle(e.clientX, e.clientY);
        }
    });

    updateShuriken();
}

// --- 7. TRAIL PARTICLES ---
function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'ninja-trail';
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, hsl(333, 100%, 52%), hsl(255, 85%, 65%));
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
    `;

    document.body.appendChild(particle);

    particle.animate([
        { opacity: 0.8, transform: 'scale(1) translate(-50%, -50%)' },
        { opacity: 0, transform: 'scale(0) translate(-50%, -50%)' }
    ], {
        duration: 400,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }).onfinish = () => particle.remove();
}

// --- 8. CLICK SPARKLE EFFECT ---
document.addEventListener('click', (e) => {
    createSparkles(e.clientX, e.clientY);

    // Scale down shuriken on click
    if (shuriken) {
        shuriken.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            shuriken.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 150);
    }
});

function createSparkles(x, y) {
    const colors = CONFIG.particles.colors;

    for (let i = 0; i < CONFIG.particles.count; i++) {
        const angle = (360 / CONFIG.particles.count) * i;
        const velocity = random(40, 80);
        const color = colors[Math.floor(Math.random() * colors.length)];

        createSparkle(x, y, angle, velocity, color);
    }
}

function createSparkle(x, y, angle, velocity, color) {
    const particle = document.createElement('div');
    particle.className = 'click-spark';
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 6px;
        height: 6px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px ${color};
    `;

    document.body.appendChild(particle);

    const radians = (angle * Math.PI) / 180;
    const endX = Math.cos(radians) * velocity;
    const endY = Math.sin(radians) * velocity;

    particle.animate([
        {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1
        },
        {
            transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0)`,
            opacity: 0
        }
    ], {
        duration: 500,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }).onfinish = () => particle.remove();
}

// --- 9. SKILLS ANIMATION ON SCROLL ---
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const progress = entry.target;
            const width = progress.style.width;
            progress.style.width = '0';

            setTimeout(() => {
                progress.style.width = width;
            }, 300);

            skillObserver.unobserve(progress);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach((bar) => skillObserver.observe(bar));

// --- 10. TILT EFFECT ON CARDS ---
const cards = document.querySelectorAll('.about-card, .blog-card');

cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// --- 11. TEXT SCRAMBLE EFFECT ---
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span style="color: var(--color-primary)">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

// Apply text scramble to the title on hover
const nameEl = document.querySelector('.hero-text h1.name');
if (nameEl) {
    const originalText = nameEl.innerText;
    const scramble = new TextScramble(nameEl);

    nameEl.addEventListener('mouseenter', () => {
        scramble.setText(originalText);
    });
}

// --- 12. PARALLAX ON HERO ---
const heroSection = document.querySelector('.hero-section');
const heroImage = document.querySelector('.hero-image');
const heroImageBg = document.querySelector('.hero-image-bg');

if (heroSection && heroImage) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const rate = scrollY * 0.3;

        if (scrollY < window.innerHeight) {
            heroImage.style.transform = `translateY(${rate * 0.2}px)`;
            if (heroImageBg) {
                heroImageBg.style.transform = `rotate(-6deg) translate(-15px, ${15 + rate * 0.3}px)`;
            }
        }
    });
}

// --- 13. SMOOTH ANCHOR SCROLLING ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetEl = document.querySelector(targetId);

        if (targetEl) {
            // Close mobile menu if open
            if (navLinks?.classList.contains('open')) {
                navLinks.classList.remove('open');
                if (menuIcon) menuIcon.className = 'ph ph-list';
            }

            targetEl.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- 14. FORM VALIDATION WITH ANIMATIONS ---
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Add loading state
        submitBtn.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="30 70" />
                </svg>
                Đang gửi...
            </span>
        `;
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                    ✨ Đã gửi thành công!
                </span>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, hsl(150, 100%, 45%), hsl(180, 100%, 45%))';

            // Reset after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        }, 1500);
    });
}

// --- 15. DYNAMIC CSS ANIMATIONS ---
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .about-card, .blog-card {
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }
`;
document.head.appendChild(style);

// --- 16. EASTER EGG: KONAMI CODE ---
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Rainbow mode!
    document.body.style.animation = 'rainbow-bg 3s linear infinite';

    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow-bg {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);

    // Show celebration
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createSparkles(
                random(0, window.innerWidth),
                random(0, window.innerHeight)
            );
        }, i * 50);
    }

    // Remove after 5 seconds
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// --- 17. THEME TOGGLE LOGIC (HASH KEY) ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    htmlElement.classList.add('light-mode');
    if (themeIcon) themeIcon.className = 'ph-fill ph-moon';
}

if (themeToggle) {
    let isDragging = false;
    let startY = 0;
    let startX = 0;
    let dragY = 0;
    let dragX = 0;
    const baseHeight = 150;
    const maxDrag = 200;

    // Vertical Spring physics
    let springY = 0;
    let velocityY = 0;
    const tensionY = 0.15;
    const frictionY = 0.8;

    // Horizontal Swing physics (Rotation)
    let rotation = 0;
    let velocityR = 0;
    const tensionR = 0.05;
    const frictionR = 0.92;

    const updatePhysics = () => {
        if (!isDragging) {
            // Vertical Physics
            const forceY = (0 - springY) * tensionY;
            velocityY += forceY;
            velocityY *= frictionY;
            springY += velocityY;

            // Rotation Physics
            const forceR = (0 - rotation) * tensionR;
            velocityR += forceR;
            velocityR *= frictionR;
            rotation += velocityR;

            // Apply visual updates
            themeToggle.style.height = `${baseHeight + springY}px`;
            themeToggle.style.transform = `rotate(${rotation}deg)`;

            // Stop loop if movement is negligible
            if (Math.abs(velocityY) < 0.01 && Math.abs(springY) < 0.01 &&
                Math.abs(velocityR) < 0.01 && Math.abs(rotation) < 0.01) {
                springY = 0;
                velocityY = 0;
                rotation = 0;
                velocityR = 0;
                themeToggle.style.height = `${baseHeight}px`;
                themeToggle.style.transform = `rotate(0deg)`;
                return;
            }
        }
        requestAnimationFrame(updatePhysics);
    };

    const handleStart = (e) => {
        isDragging = true;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        startX = clientX;
        startY = clientY;
        themeToggle.style.transition = 'none';
        document.body.style.userSelect = 'none';
    };

    const handleMove = (e) => {
        if (!isDragging) return;

        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        dragY = Math.max(0, clientY - startY);
        dragX = clientX - startX;

        // Vertical displacement with resistance
        springY = Math.log10(dragY / 100 + 1) * maxDrag;

        // Calculate rotation based on horizontal drag and current vertical length
        const currentLength = baseHeight + springY;
        rotation = -(dragX / currentLength) * (180 / Math.PI) * 0.5;

        // Limit rotation
        rotation = Math.max(-60, Math.min(60, rotation));

        themeToggle.style.height = `${currentLength}px`;
        themeToggle.style.transform = `rotate(${rotation}deg)`;
    };

    const handleEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';

        if (springY > 50) {
            triggerThemeChange();
        }

        // Final velocity carry over
        velocityR = rotation * 0.05;

        requestAnimationFrame(updatePhysics);
    };

    const triggerThemeChange = () => {
        document.body.classList.add('theme-changing');
        const rect = themeToggle.querySelector('.theme-toggle-handle').getBoundingClientRect();
        createSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        const isLight = htmlElement.classList.toggle('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        if (themeIcon) {
            themeIcon.className = isLight ? 'ph-fill ph-moon' : 'ph-fill ph-sun';
        }
        setTimeout(() => {
            document.body.classList.remove('theme-changing');
        }, 1200);
    };

    themeToggle.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    themeToggle.addEventListener('touchstart', handleStart);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    themeToggle.addEventListener('mouseenter', () => {
        if (!isDragging) {
            velocityY = 15;
            velocityR = (Math.random() - 0.5) * 10;
            requestAnimationFrame(updatePhysics);
        }
    });
}

// --- INIT LOG ---
console.log('%c✨ Website loaded with Josh Comeau-style interactions!',
    'background: linear-gradient(135deg, #ff5c87, #a855f7); color: white; padding: 10px 20px; border-radius: 8px; font-weight: bold;');
console.log('%c🎮 Try the Konami Code for a surprise!',
    'color: #a855f7; font-weight: bold;');

