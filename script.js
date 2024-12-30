import { projects } from './data/projects.js';
import { certificates } from './data/certificates.js';

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
                <a href="${project.link}" class="block group bg-stone-50 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-sm border border-stone-200 dark:border-zinc-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer" data-aos="fade-up">
                    <div class="relative overflow-hidden">
                        <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110">
                        <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2 text-zinc-800 dark:text-zinc-200">${project.title}</h3>
                        <p class="text-zinc-600 dark:text-zinc-400 mb-4">${project.description}</p>
                        <div class="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors">
                            View more <i class="fas fa-arrow-right ml-2 transform transition-transform group-hover:translate-x-2"></i>
                        </div>
                    </div>
                </a>
            `;
            projectsGrid.innerHTML += projectCard;
        });
    }, 500); // Simulate loading delay
}

const certificateConfig = {
    itemsPerPage: 6,
    currentPage: 1,
    cachedCards: [], // Store prerendered cards
    isLoading: false
};

function createLoadingCard() {
    return `
        <div class="bg-stone-50 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-sm border border-stone-200 dark:border-zinc-700 p-6 flex flex-col items-center justify-center min-h-[300px]">
            <span class="loading loading-spinner loading-lg"></span>
            <p class="mt-4 text-zinc-500 dark:text-zinc-400">Loading...</p>
        </div>
    `;
}

function createThumbnail(originalUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = function() {
            // Create canvas for thumbnail
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate thumbnail size (maintain aspect ratio)
            const maxWidth = 400; // thumbnail width
            const ratio = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * ratio;
            
            // Draw resized image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Get thumbnail as data URL
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        
        img.src = originalUrl;
    });
}

function displayCertificates(isLoadMore = false) {
    if (certificateConfig.isLoading) return;
    certificateConfig.isLoading = true;

    const certificatesGrid = document.querySelector('.certificates-grid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!isLoadMore) {
        certificatesGrid.innerHTML = '';
        certificateConfig.currentPage = 1;
    }

    const startIndex = (certificateConfig.currentPage - 1) * certificateConfig.itemsPerPage;
    const endIndex = startIndex + certificateConfig.itemsPerPage;
    
    // First, add loading placeholders
    const placeholdersNeeded = Math.min(certificateConfig.itemsPerPage, certificates.length - startIndex);
    for (let i = 0; i < placeholdersNeeded; i++) {
        const placeholder = document.createElement('div');
        placeholder.innerHTML = createLoadingCard();
        placeholder.setAttribute('data-index', startIndex + i);
        certificatesGrid.appendChild(placeholder);
    }

    // Then load actual certificates with staggered delay
    const certsToDisplay = certificates.slice(startIndex, endIndex);
    certsToDisplay.forEach(async (cert, index) => {
        setTimeout(async () => {
            const placeholder = certificatesGrid.querySelector(`[data-index="${startIndex + index}"]`);
            if (placeholder) {
                // Generate thumbnail
                const thumbnailUrl = await createThumbnail(cert.image);
                
                const certCard = `
                    <div class="group bg-stone-50 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-sm border border-stone-200 dark:border-zinc-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer" 
                         data-aos="fade-up"
                         onclick="openCertificateModal('${cert.image}', '${cert.title}')">
                        <div class="relative overflow-hidden">
                            <img src="${thumbnailUrl}" alt="${cert.title}" 
                                 class="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110" 
                                 loading="lazy">
                            <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2 text-zinc-800 dark:text-zinc-200">${cert.title}</h3>
                            <p class="text-zinc-500 dark:text-zinc-500">${cert.date}</p>
                        </div>
                    </div>
                `;
                placeholder.innerHTML = certCard;
            }
        }, index * 150);
    });

    // Update load more button after all cards are loaded
    setTimeout(() => {
        const remainingItems = certificates.length - endIndex;
        if (loadMoreBtn) {
            loadMoreBtn.style.display = remainingItems > 0 ? 'block' : 'none';
            loadMoreBtn.innerHTML = 'Load More <i class="fas fa-arrow-down ml-2"></i>';
            loadMoreBtn.disabled = false;
        }
        certificateConfig.isLoading = false;
    }, certsToDisplay.length * 150);
}

// Add new function to open the modal
window.openCertificateModal = function(imageUrl, title) {
    const modalHTML = `
        <dialog id="cert_modal" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box bg-stone-50 dark:bg-zinc-800 p-0 relative max-w-3xl">
                <div class="p-4 flex justify-between items-center border-b border-base-200 dark:border-base-700">
                    <h3 class="font-bold text-lg">${title}</h3>
                    <form method="dialog">
                        <button class="btn btn-circle btn-ghost">
                            <i class="fas fa-times"></i>
                        </button>
                    </form>
                </div>
                <figure class="w-full relative">
                    <div id="cert-loading" class="absolute inset-0 flex items-center justify-center bg-base-200">
                        <span class="loading loading-spinner loading-lg"></span>
                    </div>
                    <img src="" alt="${title}" 
                         class="w-full h-auto opacity-0 transition-opacity duration-300" 
                         id="cert-image">
                </figure>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('cert_modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add new modal to the document
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show the modal and load image
    const modal = document.getElementById('cert_modal');
    const certImage = document.getElementById('cert-image');
    const loadingIndicator = document.getElementById('cert-loading');

    modal.showModal();

    // Load full size image
    certImage.onload = function() {
        certImage.classList.remove('opacity-0');
        loadingIndicator.classList.add('hidden');
    };
    
    certImage.src = imageUrl;
};

// Clean up resources
function cleanupCertificates() {
    if (certificateConfig.observer) {
        certificateConfig.observer.disconnect();
        certificateConfig.observer = null;
    }
    if (certificateConfig.scrollThrottle) {
        window.removeEventListener('scroll', certificateConfig.scrollThrottle);
    }
    certificateConfig.loadedImages.clear();
    certificateConfig.renderedCards.clear();
}

// Make loadMoreCertificates globally available
window.loadMoreCertificates = function() {
    certificateConfig.currentPage++;
    displayCertificates(true);
};

// Theme toggle functionality
function setupThemeToggle() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const html = document.documentElement;
    
    function updateThemeIcons() {
        const isDark = html.getAttribute('data-theme') === 'dark';
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            requestAnimationFrame(() => {
                icon.classList.remove(isDark ? 'fa-moon' : 'fa-sun');
                icon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
            });
        });
    }
    
    function toggleTheme() {
        html.classList.add('theme-transition');
        
        const isDark = html.getAttribute('data-theme') === 'light';
        const newTheme = isDark ? 'dark' : 'light';
        
        requestAnimationFrame(() => {
            html.classList.toggle('dark', isDark);
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons();
            
            setTimeout(() => {
                html.classList.remove('theme-transition');
            }, 300);
        });
    }
    
    // Initialize icons
    updateThemeIcons();
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
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

// Cleanup on page unload
window.addEventListener('unload', cleanupCertificates, { passive: true });
