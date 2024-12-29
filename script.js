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
}

// Populate certificates
function displayCertificates() {
    const certificatesGrid = document.querySelector('.certificates-grid');
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
    
    // Remove initial theme check since it's now handled in the HTML
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
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

// Single DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
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
});
