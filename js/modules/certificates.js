const tagLabels = {
    all: 'ทั้งหมด',
    robotics: 'Robotics',
    coding: 'Coding',
    camp: 'Camps',
    contest: 'Contests',
    ai: 'AI',
    stem: 'STEM'
};

const tagIcons = {
    all: 'fa-th-large',
    robotics: 'fa-robot',
    coding: 'fa-code',
    camp: 'fa-campground',
    contest: 'fa-trophy',
    ai: 'fa-brain',
    stem: 'fa-atom'
};

const tagColors = {
    robotics: 'border-red-500',
    coding: 'border-blue-500',
    camp: 'border-green-500',
    contest: 'border-yellow-500',
    ai: 'border-cyan-500',
    stem: 'border-purple-500'
};

const certificateConfig = {
    itemsPerPage: 6,
    currentPage: 1,
    isLoading: false,
    activeTag: 'all',
    grid: null,
    loadMoreBtn: null,
    activeTagDisplay: null,
    clearFilterBtn: null,
    filterButtons: []
};

function refreshAOS() {
    if (window.AOS && typeof window.AOS.refreshHard === 'function') {
        window.AOS.refreshHard();
    } else if (window.AOS && typeof window.AOS.refresh === 'function') {
        window.AOS.refresh();
    }
}

function createLoadingCard(index) {
    const wrapper = document.createElement('div');
    wrapper.dataset.index = index.toString();
    wrapper.innerHTML = `
        <div class="bg-base-200 rounded-2xl overflow-hidden shadow-lg border-2 border-base-300 p-6 flex flex-col items-center justify-center min-h-[350px] animate-pulse">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="mt-4 text-base-content/70 font-semibold">Loading...</p>
        </div>
    `;
    return wrapper;
}

function createThumbnail(originalUrl) {
    return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = function () {
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

        img.onerror = function () {
            console.warn('Image load failed:', originalUrl);
            resolve('https://placehold.com/400x300?text=Certificate+Image+Not+Available');
        };

        setTimeout(() => {
            resolve('https://placehold.com/400x300?text=Loading+Timeout');
        }, 5000);

        img.src = originalUrl;
    });
}

function openCertificateModal(imageUrl, title) {
    const modalHTML = `
        <dialog id="cert_modal" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box bg-base-100 p-0 relative max-w-4xl shadow-2xl">
                <div class="p-6 flex justify-between items-center border-b-2 border-base-300 bg-base-200">
                    <h3 class="font-bold text-2xl">${title}</h3>
                    <form method="dialog">
                        <button class="btn btn-circle btn-ghost btn-lg hover:btn-error transition-all">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </form>
                </div>
                <figure class="w-full relative bg-base-200">
                    <div id="cert-loading" class="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <span class="loading loading-spinner loading-lg text-primary"></span>
                        <p class="text-base-content/70">Loading certificate...</p>
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
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('cert_modal');
    const certImage = document.getElementById('cert-image');
    const loadingIndicator = document.getElementById('cert-loading');

    if (!modal || !certImage || !loadingIndicator) return;

    modal.showModal();
    certImage.onload = () => {
        certImage.classList.remove('opacity-0');
        loadingIndicator.classList.add('hidden');
    };
    certImage.src = imageUrl;
}

function buildCertificateCard(cert, thumbnailUrl, animationDelay, borderColor) {
    const card = document.createElement('div');
    card.className = `group bg-base-100 rounded-2xl overflow-hidden shadow-lg border-2 ${borderColor} transform transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl cursor-zoom-in animate-card-in`;
    card.style.animationDelay = `${animationDelay}ms`;
    card.dataset.aos = 'fade-up';

    card.innerHTML = `
        <div class="relative overflow-hidden">
            <img src="${thumbnailUrl}" 
                 alt="${cert.title}" 
                 class="w-full h-52 object-cover transform transition-transform duration-500 group-hover:scale-110" 
                 loading="lazy"
                 onerror="this.src='https://placehold.co/400x300?text=Image+Not+Available'">
            <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                <div class="w-full h-full flex items-center justify-center">
                    <i class="fas fa-search-plus text-4xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110"></i>
                </div>
            </div>
        </div>
        <div class="p-6">
            <h3 class="text-xl font-bold mb-3 group-hover:text-primary transition-colors">${cert.title}</h3>
            <p class="text-base-content/60 mb-4 flex items-center gap-2">
                <i class="far fa-calendar text-primary"></i>
                ${cert.date}
            </p>
            <div class="flex flex-wrap gap-2">
                ${(cert.tags || []).map(tag => `
                    <span class="badge ${tagColors[tag] || 'border-base-300'} border-2 text-xs font-semibold px-3 py-2">
                        ${tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </span>
                `).join('')}
            </div>
        </div>
    `;

    card.addEventListener('click', () => openCertificateModal(cert.image, cert.title));
    return card;
}

function updateLoadMoreState(filteredCertificates, endIndex) {
    const remainingItems = filteredCertificates.length - endIndex;
    const { loadMoreBtn } = certificateConfig;
    if (!loadMoreBtn) return;

    loadMoreBtn.style.display = remainingItems > 0 ? 'block' : 'none';
    loadMoreBtn.disabled = false;
    loadMoreBtn.innerHTML = remainingItems > 0
        ? '<i class="fas fa-arrow-down mr-2"></i> Load More <i class="fas fa-arrow-down ml-2"></i>'
        : '';
}

async function displayCertificates(certificates, isLoadMore = false) {
    const { grid, loadMoreBtn, itemsPerPage, activeTag } = certificateConfig;
    if (!grid || certificateConfig.isLoading) return;

    certificateConfig.isLoading = true;

    if (loadMoreBtn) {
        loadMoreBtn.innerHTML = '<span class="loading loading-spinner loading-sm"></span> Loading...';
        loadMoreBtn.disabled = true;
    }

    if (!isLoadMore) {
        grid.innerHTML = '';
        certificateConfig.currentPage = 1;
    }

    const filteredCertificates = certificates.filter(cert =>
        activeTag === 'all' || (cert.tags && cert.tags.includes(activeTag))
    );

    if (filteredCertificates.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-search text-4xl mb-4 opacity-50"></i>
                <p class="text-lg opacity-70">No certificates found for this category</p>
            </div>
        `;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        certificateConfig.isLoading = false;
        return;
    }

    const startIndex = (certificateConfig.currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredCertificates.length);
    const placeholdersNeeded = endIndex - startIndex;

    for (let i = 0; i < placeholdersNeeded; i++) {
        const placeholder = createLoadingCard(startIndex + i);
        grid.appendChild(placeholder);
    }

    const certsToDisplay = filteredCertificates.slice(startIndex, endIndex);
    try {
        const results = await Promise.all(
            certsToDisplay.map(async (cert, index) => {
                const thumbnailUrl = await createThumbnail(cert.image);
                const borderColor = activeTag !== 'all'
                    ? tagColors[activeTag]
                    : tagColors[cert.tags?.[0]] || 'border-base-300';
                const animationDelay = Math.min(((startIndex + index) % 6) * 80, 480);
                return { cert, thumbnailUrl, borderColor, animationDelay, index };
            })
        );

        results.forEach(result => {
            const placeholder = grid.querySelector(`[data-index="${startIndex + result.index}"]`);
            if (!placeholder) return;
            const card = buildCertificateCard(result.cert, result.thumbnailUrl, result.animationDelay, result.borderColor);
            placeholder.replaceWith(card);
        });
    } catch (error) {
        console.error('Error displaying certificates:', error);
    } finally {
        updateLoadMoreState(filteredCertificates, endIndex);
        certificateConfig.isLoading = false;
        refreshAOS();
    }
}

function updateActiveTagDisplay(tag) {
    const tagName = tagLabels[tag] || 'All Certificates';
    const iconClass = tagIcons[tag] || 'fa-th-large';

    if (certificateConfig.activeTagDisplay) {
        certificateConfig.activeTagDisplay.innerHTML = `<i class="fas ${iconClass}"></i> ${tagName}`;
        certificateConfig.activeTagDisplay.className = `badge badge-lg ${tag !== 'all' ? tagColors[tag] : 'border-base-300'} border-2`;
    }

    if (certificateConfig.clearFilterBtn) {
        certificateConfig.clearFilterBtn.style.display = tag !== 'all' ? 'inline-flex' : 'none';
    }

    if (certificateConfig.filterButtons.length) {
        certificateConfig.filterButtons.forEach(btn => {
            const isSelected = btn.dataset.tag === tag;
            btn.classList.toggle('active', isSelected);
            btn.classList.toggle('bg-opacity-20', isSelected);
            if (tag === 'all') {
                btn.classList.remove('hidden');
            } else {
                btn.classList.toggle('hidden', isSelected);
            }
        });
    }
}

function setupCertificateFilters(certificates, cleanupFns) {
    const { filterButtons, clearFilterBtn, grid } = certificateConfig;
    if (!filterButtons.length || !grid) return;

    const handleFilterClick = (event) => {
        const button = event.currentTarget;
        const tag = button.dataset.tag;
        certificateConfig.activeTag = tag;
        certificateConfig.currentPage = 1;
        updateActiveTagDisplay(tag);
        grid.classList.add('filtering');
        displayCertificates(certificates);
        setTimeout(() => grid.classList.remove('filtering'), 300);
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
        cleanupFns.push(() => button.removeEventListener('click', handleFilterClick));
    });

    if (clearFilterBtn) {
        const clearHandler = () => {
            certificateConfig.activeTag = 'all';
            certificateConfig.currentPage = 1;
            updateActiveTagDisplay('all');
            grid.classList.add('filtering');
            displayCertificates(certificates);
            setTimeout(() => grid.classList.remove('filtering'), 300);
        };
        clearFilterBtn.addEventListener('click', clearHandler);
        cleanupFns.push(() => clearFilterBtn.removeEventListener('click', clearHandler));
    }

    updateActiveTagDisplay('all');
}

export function setupCertificates(certificates) {
    certificateConfig.grid = document.querySelector('.certificates-grid');
    certificateConfig.loadMoreBtn = document.getElementById('loadMoreBtn');
    certificateConfig.activeTagDisplay = document.getElementById('currentTag');
    certificateConfig.clearFilterBtn = document.getElementById('clearFilter');
    certificateConfig.filterButtons = Array.from(document.querySelectorAll('.tag-filter'));

    const cleanupFns = [];

    if (!certificateConfig.grid) return () => {};

    if (certificateConfig.loadMoreBtn) {
        const handleLoadMore = () => {
            certificateConfig.currentPage++;
            displayCertificates(certificates, true);
        };
        certificateConfig.loadMoreBtn.addEventListener('click', handleLoadMore);
        cleanupFns.push(() => certificateConfig.loadMoreBtn.removeEventListener('click', handleLoadMore));
    }

    setupCertificateFilters(certificates, cleanupFns);
    displayCertificates(certificates);

    return () => {
        cleanupFns.forEach(fn => fn());
    };
}
