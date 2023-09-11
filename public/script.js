let editor = document.getElementById('editor');
let isNightMode = false;

// Initial check and set event listeners
updateOnlineStatus();
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    const statusElement = document.getElementById('status');
    if (navigator.onLine) {
        statusElement.textContent = 'Online';
        statusElement.style.color = 'green';
    } else {
        statusElement.textContent = 'Offline';
        statusElement.style.color = 'red';
    }
}

function newPage() {
    editor.value = '';
    saveContent();
}

function downloadPage() {
    const blob = new Blob([editor.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function copyPage() {
    editor.select();
    document.execCommand('copy');
}

function toggleTheme() {
    isNightMode = !isNightMode;
    document.body.classList.toggle('night-mode');
    editor.classList.toggle('night-mode');
}

let showCounter = true;

// Initialize counter and line height
updateCounter();
editor.style.lineHeight = "1.6";

editor.addEventListener('input', () => {
    if (showCounter) {
        updateCounter();
    }
});

function updateCounter() {
    const text = editor.value;
    const charCount = text.length;
    const wordCount = text.split(/\s/).filter(Boolean).length;
    document.getElementById('counter').textContent = `Characters: ${charCount}, Words: ${wordCount}`;
}

function showSettings() {
    document.getElementById('settingsOverlay').style.display = 'block';
    document.getElementById('lineHeight').value = editor.style.lineHeight;
    document.getElementById('showCounter').checked = showCounter;
}

function closeSettings() {
    document.getElementById('settingsOverlay').style.display = 'none';
    editor.style.lineHeight = document.getElementById('lineHeight').value;
    showCounter = document.getElementById('showCounter').checked;
    if (showCounter) {
        updateCounter();
    } else {
        document.getElementById('counter').textContent = '';
    }
}

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
}

// Load content from localStorage
window.addEventListener('load', () => {
    const savedContent = localStorage.getItem('savedContent');
    if (savedContent) {
        editor.value = savedContent;
        updateCounter();
    }
});

// Save content to localStorage
editor.addEventListener('input', () => {
    saveContent();
});

function saveContent() {
    localStorage.setItem('savedContent', editor.value);
    if (showCounter) {
        updateCounter();
    }
}