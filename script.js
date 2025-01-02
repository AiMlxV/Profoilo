import { projects } from './data/projects.js';
import { certificates } from './data/certificates.js';

const loadingConfig = {
    minLoadTime: 2500,
    progressInterval: 30,
    loadingMessages: [
        "🖥️กำลังเปิดเครื่อง...",
        "🛜เชื่อมต่ออินเตอร์เน็ต...",
        "🍵กำลังชงกาแฟ...",
        "😊เกือบจะเสร็จแล้ว...",
        "😄เสร็จแล้ว..."
    ],
    storageKey: 'lastLoadTime',
    expirationTime: 60 * 60 * 1000
};

const tagLabels = {
    all: 'All Certificates',
    robotics: 'Robotics',
    coding: 'Coding',
    camp: 'Camps',
    contest: 'Contests',
    ai: 'AI',
    stem: 'STEM'
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
        document.body.style.visibility = 'visible';
        document.getElementById('loading-overlay').style.display = 'none';
        initializeApp();
        return;
    }

    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');
    const loadingOverlay = document.getElementById('loading-overlay');
    let progress = 0;
    const startTime = Date.now();

    document.body.style.visibility = 'hidden';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.opacity = '1';
    loadingOverlay.style.visibility = 'visible';

    const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / loadingConfig.minLoadTime) * 100, 100);
        
        progressBar.value = progress;
        
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
        
        localStorage.setItem(loadingConfig.storageKey, Date.now().toString());
        
        setTimeout(() => {
            document.body.style.visibility = 'visible';
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                initializeApp();
            }, 800);
        }, 200);
    };

    requestAnimationFrame(updateProgress);
}

document.fonts.ready.then(() => {
    if (document.fonts.check('1em LINESeedSansTH')) {
        console.log('LINESeedSansTH font loaded successfully');
    } else {
        console.warn('LINESeedSansTH font failed to load');
    }
});

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
    exitCodeSpeed: 37.5,
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
    }, 500);
}

const tagColors = {
    robotics: 'border-red-500',
    coding: 'border-blue-500',
    camp: 'border-green-500',
    contest: 'border-yellow-500',
    ai: 'border-cyan-500',
    stem: 'border-purple-500',
};

const certificateConfig = {
    itemsPerPage: 6,
    currentPage: 1,
    cachedCards: [],
    isLoading: false,
    activeTag: 'all'
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
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const maxWidth = 400;
                const ratio = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * ratio;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            } catch (error) {
                console.warn('Thumbnail creation failed, using original image:', error);
                resolve(originalUrl);
            }
        };
        
        img.onerror = function() {
            console.warn('Image load failed:', originalUrl);
            resolve('https://via.placeholder.com/400x300?text=Certificate+Image+Not+Available');
        };
        
        // Add timeout
        setTimeout(() => {
            resolve('https://via.placeholder.com/400x300?text=Loading+Timeout');
        }, 5000); // 5 second timeout

        img.src = originalUrl;
    });
}

function displayCertificates(isLoadMore = false) {
    if (certificateConfig.isLoading) return;
    certificateConfig.isLoading = true;

    const certificatesGrid = document.querySelector('.certificates-grid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    // Show loading state for the button
    if (loadMoreBtn) {
        loadMoreBtn.innerHTML = '<span class="loading loading-spinner loading-sm"></span> Loading...';
        loadMoreBtn.disabled = true;
    }

    if (!isLoadMore) {
        certificatesGrid.innerHTML = '';
        certificateConfig.currentPage = 1;
    }

    // Filter certificates based on active tag
    const filteredCertificates = certificates.filter(cert => 
        certificateConfig.activeTag === 'all' || 
        (cert.tags && cert.tags.includes(certificateConfig.activeTag))
    );

    if (filteredCertificates.length === 0) {
        certificatesGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-search text-4xl mb-4 opacity-50"></i>
                <p class="text-lg opacity-70">No certificates found for this category</p>
            </div>
        `;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        certificateConfig.isLoading = false;
        return;
    }

    const startIndex = (certificateConfig.currentPage - 1) * certificateConfig.itemsPerPage;
    const endIndex = startIndex + certificateConfig.itemsPerPage;
    
    const placeholdersNeeded = Math.min(certificateConfig.itemsPerPage, filteredCertificates.length - startIndex);
    for (let i = 0; i < placeholdersNeeded; i++) {
        const placeholder = document.createElement('div');
        placeholder.innerHTML = createLoadingCard();
        placeholder.setAttribute('data-index', startIndex + i);
        certificatesGrid.appendChild(placeholder);
    }

    const certsToDisplay = filteredCertificates.slice(startIndex, endIndex);
    let loadedCount = 0;

    certsToDisplay.forEach(async (cert, index) => {
        try {
            const placeholder = certificatesGrid.querySelector(`[data-index="${startIndex + index}"]`);
            if (!placeholder) return; // Skip if placeholder not found

            const thumbnailUrl = await createThumbnail(cert.image);
            
            // Get border color based on active tag or first tag
            const borderColor = certificateConfig.activeTag !== 'all' ? 
                tagColors[certificateConfig.activeTag] :
                tagColors[cert.tags[0]] || 'border-base-300';

            const certCard = `
                <div class="group bg-base-100 dark:bg-base-800 rounded-lg overflow-hidden shadow-sm border-2 ${borderColor} transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-zoom-in" 
                     data-aos="fade-up"
                     onclick="openCertificateModal('${cert.image}', '${cert.title}')">
                    <div class="relative overflow-hidden">
                        <img src="${thumbnailUrl}" 
                             alt="${cert.title}" 
                             class="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110" 
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Available'">
                        <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300">
                            <div class="w-full h-full flex items-center justify-center">
                                <i class="fas fa-search-plus text-3xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                            </div>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2">${cert.title}</h3>
                        <p class="text-base-content/60 mb-4">${cert.date}</p>
                        <div class="flex flex-wrap gap-2">
                            ${cert.tags.map(tag => `
                                <span class="badge ${tagColors[tag]} border-2 text-xs">
                                    ${tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            if (placeholder) {
                placeholder.innerHTML = certCard;
            }
        } catch (error) {
            console.error('Error displaying certificate:', error);
            if (placeholder) {
                placeholder.innerHTML = `
                    <div class="bg-base-100 dark:bg-base-800 rounded-lg p-6 text-center">
                        <i class="fas fa-exclamation-circle text-3xl text-error mb-4"></i>
                        <p>Failed to load certificate</p>
                    </div>
                `;
            }
        } finally {
            loadedCount++;
            if (loadedCount === certsToDisplay.length) {
                const remainingItems = filteredCertificates.length - endIndex;
                if (loadMoreBtn) {
                    loadMoreBtn.style.display = remainingItems > 0 ? 'block' : 'none';
                    loadMoreBtn.innerHTML = 'Load More <i class="fas fa-arrow-down ml-2"></i>';
                    loadMoreBtn.disabled = false;
                }
                certificateConfig.isLoading = false;
            }
        }
    });
}

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

    const existingModal = document.getElementById('cert_modal');
    if (existingModal) {
        existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('cert_modal');
    const certImage = document.getElementById('cert-image');
    const loadingIndicator = document.getElementById('cert-loading');

    modal.showModal();

    certImage.onload = function() {
        certImage.classList.remove('opacity-0');
        loadingIndicator.classList.add('hidden');
    };
    
    certImage.src = imageUrl;
};

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

window.loadMoreCertificates = function() {
    certificateConfig.currentPage++;
    displayCertificates(true);
};

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
    
    updateThemeIcons();
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
    });
}

function setupMobileMenu() {
    const menuButton = document.querySelector('.md\\:hidden');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeButton = document.getElementById('closeMobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    function toggleMenu() {
        mobileMenu.classList.toggle('hidden');
        setTimeout(() => {
            mobileMenu.classList.toggle('opacity-0');
        }, 10);
    }

    menuButton.addEventListener('click', toggleMenu);
    closeButton.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
            link.classList.add('translate-x-4', 'opacity-0');
            setTimeout(() => {
                link.classList.remove('translate-x-4', 'opacity-0');
            }, 300);
        });
    });
}

function setupCertificateFilters() {
    const filterButtons = document.querySelectorAll('.tag-filter');
    const certificatesGrid = document.querySelector('.certificates-grid');
    const activeTagDisplay = document.getElementById('currentTag');
    const clearFilterBtn = document.getElementById('clearFilter');
    
    function updateActiveTagDisplay(tag) {
        const tagName = tagLabels[tag] || 'All Certificates';
        activeTagDisplay.textContent = tagName;
        activeTagDisplay.className = `badge badge-lg ${tag !== 'all' ? tagColors[tag] : 'border-base-300'} border-2`;
        clearFilterBtn.style.display = tag !== 'all' ? 'inline-flex' : 'none';
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const tag = button.dataset.tag;
            
            // Remove active state from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-opacity-20');
            });
            
            // Add active state to clicked button
            button.classList.add('active');
            button.classList.add('bg-opacity-20');
            
            // Update the active tag display
            updateActiveTagDisplay(tag);
            
            // Add transition class
            certificatesGrid.classList.add('filtering');
            
            // Update active tag
            certificateConfig.activeTag = tag;
            certificateConfig.currentPage = 1;
            
            // Wait for fade out
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Update display
            displayCertificates();
            
            // Remove transition class after new content is loaded
            setTimeout(() => {
                certificatesGrid.classList.remove('filtering');
            }, 300);
        });
    });
    
    // Clear filter button handler
    clearFilterBtn.addEventListener('click', () => {
        const allButton = document.querySelector('.tag-filter[data-tag="all"]');
        allButton.click();
    });
    
    // Set initial active state
    const defaultButton = document.querySelector('.tag-filter[data-tag="all"]');
    if (defaultButton) {
        defaultButton.classList.add('active', 'bg-opacity-20');
        updateActiveTagDisplay('all');
    }
}

function initializeApp() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            smoothScroll(targetId);
        });
    });

    initTypingAnimation();
    setupThemeToggle();
    displayProjects();
    displayCertificates();
    setupMobileMenu();
    setupCertificateFilters();
}

document.addEventListener('DOMContentLoaded', () => {
    simulateLoading();
});

window.addEventListener('unload', cleanupCertificates, { passive: true });
