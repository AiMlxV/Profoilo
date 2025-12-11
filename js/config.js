// Theme bootstrap early to avoid flash
(function () {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    const theme = storedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('transition', 'none');
    window.addEventListener('load', () => {
        document.documentElement.style.removeProperty('transition');
    });
})();

// Tailwind config must be defined before the CDN script runs
window.tailwind = window.tailwind || {};
window.tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                custom: ['LINESeedSansTH', 'sans-serif'],
            },
        },
    },
};

// Plausible queue stub
window.plausible = window.plausible || function () {
    (window.plausible.q = window.plausible.q || []).push(arguments);
};

// Footer year helper
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
