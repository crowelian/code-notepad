let editor = document.getElementById('editor');
let isNightMode = false;

// Initialization
updateOnlineStatus();

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    const statusElement = document.getElementById('status');
    const statusIcon = document.getElementById('statusIcon');

    if (navigator.onLine) {
        statusIcon.className = 'ri-wifi-fill';
        statusElement.style.color = 'green';
    } else {
        statusIcon.className = 'ri-wifi-off-fill';
        statusElement.style.color = 'red';
    }
}

function updateDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('fi-FI');
    const dateTimeString = `${day}.${month}.${year} ${time}`;
    const dateTimeElement = document.getElementById('dateTime');

    dateTimeElement.textContent = dateTimeString;

    dateTimeElement.style.color = isNightMode ? 'white' : 'black';
}

updateDateTime();

setInterval(updateDateTime, 1000);

updateDateTime();

setInterval(updateDateTime, 1000);

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

document.getElementById('fileInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        try {
            const reader = new FileReader();

            reader.addEventListener('load', function () {
                document.getElementById('editor').value = this.result;
                saveContent();
            });

            reader.readAsText(file);
        }
        catch {
            console.error("Error opening file...");
        }
    }
});


function copyPage() {
    editor.select();
    document.execCommand('copy');
}

function toggleTheme() {
    const themeIcon = document.getElementById('themeIcon');
    const editor = document.getElementById('editor');
    const toolbar = document.getElementById('toolbar');
    const toolbarButtons = document.querySelectorAll('#toolbar button');
    const currentClass = themeIcon.className;

    // Toggle night mode
    isNightMode = !isNightMode;
    document.body.classList.toggle('night-mode');
    editor.classList.toggle('night-mode');
    toolbar.classList.toggle('night-mode');

    toolbarButtons.forEach(button => button.classList.toggle('night-mode-button'));


    if (currentClass === 'ri-moon-line') {
        // Switch to day mode
        themeIcon.className = 'ri-sun-line';
    } else {
        // Switch to night mode
        themeIcon.className = 'ri-moon-line';
    }
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