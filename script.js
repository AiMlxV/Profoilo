const loadingConfig = {
    minLoadTime: 2500, // Reduced to 2.5 seconds but still substantial
    progressInterval: 30, // Smoother progress updates
    loadingMessages: [
        "🖥️กำลังเปิดเครื่อง...",
        "🛜เชื่อมต่ออินเตอร์เน็ต...",
        "🍵กำลังชงกาแฟ...",
        "😊เกือบจะเสร็จแล้ว...",
        "😄เสร็จแล้ว..."
    ],
    storageKey: 'lastLoadTime',
    expirationTime: 60 * 60 * 1000 // 1 hour in milliseconds
};

function shouldShowLoading() {
    const lastLoad = localStorage.getItem(loadingConfig.storageKey);
    if (!lastLoad) return true;

    const now = Date.now();
    const timeSinceLastLoad = now - parseInt(lastLoad);
    return timeSinceLastLoad > loadingConfig.expirationTime;
}

function simulateLoading() {
    if (!shouldShowLoading()) {
        // Skip loading animation if within time window
        document.body.style.visibility = 'visible';
        document.getElementById('loading-overlay').style.display = 'none';
        initializeApp(); // New function to handle post-loading initialization
        return;
    }

    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');
    const loadingOverlay = document.getElementById('loading-overlay');
    let progress = 0;
    const startTime = Date.now();

    // Ensure overlay is visible and body is hidden
    document.body.style.visibility = 'hidden';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.opacity = '1';
    loadingOverlay.style.visibility = 'visible';

    const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / loadingConfig.minLoadTime) * 100, 100);
        
        progressBar.value = progress;
        
        // Update loading message
        const messageIndex = Math.floor((progress / 100) * loadingConfig.loadingMessages.length);
        loadingText.textContent = loadingConfig.loadingMessages[Math.min(messageIndex, loadingConfig.loadingMessages.length - 1)];
        
        if (elapsed < loadingConfig.minLoadTime) {
            requestAnimationFrame(updateProgress);
        } else {
            finishLoading();
        }
    };

    const finishLoading = () => {
        progressBar.value = 100;
        loadingText.textContent = "Welcome!";
        
        // Store the loading completion time
        localStorage.setItem(loadingConfig.storageKey, Date.now().toString());
        
        // Fade out overlay and show content
        setTimeout(() => {
            document.body.style.visibility = 'visible';
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                initializeApp(); // Initialize after loading completes
            }, 800);
        }, 200);
    };

    requestAnimationFrame(updateProgress);
}

// Font loading check
document.fonts.ready.then(() => {
    if (document.fonts.check('1em LINESeedSansTH')) {
        console.log('LINESeedSansTH font loaded successfully');
    } else {
        console.warn('LINESeedSansTH font failed to load');
    }
});

// Consolidated Tailwind configuration
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                'custom': ['LINESeedSansTH', 'sans-serif'],
            },
        },
    }
};

// Sample project data
const projects = [
    {
        title: "loream ipsum",
        description: "loram ipsum dolor sit amet, consectetur adipiscing elit",
        image: "https://via.placeholder.com/300x200?text=Web+Project",
        link: "#"
    },
    {
        title: "loream ipsum",
        description: "loram ipsum dolor sit amet, consectetur adipiscing elit",
        image: "https://via.placeholder.com/300x200?text=Mobile+App",
        link: "#"
    },
    {
        title: "loream ipsum",
        description: "loram ipsum dolor sit amet, consectetur adipiscing elit",
        image: "https://via.placeholder.com/300x200?text=UI+Design",
        link: "#"
    }
];

// Sample certificate data
const certificates = [
    {
        title: "Cer1",
        issuer: "-",
        date: "2024",
        image: "https://via.placeholder.com/300x200?text=Web+Certificate"
    },
    {
        title: "Cer2",
        issuer: "-",
        date: "2023",
        image: "https://via.placeholder.com/300x200?text=JS+Certificate"
    },
    {
        title: "Cer3",
        issuer: "-",
        date: "2023",
        image: "https://via.placeholder.com/300x200?text=Design+Certificate"
    }
];

// Typing animation configuration
const texts = [
    "printf(\"Welcome!\")", 
    "print(\"Welcome!\")", 
    "std::cout << \"Welcome!\";",
    "println(\"Welcome!\")",
    "System.Console.WriteLine(\"Welcome\");",
    "$echo Welcome!",
    "<h1>Welcome!</h1>",
    "console.log(\"Welcome!\");"
];

const typingConfig = {
    speed: 75,
    exitCodeSpeed: 37.5, // Add faster speed for exit code
    startDelay: 250
};

function getRandomText() {
    const randomIndex = Math.floor(Math.random() * texts.length);
    return { text: texts[randomIndex], index: randomIndex + 1 };
}

function initTypingAnimation() {
    const typing = document.getElementById('welcome-text');
    const { text, index } = getRandomText();
    const mainText = text;
    const exitCode = `      (Exit Code 0${index})`;
    let currentIndex = 0;
    let isTypingExitCode = false;
    let exitCodeIndex = 0;

    function typeText() {
        if (!isTypingExitCode && currentIndex < mainText.length) {
            typing.textContent = mainText.substring(0, currentIndex + 1);
            currentIndex++;
            setTimeout(typeText, typingConfig.speed);
        } else if (!isTypingExitCode) {
            isTypingExitCode = true;
            typeExitCode();
        }
    }

    function typeExitCode() {
        if (exitCodeIndex < exitCode.length) {
            typing.innerHTML = mainText + `<span class="text-sm text-zinc-400">${exitCode.substring(0, exitCodeIndex + 1)}</span>`;
            exitCodeIndex++;
            setTimeout(typeExitCode, typingConfig.exitCodeSpeed);
        }
    }

    setTimeout(typeText, typingConfig.startDelay);
}

// Enhanced smooth scroll function
function smoothScroll(targetId) {
    const targetSection = document.querySelector(targetId);
    const navHeight = document.querySelector('nav').offsetHeight;

    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop - navHeight,
            behavior: 'smooth'
        });
    }
}

// Populate projects
function displayProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.innerHTML = '<span class="loading loading-spinner loading-md"></span>';
    
    setTimeout(() => {
        projectsGrid.innerHTML = '';
        projects.forEach(project => {
            const projectCard = `
                <div class="group bg-stone-50 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-sm border border-stone-200 dark:border-zinc-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" data-aos="fade-up">
                    <div class="relative overflow-hidden">
                        <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110">
                        <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2 text-zinc-800 dark:text-zinc-200">${project.title}</h3>
                        <p class="text-zinc-600 dark:text-zinc-400 mb-4">${project.description}</p>
                        <a href="${project.link}" class="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors">
                            View Project <i class="fas fa-arrow-right ml-2 transform transition-transform group-hover:translate-x-2"></i>
                        </a>
                    </div>
                </div>
            `;
            projectsGrid.innerHTML += projectCard;
        });
    }, 500); // Simulate loading delay
}

// Populate certificates
function displayCertificates() {
    const certificatesGrid = document.querySelector('.certificates-grid');
    certificatesGrid.innerHTML = '<span class="loading loading-spinner loading-md"></span>';
    
    setTimeout(() => {
        certificatesGrid.innerHTML = '';
        certificates.forEach(cert => {
            const certCard = `
                <div class="group bg-stone-50 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-sm border border-stone-200 dark:border-zinc-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" data-aos="fade-up">
                    <div class="relative overflow-hidden">
                        <img src="${cert.image}" alt="${cert.title}" class="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110">
                        <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2 text-zinc-800 dark:text-zinc-200">${cert.title}</h3>
                        <p class="text-zinc-600 dark:text-zinc-400">Issued by: ${cert.issuer}</p>
                        <p class="text-zinc-500 dark:text-zinc-500">${cert.date}</p>
                    </div>
                </div>
            `;
            certificatesGrid.innerHTML += certCard;
        });
    }, 500); // Simulate loading delay
}

// Form submission
function submitForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Add your form submission logic here
    console.log('Form submitted:', { name, email, message });
    alert('ส่งข้อความสำเร็จ!');
}

// Theme toggle functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        const isDark = html.getAttribute('data-theme') === 'dark';
        requestAnimationFrame(() => {
            icon.classList.remove(isDark ? 'fa-moon' : 'fa-sun');
            icon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
        });
    }
    
    function toggleTheme() {
        // Add transition class before changes
        html.classList.add('theme-transition');
        
        // Toggle theme
        const isDark = html.getAttribute('data-theme') === 'light';
        const newTheme = isDark ? 'dark' : 'light';
        
        requestAnimationFrame(() => {
            html.classList.toggle('dark', isDark);
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon();
            
            // Remove transition class after animation
            setTimeout(() => {
                html.classList.remove('theme-transition');
            }, 300);
        });
    }
    
    // Initialize icon
    updateThemeIcon();
    themeToggle.addEventListener('click', toggleTheme);
}

// Add mobile menu functionality
function setupMobileMenu() {
    const menuButton = document.querySelector('.md\\:hidden');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Move initialization code to separate function
function initializeApp() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Add smooth scroll to all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            smoothScroll(targetId);
        });
    });

    // Initialize all functionality
    initTypingAnimation();
    setupThemeToggle();
    displayProjects();
    displayCertificates();
    setupMobileMenu();
}

// Single DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    simulateLoading(); // This will now check if loading is needed
});
