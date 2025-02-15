//LANDING PAGE
// DARKMODE
document.body.style.background = 'linear-gradient(180deg, #006994 0%, #003366 100%)';
const darkModeToggle = document.getElementById('theme-toggle');

// Create a single instance of ThemeManager that can be used across the app
let themeManagerInstance = null;

class ThemeManager {
    constructor() {
        // Singleton pattern
        if (themeManagerInstance) {
            return themeManagerInstance;
        }
        themeManagerInstance = this;

        this.body = document.body;
        this.themeToggle = document.getElementById('theme-toggle');
        this.navLinks = document.getElementById('nav-links');
        this.hamburger = document.querySelector('.hamburger');
        this.isNightTheme = false;
        this.stars = [];
        
        this.init();
        this.initNavbar();
    }

    init() {
        // Initialize theme
        const savedTheme = localStorage.getItem('theme');
        this.isNightTheme = savedTheme === 'night';
        
        // Apply saved theme immediately
        if (this.isNightTheme) {
            this.body.classList.add('night-theme');
            this.body.classList.remove('day-theme');
        } else {
            this.body.classList.add('day-theme');
            this.body.classList.remove('night-theme');
        }

        // Apply initial styles
        this.updateWaveColors();
        this.updateBackgroundColor();
        this.createStars();
        this.initShootingStars();

        // Add theme toggle listener
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Add resize listener
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    initNavbar() {
        if (!this.navLinks || !this.hamburger) return;

        // Initial navbar setup
        this.handleMenuDisplay();

        // Hamburger click handler
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navLinks.classList.toggle('active');
            
            // Toggle display
            if (window.innerWidth <= 768) {
                if (this.navLinks.style.display === 'none' || !this.navLinks.style.display) {
                    this.navLinks.style.display = 'flex';
                    this.navLinks.style.flexDirection = 'column';
                } else {
                    this.navLinks.style.display = 'none';
                }
            }
        });

        // Setup smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    
                    // Close mobile menu if open
                    if (window.innerWidth <= 768) {
                        this.navLinks.style.display = 'none';
                        this.hamburger.classList.remove('active');
                        this.navLinks.classList.remove('active');
                    }
                }
            });
        });

        // Active link handling
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.href === window.location.href) {
                link.classList.add('active');
            }

            link.addEventListener('click', () => {
                document.querySelectorAll('.nav-links a').forEach(l => 
                    l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    handleMenuDisplay() {
        if (!this.navLinks) return;
        
        if (window.innerWidth > 768) {
            this.navLinks.style.display = 'flex';
            this.navLinks.style.flexDirection = 'row';
            this.navLinks.classList.remove('active');
            if (this.hamburger) {
                this.hamburger.classList.remove('active');
            }
        } else {
            this.navLinks.style.display = 'none';
        }
    }

    handleResize() {
        this.handleMenuDisplay();
        this.updateWaveColors();
        this.updateBackgroundColor();
    }

    toggleTheme() {
        this.isNightTheme = !this.isNightTheme;
        localStorage.setItem('theme', this.isNightTheme ? 'night' : 'day');

        this.body.classList.toggle('night-theme');
        this.body.classList.toggle('day-theme');

        this.updateWaveColors();
        this.updateBackgroundColor();
    }

    updateBackgroundColor() {
        const colors = this.isNightTheme ? {
            body: 'linear-gradient(to bottom, #09192a, #000000)',
            navbar: '#2a3441',
            navLinks: '#000000',
            footer: '#000000'
        } : {
            body: 'linear-gradient(180deg, #006994 0%, #003366 100%)',
            navbar: '#d3f1ff',
            navLinks: '#326ea2',
            footer: '#153c66'
        };

        document.body.style.background = colors.body;
        
        const navbar = document.getElementById('navbar');
        const headerNav = document.querySelector('.headerNav');
        const navLinks = document.querySelector('.nav-links');
        const footer = document.querySelector('.footer');
        const landing = document.querySelector('.landing');

        if (navbar) navbar.style.background = colors.navbar;
        if (headerNav) headerNav.style.backgroundColor = 'transparent';
        if (navLinks) navLinks.style.backgroundColor = colors.navLinks;
        if (footer) footer.style.backgroundColor = colors.footer;
        if (landing) {
            landing.style.background = 
                `linear-gradient(to top, var(--bg-gradient-1), var(--bg-gradient-2), var(--bg-gradient-3))`;
        }
    }

    updateWaveColors() {
        const waves = document.querySelectorAll('.wave path');
        waves.forEach((wave, index) => {
            let waveColor;

            if (this.isNightTheme) {
                // Night theme colors
                if (index === 0) waveColor = '#1e3d5a';
                if (index === 1) waveColor = '#152f47';
                if (index === 2) waveColor = '#0c1f33';
            } else {
                // Day theme colors - use CONFIG values
                waveColor = CONFIG.waves.colors[index];
            }

            wave.setAttribute('fill', waveColor);
            wave.style.fill = waveColor;
        });
    }

    createStars() {
        const starsContainer = document.querySelector('.stars');
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.className = 'star';

            const size = Math.random() * 2;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = 2 + Math.random() * 2;

            star.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                top: ${top}%;
                animation-delay: ${delay}s;
                --twinkle-duration: ${duration}s;
            `;

            starsContainer.appendChild(star);
            this.stars.push(star);
        }
    }

    initShootingStars() {
        setInterval(() => {
            if (this.isNightTheme) {
                this.createShootingStar();
            }
        }, 5000);
    }

    createShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';

        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight / 2);
        const duration = 1 + Math.random();

        star.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            --duration: ${duration}s;
        `;

        document.querySelector('.stars').appendChild(star);
        setTimeout(() => star.remove(), duration * 1000);
    }
}

const createSVGElement = (type) => document.createElementNS('http://www.w3.org/2000/svg', type);

const random = (min, max) => Math.random() * (max - min) + min;

// Data Atribute
const CONFIG = {
    waves: {
        colors: ['#1b95c6', '#1484b0', '#006994'],
        zIndex: ['1', '2', '4'],
        count: 3
    },
    trash: {
        images: [
            'gambar/garbageBagElement.png',
            'gambar/cupElement.png',
            'gambar/waterElement.png',
            'gambar/plasticElement.png'
        ],
        count: 9
    },
    clouds: {
        count: 13
    }
};

// Wave animation
class WaveAnimation {
    constructor(container) {
        this.container = container;
        this.waves = [];
        this.svgWidth = 1440;
        this.themeManager = new ThemeManager(); // Will return the singleton instance
        this.init();

        // Debounce resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateSVGCount();
            }, 250);
        });
    }

    init() {
        for (let i = 0; i < CONFIG.waves.count; i++) {
            const wave = document.createElement('div');
            wave.className = 'wave';
            wave.style.zIndex = CONFIG.waves.zIndex[i];

            this.waves.push({
                element: wave,
                paths: [],
                phase: i * Math.PI / 2,
                color: this.themeManager.isNightTheme ? 
                    this.getNightColor(i) : 
                    CONFIG.waves.colors[i]
            });

            this.container.appendChild(wave);
        }

        this.updateSVGCount();
        this.animate();
    }

    getNightColor(index) {
        const nightColors = ['#1e3d5a', '#152f47', '#0c1f33'];
        return nightColors[index];
    }

    updateSVGCount() {
        const screenWidth = window.innerWidth;
        const requiredSVGs = Math.max(1, Math.ceil((screenWidth * 1.1) / this.svgWidth));

        this.waves.forEach(wave => {
            wave.element.innerHTML = '';
            wave.paths = [];

            for (let j = 0; j < requiredSVGs; j++) {
                const svg = createSVGElement('svg');
                svg.setAttribute('viewBox', '0 0 1440 320');

                if (j === 0) {
                    svg.style.left = '0';
                } else {
                    svg.style.left = `${j * 95}%`;
                }
                svg.style.width = `${this.svgWidth}px`;

                const path = createSVGElement('path');
                // Use current theme color instead of wave.color
                const color = this.themeManager.isNightTheme ? 
                    this.getNightColor(this.waves.indexOf(wave)) : 
                    CONFIG.waves.colors[this.waves.indexOf(wave)];
                    
                path.setAttribute('fill', color);
                path.style.fill = color;
                path.style.opacity = (1 - this.waves.indexOf(wave) * 0.2).toString();

                svg.appendChild(path);
                wave.element.appendChild(svg);
                wave.paths.push(path);
            }
        });
    }

    animate() {
        this.waves.forEach(wave => {
            const points = [];
            const segments = 24;
            const width = this.svgWidth;
            const height = 320;

            for (let x = 0; x <= segments; x++) {
                const xPoint = (x / segments) * width;
                const y = Math.sin(x / 3 + wave.phase) * 15 +
                    Math.sin(x / 2 + wave.phase * 1.5) * 5 +
                    (height / 2);
                points.push(`${xPoint},${y}`);
            }

            const pathData = `M0,${height} L0,${height / 2} L${points.join(' L')} L${width},${height} Z`;
            wave.paths.forEach(path => path.setAttribute('d', pathData));
            wave.phase += 0.005;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Trash generator
class TrashGenerator {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        for (let i = 0; i < CONFIG.trash.count; i++) {
            const trash = document.createElement('div');
            trash.className = 'trash';

            const img = document.createElement('img');
            img.src = CONFIG.trash.images[Math.floor(random(0, CONFIG.trash.images.length))];

            trash.appendChild(img);
            this.container.appendChild(trash);

            const left = random(5, 95);
            const bottom = random(-5, 5);
            const delay = random(0, 2);
            const duration = random(4, 6);

            trash.style.cssText = `
                left: ${left}%;
                bottom: ${bottom}%;
                animation: float ${duration}s ease-in-out ${delay}s infinite;
            `;
        }
    }
}

// Cloud generator
class CloudGenerator {
    constructor() {
        this.init();
    }

    init() {
        for (let i = 0; i < CONFIG.clouds.count; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';

            const width = random(50, 150);
            const height = random(25, 85);

            cloud.style.cssText = `
                width: ${width}px;
                height: ${height}px;
                top: ${random(10, 30)}vh;
                left: ${random(0, 100)}vw;
                animation: floatClouds ${random(10, 25)}s linear infinite;
            `;

            document.querySelector('.parallax-container').appendChild(cloud);
        }
    }
}

// Parallax effect
class ParallaxEffect {
    constructor() {
        this.title = document.querySelector('.title');
        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

            if (this.title) {
                this.title.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        }, { passive: true });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Create the single ThemeManager instance
    const themeManager = new ThemeManager();
    
    const wavesContainer = document.getElementById('waves-container');
    const trashContainer = document.getElementById('trash-container');

    // Initialize components
    if (wavesContainer) {
        const waveAnimation = new WaveAnimation(wavesContainer);
    }
    if (trashContainer) {
        new TrashGenerator(trashContainer);
    }
    new CloudGenerator();
    new ParallaxEffect();

    createBubblesInSections();

    // Handle window resize
    window.addEventListener('resize', () => {
        themeManager.updateWaveColors();
        themeManager.updateBackgroundColor();
    });
});

// IMPACTS
document.querySelectorAll('.impact-card').forEach(card => {
    const factContainer = card.querySelector('.card-fact');
    const fact = factContainer.dataset.fact;

    const words = fact.split(' ');
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.className = 'fact-item';
        span.style.transitionDelay = `${index * 50}ms`;
        factContainer.appendChild(span);
    });

    const factItems = factContainer.querySelectorAll('.fact-item');

    card.addEventListener('mouseenter', () => {
        factItems.forEach(item => {
            item.classList.add('visible');
        });
    });

    card.addEventListener('mouseleave', () => {
        factItems.forEach(item => {
            item.classList.remove('visible');
        });
    });
});

// MIRCOPLASTIC
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});

document.querySelectorAll('.micro-info-card, .micro-solution-card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
    });

    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    });
});

document.querySelectorAll('.micro-stat-card').forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    function switchTab(tabId) {
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
        const activePane = document.getElementById(tabId);

        activeBtn.classList.add('active');
        activePane.classList.add('active');
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            switchTab(tabId);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.explanation-section, .tab-pane').forEach(el => {
        observer.observe(el);
    });
});

// LEARN MORE
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.floating-image');
    let angle = 0;
    const radius = 20;
    const centerPositions = [
        { x: 50, y: 30 },
        { x: 35, y: 60 },
        { x: 65, y: 60 }
    ];

    function animate() {
        angle += 0.005;

        images.forEach((img, index) => {
            const centerX = centerPositions[index].x;
            const centerY = centerPositions[index].y;

            const offsetX = Math.cos(angle + (index * (2 * Math.PI / 3))) * radius;
            const offsetY = Math.sin(angle + (index * (2 * Math.PI / 3))) * radius;

            img.style.left = `${centerX + offsetX}%`;
            img.style.top = `${centerY + offsetY}%`;

            img.style.transform = `translate(-50%, -50%) rotate(${Math.sin(angle * 2) * 5}deg)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
});

// SOLUTIONS
const solutions = [
    {
        icon: "1",
        title: "Mengurangi Wadah Makan Plastik",
        description: "Kurangi wadah berbahan plastik sekali pakai dan beralihlah ke produk yang ramah lingkungan serta dapat digunakan kembali.",
    },
    {
        icon: "2",
        title: "Gunakan botol minum reusable",
        description: "Hindari membeli air mineral dalam botol plastik. Gunakan botol minum yang dapat diisi ulang.",
    },
    {
        icon: "3",
        title: "Kurangi penggunaan sedotan",
        description: "Pilih sedotan yang terbuat dari bahan alami seperti bambu atau stainless steel, atau bahkan tidak pakai sekalipun adalah opsi yang bijak.",
    },
    {
        icon: "4",
        title: "Pisahkan sampah plastik",
        description: "Pisahkan sampah plastik dari jenis sampah lainnya agar memudahkan proses daur ulangnya.",
    },
    {
        icon: "5",
        title: "Plastik biodegradable",
        description: "Meskipun masih plastik, plastik biodegradable ini dapat terurai secara alami dalam waktu yang lebih singkat.",
    },
];

class CustomSolutionCarousel {
    constructor() {
        this.currentIndex = 0;
        this.isAnimating = false;
        this.cardsContainer = document.querySelector(".custom-card-container");
        this.prevButton = document.querySelector(".custom-solution-prev-button");
        this.nextButton = document.querySelector(".custom-solution-next-button");
        this.visibleCards = 5; // Number of visible cards in the stack

        if (!this.cardsContainer || !this.prevButton || !this.nextButton) {
            return;
        }

        this.init();
    }

    init() {
        this.initializeCards();
        this.setupEventListeners();
    }

    createCard(solution) {
        const card = document.createElement("div");
        card.className = "custom-card";
        card.innerHTML = `
            <div class="custom-card-content">
                <div class="custom-card-icon">${solution.icon}</div>
                <div class="custom-card-text">
                    <h3>${solution.title}</h3>
                    <p>${solution.description}</p>
                </div>
            </div>
        `;
        return card;
    }

    getCardIndex(baseIndex, offset) {
        let index = baseIndex + offset;
        while (index < 0) index += solutions.length;
        while (index >= solutions.length) index -= solutions.length;
        return index;
    }

    updateButtonState() {
        if (this.prevButton && this.nextButton) {
            this.prevButton.disabled = this.isAnimating;
            this.nextButton.disabled = this.isAnimating;
        }
    }

    initializeCards() {
        if (!this.cardsContainer) return;

        this.cardsContainer.innerHTML = "";
        // Create initial stack of cards
        for (let i = 0; i < this.visibleCards; i++) {
            const index = this.getCardIndex(this.currentIndex, i);
            const card = this.createCard(solutions[index]);
            card.className = `custom-card position-${i}`;
            this.cardsContainer.appendChild(card);
        }
        this.updateButtonState();
    }

    async animateCards(direction) {
        if (this.isAnimating || !this.cardsContainer) return;

        this.isAnimating = true;
        this.updateButtonState();

        // Update current index based on direction
        if (direction === "next") {
            this.currentIndex = this.getCardIndex(this.currentIndex, 1);
        } else {
            this.currentIndex = this.getCardIndex(this.currentIndex, -1);
        }

        const cards = Array.from(this.cardsContainer.querySelectorAll(".custom-card"));
        
        if (direction === "next") {
            // Remove first card with exit animation
            const exitingCard = cards[0];
            exitingCard.className = "custom-card exit-left";
            setTimeout(() => exitingCard.remove(), 600);

            // Shift remaining cards forward
            setTimeout(() => {
                cards.slice(1).forEach((card, i) => {
                    card.className = `custom-card position-${i}`;
                });

                // Add new card at the back
                const newCardIndex = this.getCardIndex(this.currentIndex, this.visibleCards - 1);
                const newCard = this.createCard(solutions[newCardIndex]);
                newCard.className = "custom-card enter-back";
                this.cardsContainer.appendChild(newCard);

                // Trigger position animation
                requestAnimationFrame(() => {
                    newCard.className = `custom-card position-${this.visibleCards - 1}`;
                });
            }, 300);
        } else {
            // Remove last card with exit animation
            const exitingCard = cards[cards.length - 1];
            exitingCard.className = "custom-card exit-right";
            setTimeout(() => exitingCard.remove(), 600);

            // Add new card at the front
            const newCardIndex = this.getCardIndex(this.currentIndex, 0);
            const newCard = this.createCard(solutions[newCardIndex]);
            newCard.className = "custom-card enter-back";
            this.cardsContainer.insertBefore(newCard, this.cardsContainer.firstChild);

            // Shift all cards back
            setTimeout(() => {
                const updatedCards = Array.from(this.cardsContainer.querySelectorAll(".custom-card"));
                updatedCards.forEach((card, i) => {
                    if (i < this.visibleCards) {
                        card.className = `custom-card position-${i}`;
                    }
                });
            }, 50);
        }

        // Reset animation state
        setTimeout(() => {
            this.isAnimating = false;
            this.updateButtonState();
        }, 600);
    }

    setupEventListeners() {
        if (this.prevButton && this.nextButton) {
            this.prevButton.addEventListener("click", () => this.animateCards("prev"));
            this.nextButton.addEventListener("click", () => this.animateCards("next"));
        }

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") this.animateCards("prev");
            if (e.key === "ArrowRight") this.animateCards("next");
        });

        // Touch navigation
        if (this.cardsContainer) {
            let touchStartX = 0;
            let touchStartY = 0;
            
            this.cardsContainer.addEventListener("touchstart", (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            });

            this.cardsContainer.addEventListener("touchend", (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const diffX = touchEndX - touchStartX;
                const diffY = touchEndY - touchStartY;

                // Only handle horizontal swipes (ignore vertical scrolling)
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) this.animateCards("prev");
                    else this.animateCards("next");
                }
            });
        }
    }
}

// Initialize the carousel
document.addEventListener("DOMContentLoaded", () => {
    new CustomSolutionCarousel();
});

//Back To Top
const scrollBtn = document.getElementById('scrollToTop');
window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollBtn.style.display = "block";
        scrollBtn.style.animation = "fadeIn 0.3s ease-in";
        scrollBtn.style.opacity = "1";
    } else {
        scrollBtn.style.animation = "fadeOut 0.3s ease-out";
        scrollBtn.style.opacity = "0";
        setTimeout(() => {
            if (document.body.scrollTop <= 20 && document.documentElement.scrollTop <= 20) {
                scrollBtn.style.display = "none";
            }
        }, 1300);
    }
};


// Scroll animations
const cards11 = document.querySelectorAll(".Animated");
const observer1 = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible2");
            }
        });
    },
    { threshold: 0.1 }
);

cards11.forEach((card) => observer1.observe(card));

function createBubble() {
    const bubbleContainer = document.querySelector('.bubble-container');
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = Math.random() * 30 + 10;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * window.innerWidth + 'px';
    bubble.style.bottom = Math.random() * window.innerHeight + 'px';
    bubbleContainer.appendChild(bubble);


    setTimeout(() => {
        bubble.remove();
    }, 8000);
}
setInterval(createBubble, 200);
