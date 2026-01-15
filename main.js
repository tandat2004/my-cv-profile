// 1. HEADER SCROLL EFFECT
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.background = 'rgba(15, 17, 21, 0.8)';
        header.style.padding = '15px 0';
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'transparent';
        header.style.padding = '20px 0';
        header.style.boxShadow = 'none';
    }
});

// 2. MOBILE MENU TOGGLE
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        const isExpanded = navLinks.style.display === 'flex';
        if (isExpanded) {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(15, 17, 21, 0.95)';
            navLinks.style.padding = '20px';
            navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        }
    });
}

// 3. SCROLL REVEAL ANIMATION
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
});

const style = document.createElement('style');
style.innerHTML = `
    .hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
    }
    .visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// 4. MOUSE GLOW EFFECT
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        cursorGlow.style.background = `radial-gradient(600px at ${x}px ${y}px, rgba(99, 102, 241, 0.15), transparent 80%)`;
    });
}

// 5. NARUTO SHURIKEN CURSOR LOGIC
const shuriken = document.getElementById('shuriken-cursor');
let mouseX = 0, mouseY = 0;
let lastX = 0, lastY = 0;
let isMoving = false;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Cập nhật vị trí Shuriken ngay lập tức (không độ trễ để cảm giác sắc bén)
    if (shuriken) {
        shuriken.style.left = `${mouseX}px`;
        shuriken.style.top = `${mouseY}px`;
    }

    // Logic tạo tàn ảnh (Chakra Trail) khi di chuyển nhanh
    const dist = Math.hypot(mouseX - lastX, mouseY - lastY);
    if (dist > 20) { // Chỉ tạo tàn ảnh khi di chuyển > 20px
        createShurikenTrail(mouseX, mouseY);
        lastX = mouseX;
        lastY = mouseY;

        // Tăng tốc độ xoay khi di chuyển (thêm class fast-spin)
        if (shuriken) shuriken.style.animationDuration = '0.3s';
    } else {
        // Xoay chậm lại khi đứng yên/di chuyển chậm
        if (shuriken) shuriken.style.animationDuration = '1.5s';
    }
});

function createShurikenTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'ninja-trail';
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    document.body.appendChild(trail);

    setTimeout(() => { trail.remove(); }, 500);
}

// Hiệu ứng Click: Tạo tia lửa (Sparks)
document.addEventListener('mousedown', (e) => {
    if (shuriken) {
        // Hiệu ứng nảy nhẹ
        shuriken.style.transform = 'translate(-50%, -50%) scale(0.8)';
    }

    // Tạo 8 tia lửa xung quanh
    for (let i = 0; i < 8; i++) {
        createSpark(e.clientX, e.clientY, i * 45);
    }
});

document.addEventListener('mouseup', () => {
    if (shuriken) {
        shuriken.style.transform = 'translate(-50%, -50%) scale(1)';
    }
});

function createSpark(x, y, angle) {
    const spark = document.createElement('div');
    spark.className = 'click-spark';
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;

    // Xoay tia lửa theo góc
    spark.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-20px)`;

    // Animation bay ra xa
    const anim = spark.animate([
        { transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(0px)`, opacity: 1 },
        { transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(40px)`, opacity: 0 }
    ], {
        duration: 300,
        easing: 'ease-out'
    });

    document.body.appendChild(spark);

    anim.onfinish = () => spark.remove();
}
