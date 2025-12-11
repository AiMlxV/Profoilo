(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = storedTheme || (prefersDark ? 'dark' : 'light');
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    html.classList.toggle('dark', theme === 'dark');
    html.style.colorScheme = theme;
})();
