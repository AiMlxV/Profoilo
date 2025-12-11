function smoothScroll(targetId) {
    const targetSection = document.querySelector(targetId);
    const nav = document.querySelector('nav');
    const navHeight = nav ? nav.offsetHeight : 0;

    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop - navHeight,
            behavior: 'smooth'
        });
    }
}

export function setupAnchorScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');
            if (!targetId) return;
            event.preventDefault();
            smoothScroll(targetId);
        });
    });
}

export function setupMobileMenu() {
    const menuButton = document.querySelector('.md\\:hidden');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeButton = document.getElementById('closeMobileMenu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    if (!menuButton || !mobileMenu || !closeButton) return;

    const toggleMenu = () => {
        mobileMenu.classList.toggle('hidden');
        setTimeout(() => {
            mobileMenu.classList.toggle('opacity-0');
        }, 10);
    };

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

export function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollTop');
    if (!scrollBtn) return;

    const onScroll = () => {
        const show = window.scrollY > 600;
        scrollBtn.classList.toggle('visible', show);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

export function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return () => {};

    const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"], #mobileMenu a[href^="#"]'));
    const linkById = new Map();

    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;
        linkById.set(targetId.replace('#', ''), link);
    });

    const setActive = id => {
        linkById.forEach((link, key) => {
            const isActive = key === id;
            link.classList.toggle('nav-link-active', isActive);
        });
    };

    const initialId = location.hash ? location.hash.replace('#', '') : sections[0].id;
    setActive(initialId);

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, {
        threshold: 0.4,
        rootMargin: '-10% 0px -40%'
    });

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
}
