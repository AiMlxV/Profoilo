const loadingConfig = {
    minLoadTime: 2500,
    progressInterval: 30,
    loadingMessages: [
        "🖥️กำลังเปิดเครื่อง...",
        "🛜เชื่อมต่อกับอินเตอร์เน็ต...",
        "🍵เตรียมกาแฟ...",
        "😊เกือบจะเสร็จแล้ว...",
        "😄เสร็จแล้ว..."
    ],
    storageKey: 'lastLoadTime',
    expirationTime: 60 * 60 * 1000
};

function shouldShowLoading() {
    const lastLoad = localStorage.getItem(loadingConfig.storageKey);
    if (!lastLoad) return true;

    const now = Date.now();
    const timeSinceLastLoad = now - parseInt(lastLoad, 10);
    return timeSinceLastLoad > loadingConfig.expirationTime;
}

export function simulateLoading(onReady) {
    if (typeof onReady !== 'function') return;

    const loadingOverlay = document.getElementById('loading-overlay');
    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');

    if (!loadingOverlay || !progressBar || !loadingText) {
        document.body.style.visibility = 'visible';
        onReady();
        return;
    }

    if (!shouldShowLoading()) {
        document.body.style.visibility = 'visible';
        loadingOverlay.style.display = 'none';
        onReady();
        return;
    }

    const startTime = Date.now();
    document.body.style.visibility = 'hidden';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.opacity = '1';
    loadingOverlay.style.visibility = 'visible';

    const finishLoading = () => {
        progressBar.value = 100;
        loadingText.textContent = 'Welcome!';
        localStorage.setItem(loadingConfig.storageKey, Date.now().toString());

        setTimeout(() => {
            document.body.style.visibility = 'visible';
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                onReady();
            }, 800);
        }, 200);
    };

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

    requestAnimationFrame(updateProgress);
}
