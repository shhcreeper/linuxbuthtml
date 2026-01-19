// Global state
let zIndexCounter = 100;
let draggedElement = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isDraggingWindow = false;
let isDraggingIcon = false;
let isDraggingCat = false;
let activeWindow = null;
let startMenuOpen = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeClock();
    initializeWindows();
    initializeDesktopIcons();
    initializeTaskbar();
    initializeCat();
    
    // Close start menu when clicking outside
    document.addEventListener('click', (e) => {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        if (startMenuOpen && !startMenu.contains(e.target) && !startButton.contains(e.target)) {
            toggleStartMenu();
        }
    });
});

// Clock functionality
function initializeClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    clock.textContent = `${hours}:${minutes} ${ampm}`;
}

// Window management
function initializeWindows() {
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(window => {
        // Close button
        const closeBtn = window.querySelector('.close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeWindow(window);
        });
        
        // Minimize button
        const minimizeBtn = window.querySelector('.minimize');
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            minimizeWindow(window);
        });
        
        // Maximize button
        const maximizeBtn = window.querySelector('.maximize');
        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            maximizeWindow(window);
        });
        
        // Dragging
        const titlebar = window.querySelector('.window-titlebar');
        titlebar.addEventListener('mousedown', (e) => {
            if (e.target === titlebar || e.target.classList.contains('window-title')) {
                startDraggingWindow(window, e);
            }
        });
        
        // Bring to front on click
        window.addEventListener('mousedown', () => {
            bringToFront(window);
        });
    });
    
    // Global mouse events for dragging
    document.addEventListener('mousemove', (e) => {
        if (isDraggingWindow && draggedElement) {
            const x = e.clientX - dragOffsetX;
            const y = e.clientY - dragOffsetY;
            draggedElement.style.left = Math.max(0, Math.min(x, window.innerWidth - 300)) + 'px';
            draggedElement.style.top = Math.max(0, Math.min(y, window.innerHeight - 200)) + 'px';
        } else if (isDraggingIcon && draggedElement) {
            const x = e.clientX - dragOffsetX;
            const y = e.clientY - dragOffsetY;
            draggedElement.style.left = Math.max(0, x) + 'px';
            draggedElement.style.top = Math.max(0, y) + 'px';
        } else if (isDraggingCat && draggedElement) {
            const x = e.clientX - dragOffsetX;
            const y = e.clientY - dragOffsetY;
            draggedElement.style.left = Math.max(0, Math.min(x, window.innerWidth - 100)) + 'px';
            draggedElement.style.top = Math.max(0, Math.min(y, window.innerHeight - 120)) + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDraggingWindow = false;
        isDraggingIcon = false;
        isDraggingCat = false;
        draggedElement = null;
    });
}

function startDraggingWindow(window, e) {
    isDraggingWindow = true;
    draggedElement = window;
    const rect = window.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    bringToFront(window);
}

function openWindow(windowId) {
    const window = document.getElementById(windowId);
    if (!window) return;
    
    window.classList.add('active');
    
    // Center window if not positioned
    if (!window.style.left) {
        window.style.left = (window.innerWidth / 2 - 300) + 'px';
        window.style.top = (window.innerHeight / 2 - 200) + 'px';
        window.style.width = '500px';
        window.style.height = '400px';
    }
    
    bringToFront(window);
    updateTaskbar();
}

function closeWindow(window) {
    window.classList.remove('active');
    updateTaskbar();
}

function minimizeWindow(window) {
    window.classList.remove('active');
    updateTaskbar();
}

function maximizeWindow(window) {
    if (window.classList.contains('maximized')) {
        window.classList.remove('maximized');
        window.style.left = window.dataset.oldLeft || '100px';
        window.style.top = window.dataset.oldTop || '100px';
        window.style.width = window.dataset.oldWidth || '500px';
        window.style.height = window.dataset.oldHeight || '400px';
    } else {
        window.dataset.oldLeft = window.style.left;
        window.dataset.oldTop = window.style.top;
        window.dataset.oldWidth = window.style.width;
        window.dataset.oldHeight = window.style.height;
        
        window.classList.add('maximized');
        window.style.left = '0';
        window.style.top = '0';
        window.style.width = '100%';
        window.style.height = 'calc(100vh - 40px)';
    }
}

function bringToFront(window) {
    zIndexCounter++;
    window.style.zIndex = zIndexCounter;
    activeWindow = window;
}

// Desktop icons
function initializeDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    
    icons.forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const windowId = icon.dataset.window + '-window';
            openWindow(windowId);
        });
        
        icon.addEventListener('mousedown', (e) => {
            if (e.detail === 1) {
                // Deselect all other icons
                icons.forEach(i => i.classList.remove('selected'));
                icon.classList.add('selected');
                
                // Start dragging
                isDraggingIcon = true;
                draggedElement = icon;
                const rect = icon.getBoundingClientRect();
                dragOffsetX = e.clientX - rect.left;
                dragOffsetY = e.clientY - rect.top;
            }
        });
    });
}

// Taskbar
function initializeTaskbar() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });
    
    updateTaskbar();
}

function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    startMenuOpen = !startMenuOpen;
    
    if (startMenuOpen) {
        startMenu.classList.remove('hidden');
    } else {
        startMenu.classList.add('hidden');
    }
}

function updateTaskbar() {
    const taskbarButtons = document.getElementById('taskbar-buttons');
    taskbarButtons.innerHTML = '';
    
    const activeWindows = document.querySelectorAll('.window.active');
    
    activeWindows.forEach(window => {
        const button = document.createElement('button');
        button.className = 'taskbar-btn';
        button.textContent = window.querySelector('.window-title').textContent;
        
        button.addEventListener('click', () => {
            if (window.style.display === 'none') {
                window.style.display = 'block';
            }
            bringToFront(window);
        });
        
        taskbarButtons.appendChild(button);
    });
}

// Black Cat Pet
let catMessages = [
    "Hi there! I'm your friendly Linux/5 assistant! 😺",
    "Did you know? Windows XP was released in 2001!",
    "Try double-clicking the desktop icons!",
    "Meow! Having a great day?",
    "Fun fact: Cats sleep 70% of their lives! 😴",
    "I'm here to help make your experience purrfect!",
    "Click on me for a surprise! 🐱",
    "The Start menu has lots of cool options!",
    "I love being your desktop companion!",
    "Psst... drag me anywhere you like!",
    "Did you know cats have over 20 vocalizations?",
    "This XP theme brings back memories, doesn't it?",
    "Let me know if you need any help navigating!",
    "Remember to take breaks and stretch! 🤸",
    "You're doing great! Keep exploring!",
];

let lastCatMessageIndex = -1;
let catMessageTimeout = null;

function initializeCat() {
    const cat = document.getElementById('cat-pet');
    const speechBubble = document.getElementById('cat-speech-bubble');
    
    // Show welcome message after a delay
    setTimeout(() => {
        showCatMessage("Hi there! I'm your friendly Linux/5 assistant! 😺");
    }, 2000);
    
    // Random messages every 30-60 seconds
    scheduleNextCatMessage();
    
    // Click interaction
    cat.addEventListener('click', (e) => {
        if (!isDraggingCat) {
            showRandomCatMessage();
            // Small bounce animation
            cat.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cat.style.transform = 'scale(1)';
            }, 200);
        }
    });
    
    // Dragging
    cat.addEventListener('mousedown', (e) => {
        isDraggingCat = true;
        draggedElement = cat;
        const rect = cat.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
    });
    
    // Mouse following (subtle effect)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (e) => {
        if (!isDraggingCat) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }
    });
    
    // Occasionally look towards mouse
    setInterval(() => {
        if (!isDraggingCat) {
            const catRect = cat.getBoundingClientRect();
            const catX = catRect.left + catRect.width / 2;
            const catY = catRect.top + catRect.height / 2;
            
            const dx = mouseX - catX;
            const dy = mouseY - catY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // If mouse is reasonably close, make cat "look" towards it
            if (distance < 500) {
                const angle = Math.atan2(dy, dx);
                const tilt = angle * 5; // Subtle tilt
                cat.style.transform = `rotate(${Math.max(-10, Math.min(10, tilt))}deg)`;
            } else {
                cat.style.transform = 'rotate(0deg)';
            }
        }
    }, 1000);
}

function showCatMessage(message) {
    const speechBubble = document.getElementById('cat-speech-bubble');
    const speechText = speechBubble.querySelector('.speech-text');
    
    speechText.textContent = message;
    speechBubble.classList.remove('hidden');
    
    // Hide after 8 seconds
    if (catMessageTimeout) {
        clearTimeout(catMessageTimeout);
    }
    
    catMessageTimeout = setTimeout(() => {
        speechBubble.classList.add('hidden');
    }, 8000);
}

function showRandomCatMessage() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * catMessages.length);
    } while (randomIndex === lastCatMessageIndex && catMessages.length > 1);
    
    lastCatMessageIndex = randomIndex;
    showCatMessage(catMessages[randomIndex]);
}

function scheduleNextCatMessage() {
    const delay = 30000 + Math.random() * 30000; // 30-60 seconds
    setTimeout(() => {
        showRandomCatMessage();
        scheduleNextCatMessage();
    }, delay);
}

// Add some start menu interactions
document.addEventListener('DOMContentLoaded', () => {
    const startMenuItems = document.querySelectorAll('.start-menu-item');
    
    startMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.textContent.includes('Turn Off')) {
                showCatMessage("Don't leave! We're having so much fun! 😿");
            } else if (item.textContent.includes('Games')) {
                showCatMessage("Games are fun! But you're already playing the best one! 🎮");
            } else if (item.textContent.includes('Help')) {
                showCatMessage("I'm here to help! Just click on me anytime! 💡");
            } else {
                showCatMessage("That feature isn't available yet, but I'll keep you company! 😸");
            }
            toggleStartMenu();
        });
    });
});
