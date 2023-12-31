/**
 * Notification.js - A simple notification library by Crowelian
 * 
 * Usage:
 * 
 * 1. Include this script in your HTML file:
 *    <script src="notification.js"></script>
 * 
 * 2. Add a container for notifications in your HTML:
 *    <div id="notification-container"></div>
 * 
 * 3. Style your notifications using CSS. See example styles in the notification CSS file.
 *    - add it to your HEAD: <link rel="stylesheet" href="notification.css">
 * 
 * 4. Use the `showNotification` function to display notifications:
 * 
 *    - To show a message notification for 5 seconds:
 *      showNotification('message', 'This is a message');
 * 
 *    - To show a warning notification for 3 seconds:
 *      showNotification('warning', 'This is a warning', 3000);
 * 
 *    - To show an error notification for 7 seconds:
 *      showNotification('error', 'This is an error', 7000);
 * 
 */


function showNotification(type, text, duration = 5000) {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const closeButton = document.createElement('span');
    closeButton.innerHTML = '❌';
    closeButton.className = 'close-button';
    closeButton.onclick = function () {
        notificationContainer.removeChild(notification);
    };

    const timerBar = document.createElement('div');
    timerBar.className = 'timer-bar';
    timerBar.style.width = '100%';

    notification.innerHTML = `<span class="icon">${getIcon(type)}</span> ${text}`;

    notification.appendChild(closeButton);
    notification.appendChild(timerBar);

    notificationContainer.appendChild(notification);

    // Initialize timer bar animation
    let startTime = null;
    function animate(time) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const width = 100 - (elapsed / duration * 100);
        timerBar.style.width = `${Math.max(width, 0)}%`;
        if (elapsed < duration) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);

    setTimeout(() => {
        notificationContainer.removeChild(notification);
    }, duration);
}

function getIcon(type) {
    switch (type) {
        case 'message':
            return '✔️';
        case 'warning':
            return '⚠️';
        case 'error':
            return '❌';
        default:
            return '';
    }
}
