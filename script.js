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
(async function initializeTyping() {
    let welcomeText = "Welcome to my portfolio website!"; // Default text

    async function getVisitorIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            welcomeText = `Nice to meet U! ${data.ip}`;
        } catch (error) {
            console.error('Failed to fetch IP:', error);
            // Keep default welcome text
        }
    }

    await getVisitorIP();

    const typingConfig = {
        text: welcomeText,
        speed: 100,
        startDelay: 1000
    };
    
    // Start typing animation here
    startTypingAnimation(typingConfig);
})();

// Add typing animation
function initTypingAnimation() {
    const typing = document.getElementById('welcome-text');
    let index = 0;

    function typeText() {
        if (index < typingConfig.text.length) {
            typing.textContent += typingConfig.text.charAt(index);
            index++;
            setTimeout(typeText, typingConfig.speed);
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

// Tailwind configuration for dark mode
tailwind.config = {
    darkMode: 'class',
    // ... any other Tailwind config
};

// Theme toggle functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');

    themeToggle.addEventListener('click', () => {
        // Toggle dark class on document root element
        document.documentElement.classList.toggle('dark');

        // Update localStorage
        if (document.documentElement.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
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

// Initialize all animations and event listeners
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

    // Initialize typing animation
    initTypingAnimation();

    // Initialize existing functionality
    setupThemeToggle();
    displayProjects();
    displayCertificates();
    setupMobileMenu();

    // Update random text display
    const { text, index, total } = getRandomText();
    const textElement = document.getElementById("randomText");
    if (textElement) {
        textElement.innerHTML = `${text} <span class="text-sm text-zinc-400">(ข้อความที่ ${index} จากทั้งหมด ${total})</span>`;
    }
});

const texts = [
    "ผู้ที่รักการสร้างสรรค์และทำอะไรใหม่ๆ",
    "ผู้ที่ชอบเรียนรู้สิ่งใหม่ตลอดเวลา",
    "ผู้ที่หลงใหลในเทคโนโลยีและนวัตกรรม",
    "ผู้ที่สนใจการพัฒนาเทคโนโลยีเพื่อช่วยเหลือผู้คน",
    "ผู้ที่ตั้งใจสร้างเทคโนโลยีที่ใช้งานง่ายและมีประโยชน์"
];

function getRandomText() {
    const randomIndex = Math.floor(Math.random() * texts.length);
    return { text: texts[randomIndex], index: randomIndex + 1, total: texts.length };
}

document.addEventListener("DOMContentLoaded", () => {
    const textElement = document.getElementById("randomText");
    const { text, index, total } = getRandomText();
    textElement.innerHTML = `${text} <span class="text-sm text-zinc-400">(ข้อความที่ ${index} จากทั้งหมด)</span>`;
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init();

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    
    // Check initial theme
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

    // Theme toggle handler
    themeToggle.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
});
