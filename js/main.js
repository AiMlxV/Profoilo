import { projects } from '../data/projects.js';
import { certificates } from '../data/certificates.js';
import { simulateLoading } from './modules/loading.js';
import { initTypingAnimation } from './modules/typing.js';
import { setupThemeToggle } from './modules/theme.js';
import { setupMobileMenu, setupAnchorScrolling, setupScrollToTop } from './modules/navigation.js';
import { displayProjects } from './modules/projects.js';
import { setupCertificates } from './modules/certificates.js';

function revealHeroText() {
    const heroTexts = document.querySelectorAll('#home h1, #home h2, #home p');
    heroTexts.forEach((el, i) => {
        el.classList.add('reveal-up');
        el.style.animationDelay = `${i * 100}ms`;
    });
}

function initializeApp() {
    if (window.AOS) {
        window.AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-quart',
            offset: 80
        });
    }

    setupAnchorScrolling();
    initTypingAnimation();
    setupThemeToggle();
    displayProjects(projects);
    const cleanupCertificates = setupCertificates(certificates);
    setupMobileMenu();
    setupScrollToTop();
    revealHeroText();

    return { cleanupCertificates };
}

document.fonts.ready.then(() => {
    if (document.fonts.check('1em LINESeedSansTH')) {
        console.log('LINESeedSansTH font loaded successfully');
    } else {
        console.warn('LINESeedSansTH font failed to load');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    simulateLoading(() => {
        const { cleanupCertificates } = initializeApp();
        window.addEventListener('unload', cleanupCertificates, { passive: true });
    });
});
