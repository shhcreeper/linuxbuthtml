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
let bootSequenceCompleted = false;

// Theme System
const themes = {
    'luna-blue': {
        name: 'Luna Blue',
        taskbar: 'linear-gradient(to bottom, #3168d5, #1941a5)',
        titlebar: 'linear-gradient(to bottom, #0a246a, #0a246a, #3168d5)',
        titlebarInactive: 'linear-gradient(to bottom, #7f95bd, #7f95bd, #a9c1de)',
        startButton: 'linear-gradient(to bottom, #3c8f3c, #2d6b2d)',
        windowBorder: '#0a246a',
        buttonFace: '#ece9d8',
        menuBg: '#ffffff',
        desktop: 'radial-gradient(ellipse at center top, #5A8CC7 0%, #3A6EA5 100%)',
        textColor: '#000000'
    },
    'luna-olive': {
        name: 'Luna Olive',
        taskbar: 'linear-gradient(to bottom, #7b9971, #4e6548)',
        titlebar: 'linear-gradient(to bottom, #5a7852, #5a7852, #8cb084)',
        titlebarInactive: 'linear-gradient(to bottom, #9db09a, #9db09a, #c0d2bd)',
        startButton: 'linear-gradient(to bottom, #7b9971, #4e6548)',
        windowBorder: '#5a7852',
        buttonFace: '#ece9d8',
        menuBg: '#ffffff',
        desktop: 'radial-gradient(ellipse at center top, #8FAA7E 0%, #6B8860 100%)',
        textColor: '#000000'
    },
    'luna-silver': {
        name: 'Luna Silver',
        taskbar: 'linear-gradient(to bottom, #9db3c7, #7492ab)',
        titlebar: 'linear-gradient(to bottom, #5b7b97, #5b7b97, #9db3c7)',
        titlebarInactive: 'linear-gradient(to bottom, #a8b8c8, #a8b8c8, #d0dce5)',
        startButton: 'linear-gradient(to bottom, #6b8ba3, #4a6a82)',
        windowBorder: '#5b7b97',
        buttonFace: '#e5e5e5',
        menuBg: '#ffffff',
        desktop: 'radial-gradient(ellipse at center top, #B4C8D9 0%, #8FA8BC 100%)',
        textColor: '#000000'
    },
    'classic': {
        name: 'Classic',
        taskbar: '#c0c0c0',
        titlebar: 'linear-gradient(to right, #000080, #1084d0)',
        titlebarInactive: 'linear-gradient(to right, #808080, #a0a0a0)',
        startButton: '#c0c0c0',
        windowBorder: '#000080',
        buttonFace: '#c0c0c0',
        menuBg: '#c0c0c0',
        desktop: '#008080',
        textColor: '#000000'
    },
    'royale': {
        name: 'Royale',
        taskbar: 'linear-gradient(to bottom, #1c3e6e, #0f2442)',
        titlebar: 'linear-gradient(to bottom, #1c3e6e, #2a5298)',
        titlebarInactive: 'linear-gradient(to bottom, #6b8ba8, #8ba8c8)',
        startButton: 'linear-gradient(to bottom, #2e7d32, #1b5e20)',
        windowBorder: '#1c3e6e',
        buttonFace: '#e8eef7',
        menuBg: '#ffffff',
        desktop: 'radial-gradient(ellipse at center top, #2B5A8C 0%, #1A3A5C 100%)',
        textColor: '#000000'
    },
    'zune': {
        name: 'Zune Dark',
        taskbar: 'linear-gradient(to bottom, #3a3a3a, #1a1a1a)',
        titlebar: 'linear-gradient(to bottom, #2d2d2d, #1a1a1a)',
        titlebarInactive: 'linear-gradient(to bottom, #4a4a4a, #3a3a3a)',
        startButton: 'linear-gradient(to bottom, #f47321, #c45a1a)',
        windowBorder: '#2d2d2d',
        buttonFace: '#3a3a3a',
        menuBg: '#2d2d2d',
        desktop: 'radial-gradient(ellipse at center top, #2d2d2d 0%, #1a1a1a 100%)',
        textColor: '#ffffff'
    },
    'high-contrast': {
        name: 'High Contrast',
        taskbar: '#000000',
        titlebar: '#000080',
        titlebarInactive: '#808080',
        startButton: '#000000',
        windowBorder: '#ffffff',
        buttonFace: '#000000',
        menuBg: '#000000',
        desktop: '#000000',
        textColor: '#ffffff'
    },
    'win11': {
        name: 'Windows 11',
        taskbar: 'rgba(243, 243, 243, 0.5)',
        titlebar: '#f3f3f3',
        titlebarInactive: '#e0e0e0',
        startButton: 'transparent',
        windowBorder: '#e0e0e0',
        buttonFace: '#f3f3f3',
        menuBg: 'rgba(242, 242, 242, 0.8)',
        desktop: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#000000',
        accent: '#0067c0',
        accentLight: '#4cc2ff',
        borderRadius: '8px',
        backdropFilter: 'blur(40px) saturate(150%)',
        menuBackdropFilter: 'blur(60px) saturate(200%)'
    }
};

function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;
    
    const root = document.documentElement;
    
    root.style.setProperty('--taskbar-bg', theme.taskbar);
    root.style.setProperty('--titlebar-bg', theme.titlebar);
    root.style.setProperty('--titlebar-inactive-bg', theme.titlebarInactive);
    root.style.setProperty('--start-button-bg', theme.startButton);
    root.style.setProperty('--window-border', theme.windowBorder);
    root.style.setProperty('--button-face', theme.buttonFace);
    root.style.setProperty('--menu-bg', theme.menuBg);
    root.style.setProperty('--desktop-bg', theme.desktop);
    root.style.setProperty('--text-color', theme.textColor);
    
    // Windows 11 specific properties
    if (theme.accent) root.style.setProperty('--accent-color', theme.accent);
    if (theme.accentLight) root.style.setProperty('--accent-light', theme.accentLight);
    if (theme.borderRadius) root.style.setProperty('--window-radius', theme.borderRadius);
    if (theme.backdropFilter) root.style.setProperty('--taskbar-blur', theme.backdropFilter);
    if (theme.menuBackdropFilter) root.style.setProperty('--menu-blur', theme.menuBackdropFilter);
    
    // Apply desktop background
    document.body.style.background = theme.desktop;
    
    // Add/remove Windows 11 theme class
    if (themeName === 'win11') {
        document.body.classList.add('theme-win11');
    } else {
        document.body.classList.remove('theme-win11');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', themeName);
    
    // Update theme display name if elements exist
    const themeNameElements = document.querySelectorAll('.current-theme-name');
    themeNameElements.forEach(el => el.textContent = theme.name);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'luna-blue';
    applyTheme(savedTheme);
}

// Boot sequence timing constants
const SKIP_ENABLE_DELAY_MS = 1000;
const BIOS_DURATION_MS = 2500;
const BOOTLOADER_DURATION_MS = 2500;
const XP_BOOT_DURATION_MS = 4000;
const WELCOME_DURATION_MS = 2000;

// Boot Sequence
function startBootSequence() {
    const bootOverlay = document.getElementById('boot-overlay');
    const biosScreen = document.getElementById('bios-screen');
    const bootloaderScreen = document.getElementById('bootloader-screen');
    const xpBootScreen = document.getElementById('xp-boot-screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const skipButton = document.getElementById('boot-skip');
    
    // Check if user wants to skip boot
    const shouldSkipBoot = localStorage.getItem('skipBootSequence') === 'true';
    if (shouldSkipBoot) {
        finishBootSequence();
        return;
    }
    
    let canSkip = false;
    let currentStage = 0;
    
    // Enable skip after delay
    setTimeout(() => {
        canSkip = true;
    }, SKIP_ENABLE_DELAY_MS);
    
    // Skip handlers
    const handleSkip = (e) => {
        // For keyboard events, only accept Enter or Space
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
            return;
        }
        
        if (canSkip && !bootSequenceCompleted) {
            bootSequenceCompleted = true;
            localStorage.setItem('skipBootSequence', 'true');
            finishBootSequence();
        }
    };
    
    skipButton.addEventListener('click', handleSkip);
    skipButton.addEventListener('keydown', handleSkip);
    document.addEventListener('keydown', handleSkip, { once: true });
    
    // Stage 1: BIOS Screen
    setTimeout(() => {
        if (!bootSequenceCompleted) {
            biosScreen.classList.remove('active');
            bootloaderScreen.classList.add('active');
            currentStage = 1;
        }
    }, BIOS_DURATION_MS);
    
    // Stage 2: Boot Loader Screen
    setTimeout(() => {
        if (!bootSequenceCompleted) {
            bootloaderScreen.classList.remove('active');
            xpBootScreen.classList.add('active');
            currentStage = 2;
        }
    }, BIOS_DURATION_MS + BOOTLOADER_DURATION_MS);
    
    // Stage 3: XP Boot Screen
    setTimeout(() => {
        if (!bootSequenceCompleted) {
            xpBootScreen.classList.remove('active');
            welcomeScreen.classList.add('active');
            currentStage = 3;
        }
    }, BIOS_DURATION_MS + BOOTLOADER_DURATION_MS + XP_BOOT_DURATION_MS);
    
    // Stage 4: Welcome Screen
    setTimeout(() => {
        if (!bootSequenceCompleted) {
            bootSequenceCompleted = true;
            finishBootSequence();
        }
    }, BIOS_DURATION_MS + BOOTLOADER_DURATION_MS + XP_BOOT_DURATION_MS + WELCOME_DURATION_MS);
}

function finishBootSequence() {
    const bootOverlay = document.getElementById('boot-overlay');
    bootOverlay.style.opacity = '0';
    setTimeout(() => {
        bootOverlay.classList.add('hidden');
        // Show cat greeting after boot
        setTimeout(() => {
            showCatMessage("Hi there! I'm your friendly Linux/5 assistant! 😺");
        }, 500);
    }, 500);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme first (before boot sequence)
    loadSavedTheme();
    
    // Start boot sequence
    startBootSequence();
    
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
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                minimizeWindow(window);
            });
        }
        
        // Maximize button
        const maximizeBtn = window.querySelector('.maximize');
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                maximizeWindow(window);
            });
        }
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
    
    // Center window if not positioned with specific sizes for each window type
    if (!window.style.left) {
        // Define window sizes based on type
        const windowSizes = {
            'browser-window': { width: 1024, height: 768 },
            'minesweeper-window': { width: 400, height: 500 },
            'solitaire-window': { width: 900, height: 700 },
            'tetris-window': { width: 550, height: 700 },
            'snake-window': { width: 500, height: 600 },
            'notepad-window': { width: 600, height: 500 },
            'calculator-window': { width: 300, height: 450 },
            'paint-window': { width: 900, height: 750 },
            'filemanager-window': { width: 800, height: 600 },
            'settings-window': { width: 600, height: 650 },
            'display-settings-window': { width: 500, height: 650 },
            'games-window': { width: 600, height: 500 },
            'pinball-window': { width: 500, height: 750 },
            'tictactoe-window': { width: 450, height: 600 },
            'help-window': { width: 600, height: 500 },
            'about-window': { width: 500, height: 400 }
        };
        
        // Get size for this window type, default to 800x600
        const size = windowSizes[windowId] || { width: 800, height: 600 };
        
        window.style.left = Math.max(50, (window.innerWidth / 2 - size.width / 2)) + 'px';
        window.style.top = Math.max(50, (window.innerHeight / 2 - size.height / 2)) + 'px';
        window.style.width = size.width + 'px';
        window.style.height = size.height + 'px';
    }
    
    bringToFront(window);
    updateTaskbar();
    
    // Initialize specific windows
    if (windowId === 'filemanager-window') {
        renderFileManager();
    } else if (windowId === 'calendar-window') {
        displayCalendar();
    }
}

function closeWindow(window) {
    window.classList.remove('active');
    updateTaskbar();
}

function minimizeWindow(window) {
    window.classList.add('minimized');
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
            const path = icon.dataset.path;
            
            if (windowId === 'filemanager-window') {
                openWindow(windowId);
                if (path) {
                    fmNavigate(path);
                } else {
                    fmNavigate('mycomputer');
                }
            } else {
                openWindow(windowId);
            }
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
    
    const openWindows = document.querySelectorAll('.window.active, .window.minimized');
    
    openWindows.forEach(window => {
        const button = document.createElement('button');
        button.className = 'taskbar-btn';
        if (window.classList.contains('active') && !window.classList.contains('minimized')) {
            button.classList.add('active');
        }
        button.textContent = window.querySelector('.window-title').textContent;
        
        button.addEventListener('click', () => {
            if (window.classList.contains('minimized')) {
                window.classList.remove('minimized');
                window.classList.add('active');
                bringToFront(window);
            } else if (window === activeWindow) {
                minimizeWindow(window);
            } else {
                window.classList.add('active');
                bringToFront(window);
            }
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
    
    // Welcome message will be shown from finishBootSequence if boot was not skipped
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

// ===== CAT AI CHATBOT =====
class SimpleCatBot {
    constructor() {
        this.responses = {
            'hello': ['Meow! Hello there! 😺', 'Hi! Nice to see you! 🐱', 'Hey! What\'s up?'],
            'hi': ['Meow! Hello there! 😺', 'Hi! Nice to see you! 🐱', 'Hey! What\'s up?'],
            'how are you': ['I\'m purr-fect! How are you? 😸', 'Feeling great! Thanks for asking!', 'Meow-velous!'],
            'what is your name': ['I\'m your desktop cat! You can call me Whiskers! 🐱', 'I\'m Cat, your AI companion!'],
            'help': ['I can chat with you, tell jokes, or just keep you company! What would you like? 😺', 'Just talk to me! I\'m here to help!'],
            'joke': ['Why don\'t cats play poker? Too many cheetahs! 😹', 'What do you call a pile of cats? A meow-tain! 🏔️😺', 'Why did the cat sit on the computer? To keep an eye on the mouse! 🖱️😺'],
            'bye': ['Goodbye! See you later! 👋😺', 'Bye! Come back soon!', 'See you! Meow! 🐱'],
            'goodbye': ['Goodbye! See you later! 👋😺', 'Bye! Come back soon!', 'See you! Meow! 🐱'],
            'game': ['Try Pinball or Solitaire! They\'re really fun! 🎮', 'I love watching you play games! 😺'],
            'thank': ['You\'re welcome! 😺', 'My pleasure! 🐱', 'Happy to help! Purr... 😸'],
            'love': ['Aww, I love you too! 😻', 'You\'re the best! 💕🐱'],
            'cute': ['Thank you! You\'re pretty cute yourself! 😸', 'Aww, you\'re making me purr! 😺'],
            'food': ['I love tuna! Do you have any? 🐟😺', 'Meow! I\'m always hungry! 🍽️'],
            'sleep': ['Cats sleep 70% of their lives! I\'m doing my part! 😴', 'Nap time is the best time! 💤'],
            'play': ['Yes! Let\'s play! What game should we try? 🎮', 'I love playtime! 😺']
        };
    }
    
    chat(message) {
        message = message.toLowerCase().trim();
        
        for (const [key, responses] of Object.entries(this.responses)) {
            if (message.includes(key)) {
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        // Default responses
        const defaults = [
            'Meow! Tell me more! 😺',
            'Interesting! Go on... 🐱',
            'I\'m listening! Purr... 😸',
            'That\'s neat! What else? 🐈',
            'Hmm, fascinating! 😺',
            'I see! Continue... 🐱'
        ];
        
        return defaults[Math.floor(Math.random() * defaults.length)];
    }
}

const catAI = new SimpleCatBot();

function openCatChat() {
    // Check if chat window already exists
    let chatWindow = document.getElementById('cat-chat-window');
    if (chatWindow) {
        openWindow('cat-chat-window');
        return;
    }
    
    // Create chat window
    chatWindow = document.createElement('div');
    chatWindow.id = 'cat-chat-window';
    chatWindow.className = 'window';
    chatWindow.style.width = '400px';
    chatWindow.style.height = '500px';
    chatWindow.style.left = '50%';
    chatWindow.style.top = '50%';
    chatWindow.style.transform = 'translate(-50%, -50%)';
    
    chatWindow.innerHTML = `
        <div class="window-titlebar">
            <span class="window-title">Chat with Cat 🐱</span>
            <div class="window-controls">
                <button class="window-control" onclick="minimizeWindow(this.closest('.window'))">_</button>
                <button class="window-control" onclick="closeWindow(this.closest('.window'))">×</button>
            </div>
        </div>
        <div class="window-content" style="display: flex; flex-direction: column; height: calc(100% - 30px);">
            <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 10px; background: #f0f0f0; border-bottom: 1px solid #ccc;">
                <p><b>Cat:</b> Meow! I'm your AI assistant cat. Ask me anything! 😺</p>
            </div>
            <div style="padding: 10px; display: flex; gap: 5px; background: #ece9d8;">
                <input type="text" id="cat-input" placeholder="Type your message..." 
                       style="flex: 1; padding: 8px; border: 1px solid #888; font-family: Tahoma, sans-serif;"
                       onkeypress="if(event.key==='Enter')sendCatMessage()">
                <button onclick="sendCatMessage()" style="padding: 8px 15px; background: #ece9d8; border: 2px outset #fff; cursor: pointer; font-family: Tahoma, sans-serif;">Send</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatWindow);
    openWindow('cat-chat-window');
    
    // Focus input
    setTimeout(() => {
        document.getElementById('cat-input').focus();
    }, 100);
}

function sendCatMessage() {
    const input = document.getElementById('cat-input');
    const messages = document.getElementById('chat-messages');
    
    if (!input || !messages || !input.value.trim()) return;
    
    // Show user message
    const userMsg = document.createElement('p');
    const userLabel = document.createElement('b');
    userLabel.textContent = 'You:';
    userMsg.appendChild(userLabel);
    userMsg.appendChild(document.createTextNode(' ' + input.value));
    userMsg.style.marginBottom = '10px';
    messages.appendChild(userMsg);
    
    const userText = input.value;
    input.value = '';
    
    // Show typing indicator
    const typing = document.createElement('p');
    typing.innerHTML = '<b>Cat:</b> <i>typing...</i>';
    typing.style.marginBottom = '10px';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
    
    // Get AI response
    setTimeout(() => {
        const reply = catAI.chat(userText);
        
        // Remove typing, show response
        typing.remove();
        const catMsg = document.createElement('p');
        const catLabel = document.createElement('b');
        catLabel.textContent = 'Cat:';
        catMsg.appendChild(catLabel);
        catMsg.appendChild(document.createTextNode(' ' + reply));
        catMsg.style.marginBottom = '10px';
        messages.appendChild(catMsg);
        messages.scrollTop = messages.scrollHeight;
    }, 500 + Math.random() * 1000);
}

// Add some start menu interactions
document.addEventListener('DOMContentLoaded', () => {
    const startMenuItems = document.querySelectorAll('.start-menu-item');
    
    startMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            const windowId = item.dataset.window;
            if (windowId) {
                if (windowId === 'mydocuments') {
                    openWindow('filemanager-window');
                    fmNavigate('mydocuments');
                } else if (windowId === 'filemanager') {
                    openWindow('filemanager-window');
                    fmNavigate('mycomputer');
                } else {
                    openWindow(windowId + '-window');
                }
                toggleStartMenu();
            }
        });
    });
    
    // Context menu handling
    const catPet = document.getElementById('cat-pet');
    const catContextMenu = document.getElementById('cat-context-menu');
    const desktop = document.getElementById('desktop');
    const desktopContextMenu = document.getElementById('desktop-context-menu');
    const fmContextMenu = document.getElementById('fm-context-menu');
    
    catPet.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(catContextMenu, e.clientX, e.clientY);
    });
    
    desktop.addEventListener('contextmenu', (e) => {
        if (e.target === desktop) {
            e.preventDefault();
            showContextMenu(desktopContextMenu, e.clientX, e.clientY);
        }
    });
    
    // File manager context menu
    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('#fm-content')) {
            e.preventDefault();
            showContextMenu(fmContextMenu, e.clientX, e.clientY);
        }
    });
    
    document.addEventListener('click', () => {
        catContextMenu.classList.add('hidden');
        desktopContextMenu.classList.add('hidden');
        fmContextMenu.classList.add('hidden');
        const favMenu = document.getElementById('favorites-menu');
        if (favMenu) favMenu.classList.add('hidden');
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Alt+F4 to close active window
        if (e.altKey && e.key === 'F4') {
            e.preventDefault();
            if (activeWindow) {
                closeWindow(activeWindow);
            }
        }
    });
    
    // Initialize applications
    initializeBrowser();
    initializeNotepad();
    initializeCalculator();
    initializePaint();
    initializeMinesweeper();
    initializeSolitaire();
    initializeSnake();
    initializeTetris();
    initializePinball();
    initializeTicTacToe();
});

function showContextMenu(menu, x, y) {
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.classList.remove('hidden');
}

// Browser Functions
let browserHistory = [];
let browserHistoryIndex = -1;
let browserFavorites = [];
let currentBrowserURL = '';
let currentProxyIndex = 0;
let proxyList = [
    { name: 'AllOrigins', url: 'https://api.allorigins.win/raw?url=' },
    { name: 'CORS Proxy', url: 'https://corsproxy.io/?' },
    { name: 'CodeTabs', url: 'https://api.codetabs.com/v1/proxy?quest=' },
    { name: 'ThingProxy', url: 'https://thingproxy.freeboard.io/fetch/' }
];
let browserPages = {
    welcome: `<h1>Welcome to Internet Explorer!</h1>
        <p>Enter a URL in the address bar to browse the web, or try these bookmarks:</p>
        <ul>
            <li><a href="#" onclick="browserLoadURL('https://example.com'); return false;">Example.com</a></li>
            <li><a href="#" onclick="browserLoadURL('https://www.google.com'); return false;">Google</a></li>
            <li><a href="#" onclick="browserLoadURL('https://www.wikipedia.org'); return false;">Wikipedia</a></li>
        </ul>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
            <strong>Note:</strong> This browser uses a web proxy to load real websites. Some sites may not load properly due to CORS restrictions.
        </p>`,
    about: `<h1>About Linux/5</h1>
        <p>Linux/5 is a nostalgic recreation of a Windows XP-style desktop experience.</p>
        <p>Built with pure HTML, CSS, and JavaScript!</p>
        <p><a href="#" onclick="browserNavigate('welcome'); return false;">Back to Home</a></p>`,
    help: `<h1>Help & Tips</h1>
        <ul>
            <li>Double-click icons to open programs</li>
            <li>Drag windows by their title bar</li>
            <li>Right-click the cat for options</li>
            <li>Use Alt+F4 to close windows</li>
        </ul>
        <p><a href="#" onclick="browserNavigate('welcome'); return false;">Back to Home</a></p>`,
    games: `<h1>Games Portal</h1>
        <p>Check out these games:</p>
        <ul>
            <li>Minesweeper - Classic puzzle game</li>
            <li>Solitaire - Coming soon!</li>
        </ul>
        <p><a href="#" onclick="browserNavigate('welcome'); return false;">Back to Home</a></p>`
};

function initializeBrowser() {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('browserFavorites');
    if (savedFavorites) {
        browserFavorites = JSON.parse(savedFavorites);
    } else {
        // Default favorites
        browserFavorites = [
            { name: 'Google', url: 'https://www.google.com' },
            { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
            { name: 'GitHub', url: 'https://github.com' },
            { name: 'Example.com', url: 'https://example.com' }
        ];
        saveFavorites();
    }
    
    // Load custom proxy if set
    const customProxy = localStorage.getItem('customProxy');
    if (customProxy) {
        proxyList.push({ name: 'Custom', url: customProxy });
    }
    
    // Load preferred proxy index
    const preferredProxy = localStorage.getItem('preferredProxy');
    if (preferredProxy !== null) {
        currentProxyIndex = parseInt(preferredProxy);
    }
    
    browserNavigate('welcome');
    updateFavoritesMenu();
}

function saveFavorites() {
    localStorage.setItem('browserFavorites', JSON.stringify(browserFavorites));
    updateFavoritesMenu();
}

function updateFavoritesMenu() {
    const menu = document.getElementById('favorites-menu');
    if (!menu) return;
    
    menu.innerHTML = '';
    
    browserFavorites.forEach((fav, index) => {
        const item = document.createElement('div');
        item.className = 'fav-item';
        item.innerHTML = `<span>⭐</span><span>${fav.name}</span>`;
        item.onclick = (e) => {
            e.stopPropagation();
            browserLoadURL(fav.url);
            menu.classList.add('hidden');
        };
        menu.appendChild(item);
    });
    
    if (browserFavorites.length > 0) {
        const divider = document.createElement('div');
        divider.style.height = '1px';
        divider.style.background = '#ccc';
        divider.style.margin = '3px 0';
        menu.appendChild(divider);
    }
    
    const addItem = document.createElement('div');
    addItem.className = 'fav-item';
    addItem.innerHTML = `<span>➕</span><span>Add Current Page...</span>`;
    addItem.onclick = (e) => {
        e.stopPropagation();
        addToFavorites();
        menu.classList.add('hidden');
    };
    menu.appendChild(addItem);
}

function toggleFavoritesMenu(e) {
    e.stopPropagation();
    const menu = document.getElementById('favorites-menu');
    menu.classList.toggle('hidden');
}

function addToFavorites() {
    if (!currentBrowserURL || currentBrowserURL.includes('.linux5.local')) {
        showCatMessage("Can't bookmark local pages! 😸");
        return;
    }
    
    const name = prompt('Enter bookmark name:', currentBrowserURL);
    if (name) {
        browserFavorites.push({ name, url: currentBrowserURL });
        saveFavorites();
        showCatMessage(`Added "${name}" to favorites! ⭐`);
    }
}

function browserNavigate(page) {
    const content = document.getElementById('browser-content');
    const urlBar = document.getElementById('browser-url');
    
    if (browserPages[page]) {
        content.innerHTML = browserPages[page];
        currentBrowserURL = 'http://' + page + '.linux5.local';
        urlBar.value = currentBrowserURL;
        browserHistory.push({ type: 'local', page });
        browserHistoryIndex = browserHistory.length - 1;
        updateBrowserStatus('Done');
    }
}

function browserLoadURL(url) {
    const urlBar = document.getElementById('browser-url');
    urlBar.value = url;
    browserGo();
}

function browserGo() {
    const urlBar = document.getElementById('browser-url');
    let url = urlBar.value.trim();
    
    if (!url) return;
    
    // Check if it's a local page
    if (url.includes('.linux5.local')) {
        const page = url.replace('http://', '').replace('.linux5.local', '');
        if (browserPages[page]) {
            browserNavigate(page);
            return;
        }
    }
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    currentBrowserURL = url;
    
    // Use proxy to load the URL
    loadURLWithProxy(url);
}

async function loadURLWithProxy(url, proxyIndex = currentProxyIndex, triedProxies = []) {
    const content = document.getElementById('browser-content');
    const loading = document.getElementById('browser-loading');
    
    // Validate URL
    try {
        new URL(url);
    } catch (e) {
        loading.classList.add('hidden');
        updateBrowserStatus('Error');
        showErrorPage(url, 'Invalid URL', 'The URL you entered is not valid.');
        return;
    }
    
    // Check if we've tried all proxies
    if (proxyIndex >= proxyList.length) {
        loading.classList.add('hidden');
        updateBrowserStatus('Error: All proxies failed');
        showErrorPage(url, 'Cannot Display Page', `This website couldn't be loaded through the proxy. Tried proxies: ${triedProxies.join(', ')}`);
        showCatMessage("Oops! All proxies failed. Some sites really don't like proxies! 😿");
        return;
    }
    
    const proxy = proxyList[proxyIndex];
    triedProxies.push(proxy.name);
    
    // Show loading state with better feedback
    updateBrowserStatus(`Connecting... (${proxyIndex + 1}/${proxyList.length})`);
    loading.classList.remove('hidden');
    
    // Clear content and show loading spinner
    content.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #0066cc; border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite;"></div>
            <p style="font-size: 16px; font-weight: bold;">Loading page content...</p>
            <p style="font-size: 12px; color: #666;">Trying ${proxy.name} proxy (${proxyIndex + 1} of ${proxyList.length})</p>
            <p style="font-size: 11px; color: #999; margin-top: 10px;">${url}</p>
            <p style="font-size: 10px; color: #999; margin-top: 10px;">Attempted: ${triedProxies.join(', ')}</p>
        </div>
    `;
    
    // Properly encode URL for proxy
    const proxyURL = proxy.url + encodeURIComponent(url);
    
    try {
        // Set timeout for fetch (15 seconds for better success rate)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        updateBrowserStatus(`Loading via ${proxy.name}...`);
        
        const response = await fetch(proxyURL, { 
            signal: controller.signal,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        updateBrowserStatus('Rendering...');
        let html = await response.text();
        
        // Hide loading
        loading.classList.add('hidden');
        
        // Advanced proxy fixes for frame-busting and URL rewriting
        html = processProxiedHTML(html, url);
        
        // Display content using multiple methods
        const success = displayContentInIframe(html, content);
        
        if (!success) {
            throw new Error('Failed to display content');
        }
        
        // Update status to Done only after successful load
        updateBrowserStatus(`Done - Loaded via ${proxy.name}`);
        
        // Add to history
        browserHistory.push({ type: 'url', url: currentBrowserURL });
        browserHistoryIndex = browserHistory.length - 1;
        
        // Save successful proxy
        currentProxyIndex = proxyIndex;
        localStorage.setItem('preferredProxy', proxyIndex.toString());
        
    } catch (error) {
        console.log(`Proxy ${proxy.name} failed:`, error.message);
        
        // Don't show error, just try next proxy
        loading.classList.remove('hidden');
        updateBrowserStatus(`Trying next proxy...`);
        
        // Try next proxy
        await loadURLWithProxy(url, proxyIndex + 1, triedProxies);
    }
}

function showErrorPage(url, title, message) {
    const content = document.getElementById('browser-content');
    const errorHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    text-align: center;
                }
                .error-box {
                    background: rgba(255,255,255,0.1);
                    padding: 40px;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    max-width: 500px;
                }
                h1 { font-size: 48px; margin-bottom: 10px; }
                h2 { font-size: 24px; margin-bottom: 20px; }
                p { font-size: 16px; opacity: 0.9; }
                button {
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 12px 30px;
                    font-size: 16px;
                    border-radius: 25px;
                    cursor: pointer;
                    margin: 10px;
                    font-weight: bold;
                }
                button:hover { transform: scale(1.05); transition: 0.2s; }
                .url { 
                    background: rgba(0,0,0,0.2); 
                    padding: 10px; 
                    border-radius: 10px; 
                    word-break: break-all;
                    margin: 15px 0;
                    font-size: 14px;
                }
                ul {
                    text-align: left;
                    display: inline-block;
                    margin: 10px 0;
                }
                li {
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="error-box">
                <h1>🚫</h1>
                <h2>${title}</h2>
                <div class="url">${url}</div>
                <p>${message}</p>
                <p style="margin-top: 15px;">This can happen because:</p>
                <ul>
                    <li>The site blocks proxy access</li>
                    <li>The site requires JavaScript features</li>
                    <li>Network connection issues</li>
                    <li>The proxy service is temporarily unavailable</li>
                </ul>
                <div style="margin-top: 20px;">
                    <button onclick="parent.location.reload()">🔄 Try Again</button>
                    <button onclick="parent.browserNavigate('welcome')">🏠 Go Home</button>
                </div>
                <div style="margin-top: 10px;">
                    <button onclick="window.open('${url}', '_blank')">🔗 Open in New Tab</button>
                </div>
            </div>
        </body>
        </html>
    `;
    
    displayContentInIframe(errorHtml, content);
}

function processProxiedHTML(html, originalURL) {
    try {
        const urlObj = new URL(originalURL);
        const baseURL = `${urlObj.protocol}//${urlObj.host}`;
        
        // 1. Ensure HTML structure exists
        if (!html.toLowerCase().includes('<!doctype')) {
            html = '<!DOCTYPE html>\n' + html;
        }
        
        // Only add HTML wrapper if there's no HTML tag
        if (!html.toLowerCase().includes('<html')) {
            html = '<!DOCTYPE html>\n<html>\n<head></head>\n<body>\n' + html + '\n</body>\n</html>';
        }
        
        // 2. Add base tag FIRST (critical for resources)
        const baseTag = `<base href="${baseURL}/">`;
        if (/<head>/i.test(html)) {
            html = html.replace(/<head>/i, '<head>\n' + baseTag);
        } else {
            html = html.replace(/<html[^>]*>/i, '$&\n<head>\n' + baseTag + '\n</head>');
        }
        
        // 3. Inject default styles to prevent white screen
        const defaultStyles = `
            <style>
                /* Prevent white screen */
                html {
                    min-height: 100vh;
                    background: #fff;
                }
                body {
                    min-height: 100vh;
                    margin: 0;
                    padding: 8px;
                    background: #fff;
                    color: #000;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                }
            </style>
        `;
        
        if (/<\/head>/i.test(html)) {
            html = html.replace(/<\/head>/i, defaultStyles + '\n</head>');
        } else {
            html = html.replace(/<body[^>]*>/i, '<head>' + defaultStyles + '</head>\n$&');
        }
        
        // 4. Fix ALL relative URLs
        // Fix src="/path"
        html = html.replace(/src=(["'])\s*\/(?!\/)/gi, `src=$1${baseURL}/`);
        // Fix href="/path"
        html = html.replace(/href=(["'])\s*\/(?!\/)/gi, `href=$1${baseURL}/`);
        // Fix url(/path) in CSS
        html = html.replace(/url\((["']?)\s*\/(?!\/)/gi, `url($1${baseURL}/`);
        // Fix protocol-relative URLs
        html = html.replace(/src=(["'])\s*\/\//gi, 'src=$1https://');
        html = html.replace(/href=(["'])\s*\/\//gi, 'href=$1https://');
        html = html.replace(/url\((["']?)\s*\/\//gi, 'url($1https://');
        
        // 5. Add viewport meta
        if (!html.toLowerCase().includes('viewport')) {
            const viewportTag = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
            html = html.replace(/<head[^>]*>/i, '$&\n' + viewportTag);
        }
        
        // 6. Add charset meta
        if (!html.toLowerCase().includes('charset')) {
            const charsetTag = '<meta charset="UTF-8">';
            html = html.replace(/<head[^>]*>/i, '$&\n' + charsetTag);
        }
        
        // 7. Remove frame-busting but keep other JS
        html = html.replace(/if\s*\(\s*top\s*!==?\s*self\s*\)/gi, 'if(false)');
        html = html.replace(/if\s*\(\s*window\s*!==?\s*window\.top\s*\)/gi, 'if(false)');
        html = html.replace(/if\s*\(\s*parent\s*!==?\s*self\s*\)/gi, 'if(false)');
        html = html.replace(/if\s*\(\s*self\s*!==?\s*top\s*\)/gi, 'if(false)');
        html = html.replace(/if\s*\(\s*top\s*!==?\s*window\s*\)/gi, 'if(false)');
        html = html.replace(/top\.location\s*=/gi, '// top.location=');
        html = html.replace(/parent\.location\s*=/gi, '// parent.location=');
        html = html.replace(/window\.top\.location\s*=/gi, '// window.top.location=');
        
        // Remove X-Frame-Options detection
        html = html.replace(/['"]X-Frame-Options['"]/gi, '"X-Disabled-Header"');
        
        // 8. Inject fallback content if body is empty
        if (html.match(/<body[^>]*>\s*<\/body>/i)) {
            const fallback = `
                <div style="padding: 40px; text-align: center;">
                    <h1>Page Loaded</h1>
                    <p>Content from: ${originalURL}</p>
                    <p>If you see this, the page might be loading dynamic content via JavaScript.</p>
                </div>
            `;
            html = html.replace(/<body[^>]*>/i, '$&\n' + fallback);
        }
        
        // 9. Inject script to disable additional frame-busting attempts
        const antiFrameBustScript = `
            <script>
            (function() {
                try {
                    Object.defineProperty(window, 'top', {
                        get: function() { return window; },
                        set: function() {}
                    });
                    Object.defineProperty(window, 'parent', {
                        get: function() { return window; },
                        set: function() {}
                    });
                } catch(e) {}
            })();
            </script>
        `;
        if (/<head>/i.test(html)) {
            html = html.replace(/<head>/i, '<head>' + antiFrameBustScript);
        }
        
    } catch (e) {
        console.error('Error processing HTML:', e);
    }
    
    return html;
}

function displayContentInIframe(html, container) {
    // Clear content first
    container.innerHTML = '';
    
    // Create iframe with proper sandbox
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'white';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox');
    
    container.appendChild(iframe);
    
    // Method 1: Try srcdoc first (works for most content)
    try {
        iframe.srcdoc = html;
        return true;
    } catch (e) {
        console.log('srcdoc failed, trying blob');
    }
    
    // Method 2: Blob URL fallback (better for complex content)
    try {
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        iframe.src = blobUrl;
        
        iframe.onload = () => {
            // Clean up blob URL after a delay to ensure all resources load
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        };
        return true;
    } catch (e) {
        console.log('blob failed, trying document.write');
    }
    
    // Method 3: document.write (last resort)
    try {
        iframe.contentDocument.open();
        iframe.contentDocument.write(html);
        iframe.contentDocument.close();
        return true;
    } catch (e) {
        console.error('All display methods failed');
        return false;
    }
}

function updateBrowserStatus(text) {
    const status = document.getElementById('browser-status');
    if (status) status.textContent = text;
}

function browserBack() {
    if (browserHistoryIndex > 0) {
        browserHistoryIndex--;
        const item = browserHistory[browserHistoryIndex];
        
        if (item.type === 'local') {
            browserNavigate(item.page);
        } else {
            loadURLWithProxy(item.url);
        }
    }
}

function browserForward() {
    if (browserHistoryIndex < browserHistory.length - 1) {
        browserHistoryIndex++;
        const item = browserHistory[browserHistoryIndex];
        
        if (item.type === 'local') {
            browserNavigate(item.page);
        } else {
            loadURLWithProxy(item.url);
        }
    }
}

function browserRefresh() {
    if (browserHistoryIndex >= 0) {
        const item = browserHistory[browserHistoryIndex];
        
        if (item.type === 'local') {
            browserNavigate(item.page);
        } else {
            loadURLWithProxy(item.url);
        }
    }
}

function browserStop() {
    const loading = document.getElementById('browser-loading');
    loading.classList.add('hidden');
    updateBrowserStatus('Stopped');
}

function browserHome() {
    browserNavigate('welcome');
}

// Notepad Functions
let notepadContent = {};
let currentNotepadFile = 'Untitled';

function initializeNotepad() {
    const textarea = document.getElementById('notepad-textarea');
    textarea.addEventListener('input', () => {
        notepadContent[currentNotepadFile] = textarea.value;
    });
}

function notepadNew() {
    currentNotepadFile = 'Untitled';
    document.getElementById('notepad-textarea').value = '';
    document.querySelector('#notepad-window .window-title').textContent = 'Notepad - Untitled';
}

function notepadSave() {
    const content = document.getElementById('notepad-textarea').value;
    const filename = prompt('Enter filename:', currentNotepadFile);
    if (filename) {
        currentNotepadFile = filename;
        notepadContent[filename] = content;
        document.querySelector('#notepad-window .window-title').textContent = 'Notepad - ' + filename;
        showCatMessage('File saved as "' + filename + '"! 💾');
    }
}

function notepadLoad() {
    const files = Object.keys(notepadContent);
    if (files.length === 0) {
        showCatMessage('No saved files found! 🤷');
        return;
    }
    const filename = prompt('Enter filename to open:\n' + files.join('\n'));
    if (filename && notepadContent[filename] !== undefined) {
        currentNotepadFile = filename;
        document.getElementById('notepad-textarea').value = notepadContent[filename];
        document.querySelector('#notepad-window .window-title').textContent = 'Notepad - ' + filename;
    } else if (filename) {
        showCatMessage('File not found! 😿');
    }
}

// Calculator Functions
let calcDisplay = '0';
let calcFirstOperand = null;
let calcCurrentOperation = null;
let calcWaitingForOperand = false;

function initializeCalculator() {
    updateCalcDisplay();
}

function updateCalcDisplay() {
    document.getElementById('calculator-display').textContent = calcDisplay;
}

function calcNumber(num) {
    if (calcWaitingForOperand) {
        calcDisplay = num;
        calcWaitingForOperand = false;
    } else {
        calcDisplay = calcDisplay === '0' ? num : calcDisplay + num;
    }
    updateCalcDisplay();
}

function calcOperation(op) {
    const inputValue = parseFloat(calcDisplay);
    
    if (calcFirstOperand === null) {
        calcFirstOperand = inputValue;
    } else if (calcCurrentOperation) {
        const result = performCalc(calcFirstOperand, inputValue, calcCurrentOperation);
        calcDisplay = String(result);
        calcFirstOperand = result;
    }
    
    calcWaitingForOperand = true;
    calcCurrentOperation = op;
    updateCalcDisplay();
}

function calcEquals() {
    const inputValue = parseFloat(calcDisplay);
    
    if (calcCurrentOperation && calcFirstOperand !== null) {
        const result = performCalc(calcFirstOperand, inputValue, calcCurrentOperation);
        calcDisplay = String(result);
        calcFirstOperand = null;
        calcCurrentOperation = null;
        calcWaitingForOperand = true;
        updateCalcDisplay();
    }
}

function performCalc(first, second, op) {
    switch(op) {
        case '+': return first + second;
        case '-': return first - second;
        case '*': return first * second;
        case '/': return second !== 0 ? first / second : 0;
        default: return second;
    }
}

function calcClear() {
    calcDisplay = '0';
    calcFirstOperand = null;
    calcCurrentOperation = null;
    calcWaitingForOperand = false;
    updateCalcDisplay();
}

function calcBackspace() {
    calcDisplay = calcDisplay.length > 1 ? calcDisplay.slice(0, -1) : '0';
    updateCalcDisplay();
}

function calcDecimal() {
    if (!calcDisplay.includes('.')) {
        calcDisplay += '.';
        updateCalcDisplay();
    }
}

// Paint Functions
let paintCtx = null;
let isPainting = false;
let paintTool = 'pencil';
let paintColor = '#000000';
let paintBgColor = '#ffffff';
let paintSize = 3;
let paintStartX = 0;
let paintStartY = 0;
let paintHistory = [];
let paintHistoryStep = -1;
let paintTempCanvas = null;

function initializePaint() {
    const canvas = document.getElementById('paint-canvas');
    paintCtx = canvas.getContext('2d');
    
    // Create temporary canvas for preview
    paintTempCanvas = document.createElement('canvas');
    paintTempCanvas.width = canvas.width;
    paintTempCanvas.height = canvas.height;
    
    // Fill with white background
    paintCtx.fillStyle = '#ffffff';
    paintCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    paintSaveState();
    
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', stopPaint);
    canvas.addEventListener('mouseleave', stopPaint);
    
    // Update size display
    document.getElementById('paint-size-display').textContent = paintSize + 'px';
}

function startPaint(e) {
    isPainting = true;
    const rect = e.target.getBoundingClientRect();
    paintStartX = e.clientX - rect.left;
    paintStartY = e.clientY - rect.top;
    
    if (paintTool === 'pencil' || paintTool === 'brush' || paintTool === 'eraser') {
        paintCtx.beginPath();
        paintCtx.moveTo(paintStartX, paintStartY);
    } else if (paintTool === 'fill') {
        paintFloodFill(Math.floor(paintStartX), Math.floor(paintStartY), paintColor);
        paintSaveState();
        isPainting = false;
    } else if (paintTool === 'text') {
        const text = prompt('Enter text:');
        if (text) {
            paintCtx.font = (paintSize * 5) + 'px Arial';
            paintCtx.fillStyle = paintColor;
            paintCtx.fillText(text, paintStartX, paintStartY);
            paintSaveState();
        }
        isPainting = false;
    } else if (paintTool === 'line' || paintTool === 'rectangle' || paintTool === 'circle') {
        // Save current canvas state for preview
        const ctx = paintTempCanvas.getContext('2d');
        ctx.clearRect(0, 0, paintTempCanvas.width, paintTempCanvas.height);
        ctx.drawImage(document.getElementById('paint-canvas'), 0, 0);
    }
}

function paint(e) {
    if (!isPainting) return;
    
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (paintTool === 'pencil') {
        paintCtx.lineWidth = paintSize;
        paintCtx.lineCap = 'round';
        paintCtx.strokeStyle = paintColor;
        paintCtx.lineTo(x, y);
        paintCtx.stroke();
    } else if (paintTool === 'brush') {
        paintCtx.lineWidth = paintSize * 2;
        paintCtx.lineCap = 'round';
        paintCtx.lineJoin = 'round';
        paintCtx.strokeStyle = paintColor;
        paintCtx.lineTo(x, y);
        paintCtx.stroke();
    } else if (paintTool === 'eraser') {
        paintCtx.lineWidth = paintSize * 3;
        paintCtx.lineCap = 'round';
        paintCtx.strokeStyle = paintBgColor;
        paintCtx.lineTo(x, y);
        paintCtx.stroke();
    } else if (paintTool === 'line' || paintTool === 'rectangle' || paintTool === 'circle') {
        // Preview mode - restore and redraw
        const canvas = document.getElementById('paint-canvas');
        paintCtx.clearRect(0, 0, canvas.width, canvas.height);
        paintCtx.drawImage(paintTempCanvas, 0, 0);
        
        if (paintTool === 'line') {
            paintCtx.beginPath();
            paintCtx.moveTo(paintStartX, paintStartY);
            paintCtx.lineTo(x, y);
            paintCtx.lineWidth = paintSize;
            paintCtx.strokeStyle = paintColor;
            paintCtx.stroke();
        } else if (paintTool === 'rectangle') {
            paintCtx.strokeStyle = paintColor;
            paintCtx.lineWidth = paintSize;
            paintCtx.strokeRect(paintStartX, paintStartY, x - paintStartX, y - paintStartY);
        } else if (paintTool === 'circle') {
            const radius = Math.sqrt(Math.pow(x - paintStartX, 2) + Math.pow(y - paintStartY, 2));
            paintCtx.beginPath();
            paintCtx.arc(paintStartX, paintStartY, radius, 0, Math.PI * 2);
            paintCtx.strokeStyle = paintColor;
            paintCtx.lineWidth = paintSize;
            paintCtx.stroke();
        }
    }
}

function stopPaint() {
    if (isPainting && (paintTool === 'pencil' || paintTool === 'brush' || paintTool === 'eraser' ||
                       paintTool === 'line' || paintTool === 'rectangle' || paintTool === 'circle')) {
        paintSaveState();
    }
    isPainting = false;
}

function paintSelectTool(tool) {
    paintTool = tool;
    document.querySelectorAll('.paint-tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('paint-' + tool).classList.add('active');
    
    // Change cursor
    const canvas = document.getElementById('paint-canvas');
    if (tool === 'eraser') {
        canvas.style.cursor = 'not-allowed';
    } else if (tool === 'fill') {
        canvas.style.cursor = 'copy';
    } else if (tool === 'text') {
        canvas.style.cursor = 'text';
    } else {
        canvas.style.cursor = 'crosshair';
    }
}

function paintChangeColor() {
    paintColor = document.getElementById('paint-color').value;
}

function paintChangeBgColor() {
    paintBgColor = document.getElementById('paint-bg-color').value;
}

function paintChangeSize() {
    paintSize = parseInt(document.getElementById('paint-size').value);
    document.getElementById('paint-size-display').textContent = paintSize + 'px';
}

function paintClear() {
    if (confirm('Clear the entire canvas?')) {
        const canvas = document.getElementById('paint-canvas');
        paintCtx.fillStyle = paintBgColor;
        paintCtx.fillRect(0, 0, canvas.width, canvas.height);
        paintSaveState();
    }
}

function paintSaveState() {
    // Remove any states after current step
    paintHistory = paintHistory.slice(0, paintHistoryStep + 1);
    
    // Save current state
    const canvas = document.getElementById('paint-canvas');
    paintHistory.push(canvas.toDataURL());
    paintHistoryStep++;
    
    // Limit history to 50 states
    if (paintHistory.length > 50) {
        paintHistory.shift();
        paintHistoryStep--;
    }
}

function paintUndo() {
    if (paintHistoryStep > 0) {
        paintHistoryStep--;
        paintRestoreState();
    }
}

function paintRedo() {
    if (paintHistoryStep < paintHistory.length - 1) {
        paintHistoryStep++;
        paintRestoreState();
    }
}

function paintRestoreState() {
    const canvas = document.getElementById('paint-canvas');
    const img = new Image();
    img.onload = function() {
        paintCtx.clearRect(0, 0, canvas.width, canvas.height);
        paintCtx.drawImage(img, 0, 0);
    };
    img.src = paintHistory[paintHistoryStep];
}

function paintSave() {
    const canvas = document.getElementById('paint-canvas');
    const link = document.createElement('a');
    link.download = 'painting_' + Date.now() + '.png';
    link.href = canvas.toDataURL();
    link.click();
    showCatMessage('Drawing saved! 💾');
}

function paintFloodFill(startX, startY, fillColor) {
    const canvas = document.getElementById('paint-canvas');
    const imageData = paintCtx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Convert fill color to RGB
    const fillRgb = hexToRgb(fillColor);
    
    // Get start pixel color
    const startPos = (startY * canvas.width + startX) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];
    
    // Don't fill if same color
    if (startR === fillRgb.r && startG === fillRgb.g && startB === fillRgb.b) {
        return;
    }
    
    const stack = [[startX, startY]];
    const visited = new Set();
    
    while (stack.length > 0) {
        const [x, y] = stack.pop();
        
        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
        
        const key = y * canvas.width + x;
        if (visited.has(key)) continue;
        visited.add(key);
        
        const pos = key * 4;
        const r = pixels[pos];
        const g = pixels[pos + 1];
        const b = pixels[pos + 2];
        
        // Check if pixel matches start color
        if (r === startR && g === startG && b === startB) {
            // Fill pixel
            pixels[pos] = fillRgb.r;
            pixels[pos + 1] = fillRgb.g;
            pixels[pos + 2] = fillRgb.b;
            pixels[pos + 3] = 255;
            
            // Add neighbors
            stack.push([x + 1, y]);
            stack.push([x - 1, y]);
            stack.push([x, y + 1]);
            stack.push([x, y - 1]);
        }
    }
    
    paintCtx.putImageData(imageData, 0, 0);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// Minesweeper Functions
let mineBoard = [];
let mineRows = 8;
let mineCols = 8;
let mineCount = 10;
let mineRevealed = 0;
let mineGameOver = false;
let mineTimer = 0;
let mineTimerInterval = null;
let mineDifficulty = 'beginner';

const MINE_DIFFICULTIES = {
    beginner: { rows: 8, cols: 8, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 }
};

function initializeMinesweeper() {
    minesweeperNew();
}

function minesweeperChangeDifficulty() {
    const select = document.getElementById('minesweeper-difficulty');
    mineDifficulty = select.value;
    const config = MINE_DIFFICULTIES[mineDifficulty];
    mineRows = config.rows;
    mineCols = config.cols;
    mineCount = config.mines;
    
    // Resize window for difficulty
    const window = document.getElementById('minesweeper-window');
    const cellSize = 32; // 30px + 2px border
    const width = Math.min(mineCols * cellSize + 60, window.innerWidth - 100);
    const height = mineRows * cellSize + 200;
    window.style.width = width + 'px';
    window.style.height = height + 'px';
    
    minesweeperNew();
}

function minesweeperNew() {
    mineBoard = [];
    mineRevealed = 0;
    mineGameOver = false;
    mineTimer = 0;
    
    if (mineTimerInterval) clearInterval(mineTimerInterval);
    
    // Create empty board
    for (let r = 0; r < mineRows; r++) {
        mineBoard[r] = [];
        for (let c = 0; c < mineCols; c++) {
            mineBoard[r][c] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            };
        }
    }
    
    // Place mines
    let placed = 0;
    while (placed < mineCount) {
        const r = Math.floor(Math.random() * mineRows);
        const c = Math.floor(Math.random() * mineCols);
        if (!mineBoard[r][c].isMine) {
            mineBoard[r][c].isMine = true;
            placed++;
        }
    }
    
    // Calculate adjacent mines
    for (let r = 0; r < mineRows; r++) {
        for (let c = 0; c < mineCols; c++) {
            if (!mineBoard[r][c].isMine) {
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < mineRows && nc >= 0 && nc < mineCols) {
                            if (mineBoard[nr][nc].isMine) count++;
                        }
                    }
                }
                mineBoard[r][c].adjacentMines = count;
            }
        }
    }
    
    renderMinesweeper();
    document.getElementById('minesweeper-mines').textContent = mineCount;
    document.getElementById('minesweeper-time').textContent = mineTimer;
}

function renderMinesweeper() {
    const board = document.getElementById('minesweeper-board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${mineCols}, 30px)`;
    
    for (let r = 0; r < mineRows; r++) {
        for (let c = 0; c < mineCols; c++) {
            const cell = document.createElement('div');
            cell.className = 'mine-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            if (mineBoard[r][c].isRevealed) {
                cell.classList.add('revealed');
                if (mineBoard[r][c].isMine) {
                    cell.classList.add('mine');
                } else if (mineBoard[r][c].adjacentMines > 0) {
                    cell.textContent = mineBoard[r][c].adjacentMines;
                    cell.style.color = getMineColor(mineBoard[r][c].adjacentMines);
                }
            } else if (mineBoard[r][c].isFlagged) {
                cell.classList.add('flagged');
            }
            
            cell.addEventListener('click', () => mineReveal(r, c));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                mineFlag(r, c);
            });
            
            board.appendChild(cell);
        }
    }
}

function mineReveal(r, c) {
    if (mineGameOver || mineBoard[r][c].isRevealed || mineBoard[r][c].isFlagged) return;
    
    // Start timer on first click
    if (mineRevealed === 0) {
        mineTimerInterval = setInterval(() => {
            mineTimer++;
            document.getElementById('minesweeper-time').textContent = mineTimer;
        }, 1000);
    }
    
    if (mineBoard[r][c].isMine) {
        // Game over
        mineGameOver = true;
        if (mineTimerInterval) clearInterval(mineTimerInterval);
        revealAllMines();
        showCatMessage("Boom! 💥 You hit a mine! Try again!");
        return;
    }
    
    // Reveal cell
    mineBoard[r][c].isRevealed = true;
    mineRevealed++;
    
    // If no adjacent mines, reveal neighbors
    if (mineBoard[r][c].adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < mineRows && nc >= 0 && nc < mineCols) {
                    if (!mineBoard[nr][nc].isRevealed) {
                        mineReveal(nr, nc);
                    }
                }
            }
        }
    }
    
    // Check win
    if (mineRevealed === mineRows * mineCols - mineCount) {
        mineGameOver = true;
        if (mineTimerInterval) clearInterval(mineTimerInterval);
        showCatMessage("Congratulations! You won! 🎉");
    }
    
    renderMinesweeper();
}

function mineFlag(r, c) {
    if (mineGameOver || mineBoard[r][c].isRevealed) return;
    mineBoard[r][c].isFlagged = !mineBoard[r][c].isFlagged;
    renderMinesweeper();
}

function revealAllMines() {
    for (let r = 0; r < mineRows; r++) {
        for (let c = 0; c < mineCols; c++) {
            if (mineBoard[r][c].isMine) {
                mineBoard[r][c].isRevealed = true;
            }
        }
    }
    renderMinesweeper();
}

function getMineColor(num) {
    const colors = ['', '#0000FF', '#008000', '#FF0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
    return colors[num] || '#000';
}

// Other Window Functions
function performSearch() {
    const query = document.getElementById('search-input').value;
    const results = document.getElementById('search-results');
    
    if (!query) {
        results.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }
    
    results.innerHTML = `<p>Searching for "${query}"...</p>
        <p>No results found. This is a simulated search! 🔍</p>`;
}

function runCommand() {
    const command = document.getElementById('run-input').value.toLowerCase();
    closeWindow(document.getElementById('run-window'));
    
    const commandMap = {
        'notepad': 'notepad-window',
        'calc': 'calculator-window',
        'calculator': 'calculator-window',
        'paint': 'paint-window',
        'browser': 'browser-window',
        'iexplore': 'browser-window',
        'games': 'games-window'
    };
    
    if (commandMap[command]) {
        openWindow(commandMap[command]);
    } else {
        showCatMessage(`Command "${command}" not found! Try: notepad, calc, paint, browser 🤔`);
    }
}

function performShutdown() {
    const option = document.querySelector('input[name="shutdown"]:checked').value;
    closeWindow(document.getElementById('shutdown-window'));
    
    if (option === 'shutdown') {
        performShutdownAnimation();
    } else if (option === 'restart') {
        performRestartAnimation();
    } else if (option === 'logoff') {
        performLogOffAnimation();
    }
}

function performShutdownAnimation() {
    const screen = document.createElement('div');
    screen.className = 'shutdown-screen';
    screen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #5a7fc6;
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.5s;
    `;
    screen.innerHTML = `
        <div class="shutdown-message" style="text-align: center; color: white;">
            <div class="spinner" style="width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="font-size: 20px;">Windows is shutting down...</p>
        </div>
    `;
    document.body.appendChild(screen);
    
    setTimeout(() => {
        screen.innerHTML = '<div style="background: #000; width: 100%; height: 100%;"></div>';
    }, 2000);
    
    setTimeout(() => {
        screen.innerHTML = `
            <div class="shutdown-complete" style="text-align: center;">
                <p style="color: orange; font-size: 24px;">It's now safe to turn off your computer.</p>
            </div>
        `;
    }, 3000);
}

function performRestartAnimation() {
    const screen = document.createElement('div');
    screen.className = 'shutdown-screen';
    screen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #5a7fc6;
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.5s;
    `;
    screen.innerHTML = `
        <div class="shutdown-message" style="text-align: center; color: white;">
            <div class="spinner" style="width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="font-size: 20px;">Windows is restarting...</p>
        </div>
    `;
    document.body.appendChild(screen);
    
    setTimeout(() => {
        screen.innerHTML = '<div style="background: #000; width: 100%; height: 100%;"></div>';
    }, 2000);
    
    setTimeout(() => {
        location.reload();
    }, 3000);
}

function performLogOffAnimation() {
    const screen = document.createElement('div');
    screen.className = 'shutdown-screen';
    screen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #5a7fc6;
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.5s;
    `;
    screen.innerHTML = `
        <div class="shutdown-message" style="text-align: center; color: white;">
            <div class="spinner" style="width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="font-size: 20px;">Logging off...</p>
        </div>
    `;
    document.body.appendChild(screen);
    
    setTimeout(() => {
        screen.innerHTML = `
            <div class="logoff-screen" style="text-align: center; color: white;">
                <h1 style="font-size: 48px; margin-bottom: 40px;">Windows</h1>
                <div style="margin: 40px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; display: inline-block;">
                    <div style="width: 80px; height: 80px; background: #666; border-radius: 50%; margin: 0 auto 20px;"></div>
                    <h2 style="margin-bottom: 20px;">Welcome</h2>
                    <button onclick="location.reload()" style="padding: 10px 30px; font-size: 16px; cursor: pointer; background: #0066cc; color: white; border: none; border-radius: 3px;">
                        Click to log in
                    </button>
                </div>
            </div>
        `;
    }, 2000);
}

function updateVolume() {
    const value = document.getElementById('volume-slider').value;
    document.getElementById('volume-value').textContent = value;
}

function showNetworkStatus() {
    showCatMessage("Network Status: Connected to Linux/5 Network! 🌐");
}

function toggleCat() {
    const cat = document.getElementById('cat-pet');
    const isHidden = cat.style.display === 'none';
    cat.style.display = isHidden ? 'block' : 'none';
    if (!isHidden) {
        showCatMessage("Okay, I'll hide... 😿");
        setTimeout(() => {
            cat.style.display = 'block';
            showCatMessage("Just kidding! I'm back! 😸");
        }, 3000);
    }
}

function changeCatMood() {
    const moods = ['Happy! 😺', 'Playful! 🐱', 'Sleepy... 😴', 'Excited! 🎉'];
    const mood = moods[Math.floor(Math.random() * moods.length)];
    showCatMessage(`My mood is: ${mood}`);
}

function desktopRefresh() {
    showCatMessage("Desktop refreshed! ✨");
}

function desktopNewFolder() {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
        showCatMessage(`Folder "${folderName}" created! (Not really... this is simulated 😊)`);
    }
}

function desktopProperties() {
    showCatMessage("Desktop Properties: Linux/5 XP Edition 🖥️");
}

// Calendar display
function displayCalendar() {
    const calendarDisplay = document.getElementById('calendar-display');
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let html = `<h3>${monthNames[month]} ${year}</h3>`;
    html += '<table style="width: 100%; border-collapse: collapse; text-align: center;">';
    html += '<tr>';
    dayNames.forEach(day => {
        html += `<th style="padding: 5px;">${day}</th>`;
    });
    html += '</tr><tr>';
    
    let dayCount = 1;
    for (let i = 0; i < 42; i++) {
        if (i > 0 && i % 7 === 0) {
            html += '</tr><tr>';
        }
        
        if (i < firstDay || dayCount > daysInMonth) {
            html += '<td style="padding: 5px;"></td>';
        } else {
            const isToday = dayCount === today;
            const style = isToday ? 'padding: 5px; background: #0066cc; color: white; font-weight: bold;' : 'padding: 5px;';
            html += `<td style="${style}">${dayCount}</td>`;
            dayCount++;
        }
    }
    
    html += '</tr></table>';
    html += `<p style="margin-top: 10px;"><strong>Current time:</strong> ${now.toLocaleTimeString()}</p>`;
    
    calendarDisplay.innerHTML = html;
}

// Update calendar when window opens
// File Manager Functions
let fileSystem = {};
let currentPath = ['mycomputer']; // Array representing path hierarchy
let fmHistory = [];
let fmHistoryIndex = -1;
let fmViewMode = 'icons'; // icons, list, details
let fmClipboard = null;
let fmClipboardAction = null; // 'copy' or 'cut'
let selectedFMItems = [];

function initializeFileSystem() {
    const saved = localStorage.getItem('linux5FileSystem');
    if (saved) {
        fileSystem = JSON.parse(saved);
    } else {
        // Create default file system with nested structure
        fileSystem = {
            desktop: {
                type: 'folder',
                name: 'Desktop',
                children: {
                    'readme.txt': { 
                        type: 'file', 
                        name: 'readme.txt', 
                        size: '1 KB',
                        content: 'Welcome to Linux/5!\n\nThis is a nostalgic recreation of Windows XP-style desktop.\n\nDouble-click icons to open programs!\nRight-click for context menus!\nDrag windows and icons around!\n\nHave fun exploring! 😺',
                        modified: new Date().toLocaleDateString()
                    }
                }
            },
            mydocuments: {
                type: 'folder',
                name: 'My Documents',
                children: {
                    'My Pictures': { 
                        type: 'folder', 
                        name: 'My Pictures', 
                        children: {
                            'Sample Pictures': {
                                type: 'folder',
                                name: 'Sample Pictures',
                                children: {
                                    'sunset.jpg': { type: 'file', name: 'sunset.jpg', size: '128 KB', modified: new Date().toLocaleDateString() },
                                    'beach.jpg': { type: 'file', name: 'beach.jpg', size: '156 KB', modified: new Date().toLocaleDateString() }
                                }
                            }
                        }
                    },
                    'My Music': { 
                        type: 'folder', 
                        name: 'My Music',
                        children: {
                            'Sample Music': { type: 'folder', name: 'Sample Music', children: {} }
                        }
                    },
                    'My Videos': { type: 'folder', name: 'My Videos', children: {} },
                    'Downloads': { type: 'folder', name: 'Downloads', children: {} },
                    'Work': { 
                        type: 'folder', 
                        name: 'Work', 
                        children: {
                            'Reports': { 
                                type: 'folder', 
                                name: 'Reports', 
                                children: {
                                    '2024': { type: 'folder', name: '2024', children: {} },
                                    '2025': { type: 'folder', name: '2025', children: {} }
                                }
                            },
                            'Projects': { type: 'folder', name: 'Projects', children: {} },
                            'Presentations': { type: 'folder', name: 'Presentations', children: {} }
                        }
                    },
                    'Personal': {
                        type: 'folder',
                        name: 'Personal',
                        children: {
                            'Notes': {
                                type: 'folder',
                                name: 'Notes',
                                children: {
                                    'todo.txt': {
                                        type: 'file',
                                        name: 'todo.txt',
                                        size: '1 KB',
                                        content: '- Learn Linux/5\n- Explore all the features\n- Have fun!\n- Customize desktop\n- Try all the games',
                                        modified: new Date().toLocaleDateString()
                                    }
                                }
                            }
                        }
                    }
                }
            },
            downloads: {
                type: 'folder',
                name: 'Downloads',
                children: {}
            },
            mycomputer: {
                type: 'folder',
                name: 'My Computer',
                children: {
                    'C:': { 
                        type: 'drive', 
                        name: 'Local Disk (C:)', 
                        children: {
                            'Program Files': { 
                                type: 'folder', 
                                name: 'Program Files', 
                                children: {
                                    'Internet Explorer': { type: 'folder', name: 'Internet Explorer', children: {} },
                                    'Windows Media Player': { type: 'folder', name: 'Windows Media Player', children: {} },
                                    'Games': { type: 'folder', name: 'Games', children: {} },
                                    'Accessories': { type: 'folder', name: 'Accessories', children: {} }
                                }
                            },
                            'Windows': { 
                                type: 'folder', 
                                name: 'Windows', 
                                children: {
                                    'System32': { type: 'folder', name: 'System32', children: {} },
                                    'Fonts': { type: 'folder', name: 'Fonts', children: {} },
                                    'Temp': { type: 'folder', name: 'Temp', children: {} }
                                }
                            },
                            'Users': { 
                                type: 'folder', 
                                name: 'Users', 
                                children: {
                                    'User': { 
                                        type: 'folder', 
                                        name: 'User', 
                                        children: {
                                            'Desktop': { type: 'folder', name: 'Desktop', children: {} },
                                            'Documents': { type: 'folder', name: 'Documents', children: {} },
                                            'Downloads': { type: 'folder', name: 'Downloads', children: {} }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    'D:': { type: 'drive', name: 'CD Drive (D:)', children: {} }
                }
            },
            mynetwork: {
                type: 'folder',
                name: 'My Network Places',
                children: {}
            },
            recycle: {
                type: 'folder',
                name: 'Recycle Bin',
                children: {}
            }
        };
        saveFileSystem();
    }
}

function saveFileSystem() {
    localStorage.setItem('linux5FileSystem', JSON.stringify(fileSystem));
}

function getCurrentFolder() {
    let folder = fileSystem;
    for (const pathPart of currentPath) {
        if (folder[pathPart]) {
            folder = folder[pathPart];
        } else if (folder.children && folder.children[pathPart]) {
            folder = folder.children[pathPart];
        } else {
            return null;
        }
    }
    return folder;
}

function fmNavigate(path) {
    if (typeof path === 'string') {
        // Direct navigation to root folders
        currentPath = [path];
    } else if (Array.isArray(path)) {
        // Navigate to specific path array
        currentPath = path;
    }
    
    fmHistory = fmHistory.slice(0, fmHistoryIndex + 1);
    fmHistory.push([...currentPath]);
    fmHistoryIndex = fmHistory.length - 1;
    renderFileManager();
}

function fmNavigateInto(folderName) {
    // Navigate into a subfolder
    currentPath.push(folderName);
    fmHistory = fmHistory.slice(0, fmHistoryIndex + 1);
    fmHistory.push([...currentPath]);
    fmHistoryIndex = fmHistory.length - 1;
    renderFileManager();
}

function fmBack() {
    if (fmHistoryIndex > 0) {
        fmHistoryIndex--;
        currentPath = [...fmHistory[fmHistoryIndex]];
        renderFileManager();
    }
}

function fmForward() {
    if (fmHistoryIndex < fmHistory.length - 1) {
        fmHistoryIndex++;
        currentPath = [...fmHistory[fmHistoryIndex]];
        renderFileManager();
    }
}

function fmUp() {
    // Navigate to parent folder
    if (currentPath.length > 1) {
        currentPath.pop();
        fmHistory = fmHistory.slice(0, fmHistoryIndex + 1);
        fmHistory.push([...currentPath]);
        fmHistoryIndex = fmHistory.length - 1;
        renderFileManager();
    }
}

function fmSearch() {
    showCatMessage("File search coming soon! 🔍");
}

function fmToggleFolders() {
    const sidebar = document.getElementById('fm-sidebar');
    sidebar.classList.toggle('hidden');
}

function fmChangeView() {
    const modes = ['icons', 'list', 'details'];
    const currentIndex = modes.indexOf(fmViewMode);
    fmViewMode = modes[(currentIndex + 1) % modes.length];
    renderFileManager();
}

function fmGo() {
    renderFileManager();
}

function renderFileManager() {
    const content = document.getElementById('fm-content');
    const address = document.getElementById('fm-address');
    const status = document.getElementById('fm-status');
    const title = document.querySelector('#filemanager-window .window-title');
    
    if (!content) return;
    
    const folder = getCurrentFolder();
    if (!folder) {
        content.innerHTML = '<p>Folder not found.</p>';
        return;
    }
    
    // Create breadcrumb path
    const breadcrumbs = [];
    let tempPath = [];
    for (let i = 0; i < currentPath.length; i++) {
        tempPath.push(currentPath[i]);
        let folderObj = fileSystem;
        for (const p of tempPath) {
            folderObj = folderObj[p] || (folderObj.children && folderObj.children[p]);
        }
        breadcrumbs.push({
            name: folderObj ? folderObj.name : currentPath[i],
            path: [...tempPath]
        });
    }
    
    // Update UI
    title.textContent = folder.name || 'My Computer';
    
    // Create clickable breadcrumb path
    let pathHTML = '';
    breadcrumbs.forEach((crumb, i) => {
        if (i > 0) pathHTML += ' > ';
        if (i === breadcrumbs.length - 1) {
            pathHTML += crumb.name;
        } else {
            pathHTML += `<a href="#" onclick="fmNavigateToBreadcrumb(${i}); return false;" style="color: #0066cc; text-decoration: underline;">${crumb.name}</a>`;
        }
    });
    address.value = pathHTML;
    address.innerHTML = pathHTML;
    address.style.background = 'transparent';
    address.style.border = 'none';
    
    // Render items
    let html = '';
    
    if (fmViewMode === 'details') {
        html = '<div class="fm-items-container details-view">';
        html += '<div class="details-view-header">';
        html += '<div>Name</div><div>Size</div><div>Type</div><div>Date Modified</div>';
        html += '</div>';
    } else {
        html = `<div class="fm-items-container ${fmViewMode}-view">`;
    }
    
    const items = folder.children || {};
    const itemCount = Object.keys(items).length;
    
    if (itemCount === 0) {
        html += '<p style="padding: 20px; color: #666;">This folder is empty.</p>';
    } else {
        Object.keys(items).forEach(key => {
            const item = items[key];
            const icon = getFileIcon(item);
            
            if (fmViewMode === 'details') {
                html += `<div class="fm-item" onclick="fmSelectItem('${key}')" ondblclick="fmOpenItem('${key}')">`;
                html += `<div><span class="fm-item-icon">${icon}</span> ${item.name}</div>`;
                html += `<div>${item.size || '-'}</div>`;
                html += `<div>${item.type === 'folder' || item.type === 'drive' ? 'Folder' : 'File'}</div>`;
                html += `<div>${item.modified || new Date().toLocaleDateString()}</div>`;
                html += '</div>';
            } else {
                html += `<div class="fm-item" onclick="fmSelectItem('${key}')" ondblclick="fmOpenItem('${key}')">`;
                html += `<div class="fm-item-icon">${icon}</div>`;
                html += `<div class="fm-item-name">${item.name}</div>`;
                html += '</div>';
            }
        });
    }
    
    html += '</div>';
    content.innerHTML = html;
    
    // Update status
    status.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
    
    // Update sidebar tree
    renderFolderTree();
}

function fmNavigateToBreadcrumb(index) {
    currentPath = currentPath.slice(0, index + 1);
    fmHistory = fmHistory.slice(0, fmHistoryIndex + 1);
    fmHistory.push([...currentPath]);
    fmHistoryIndex = fmHistory.length - 1;
    renderFileManager();
}

function renderFolderTree() {
    const sidebar = document.getElementById('fm-sidebar');
    if (!sidebar) return;
    
    let html = '';
    
    // Render root folders
    const rootFolders = ['desktop', 'mydocuments', 'mycomputer', 'mynetwork', 'recycle'];
    rootFolders.forEach(key => {
        const folder = fileSystem[key];
        const isExpanded = currentPath[0] === key;
        const isSelected = currentPath.length === 1 && currentPath[0] === key;
        
        html += `<div class="fm-tree-item ${isSelected ? 'selected' : ''}" onclick="fmNavigate('${key}')">`;
        html += `<span class="fm-icon">${getFileIcon(folder)}</span> ${folder.name}`;
        html += '</div>';
        
        // If expanded, show children
        if (isExpanded && folder.children) {
            html += renderTreeChildren(folder.children, [key], 1);
        }
    });
    
    sidebar.innerHTML = html;
}

function renderTreeChildren(children, parentPath, depth) {
    let html = '';
    const indent = 20 * depth;
    
    Object.keys(children).forEach(key => {
        const item = children[key];
        if (item.type === 'folder' || item.type === 'drive') {
            const itemPath = [...parentPath, key];
            const isExpanded = currentPath.length > itemPath.length && 
                               currentPath.slice(0, itemPath.length).every((p, i) => p === itemPath[i]);
            const isSelected = currentPath.length === itemPath.length && 
                              currentPath.every((p, i) => p === itemPath[i]);
            
            html += `<div class="fm-tree-item ${isSelected ? 'selected' : ''}" style="padding-left: ${indent}px;" onclick="fmNavigateToPath(${JSON.stringify(itemPath).replace(/"/g, '&quot;')}); event.stopPropagation();">`;
            html += `<span class="fm-icon">${getFileIcon(item)}</span> ${item.name}`;
            html += '</div>';
            
            if (isExpanded && item.children) {
                html += renderTreeChildren(item.children, itemPath, depth + 1);
            }
        }
    });
    
    return html;
}

function fmNavigateToPath(pathArray) {
    currentPath = pathArray;
    fmHistory = fmHistory.slice(0, fmHistoryIndex + 1);
    fmHistory.push([...currentPath]);
    fmHistoryIndex = fmHistory.length - 1;
    renderFileManager();
}

function getFileIcon(item) {
    if (item.type === 'folder') return '📁';
    if (item.type === 'drive') return '💾';
    if (item.type === 'file') {
        const ext = item.name.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) return '🖼️';
        if (['txt', 'doc', 'docx'].includes(ext)) return '📄';
        if (['mp3', 'wav', 'ogg'].includes(ext)) return '🎵';
        if (['mp4', 'avi', 'mkv'].includes(ext)) return '🎬';
        if (['zip', 'rar', '7z'].includes(ext)) return '📦';
        if (['exe', 'msi'].includes(ext)) return '⚙️';
        return '📄';
    }
    return '📄';
}

function fmSelectItem(key) {
    selectedFMItems = [key];
}

function fmOpenItem(key) {
    const folder = getCurrentFolder();
    const item = folder.children[key];
    
    if (!item) return;
    
    if (item.type === 'folder' || item.type === 'drive') {
        // Navigate into folder
        fmNavigateInto(key);
    } else if (item.type === 'file') {
        const ext = item.name.split('.').pop().toLowerCase();
        if (['txt', 'doc', 'docx'].includes(ext)) {
            // Open in notepad
            openWindow('notepad-window');
            showCatMessage(`Opening ${item.name} in Notepad...`);
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) {
            showCatMessage(`Opening ${item.name}... (Image viewer not yet implemented)`);
        } else {
            showCatMessage(`Can't open ${item.name} - no associated program!`);
        }
    }
}

function fmCreateFolder() {
    const name = prompt('Enter folder name:');
    if (name) {
        const folder = getCurrentFolder();
        if (!folder.children) folder.children = {};
        
        if (folder.children[name]) {
            showCatMessage(`A folder named "${name}" already exists! 😿`);
            return;
        }
        
        folder.children[name] = {
            type: 'folder',
            name: name,
            children: {},
            modified: new Date().toLocaleDateString()
        };
        saveFileSystem();
        renderFileManager();
        showCatMessage(`Folder "${name}" created! 📁`);
    }
}

function fmCreateFile() {
    const name = prompt('Enter file name (with extension):');
    if (name) {
        const folder = getCurrentFolder();
        if (!folder.children) folder.children = {};
        
        if (folder.children[name]) {
            showCatMessage(`A file named "${name}" already exists! 😿`);
            return;
        }
        
        folder.children[name] = {
            type: 'file',
            name: name,
            size: '0 KB',
            modified: new Date().toLocaleDateString()
        };
        saveFileSystem();
        renderFileManager();
        showCatMessage(`File "${name}" created! 📄`);
    }
}

function fmRename() {
    if (selectedFMItems.length === 0) {
        showCatMessage("Please select an item to rename! 😺");
        return;
    }
    
    const key = selectedFMItems[0];
    const folder = getCurrentFolder();
    const item = folder.children[key];
    
    if (!item) return;
    
    const newName = prompt('Enter new name:', item.name);
    if (newName && newName !== item.name) {
        // Check if item with new name already exists
        if (folder.children[newName]) {
            showCatMessage(`An item named "${newName}" already exists! 😿`);
            return;
        }
        item.name = newName;
        delete folder.children[key];
        folder.children[newName] = item;
        saveFileSystem();
        renderFileManager();
        showCatMessage(`Renamed to "${newName}"! ✏️`);
    }
}

function fmDelete() {
    if (selectedFMItems.length === 0) {
        showCatMessage("Please select an item to delete! 😺");
        return;
    }
    
    const key = selectedFMItems[0];
    const folder = getCurrentFolder();
    const item = folder.children[key];
    
    if (!item) return;
    
    if (confirm(`Move "${item.name}" to Recycle Bin?`)) {
        // Move to recycle bin
        const recycleBin = fileSystem.recycle;
        if (!recycleBin.children) recycleBin.children = {};
        
        // Add timestamp to avoid conflicts
        const recycleKey = `${key}_${Date.now()}`;
        recycleBin.children[recycleKey] = {
            ...item,
            originalPath: [...currentPath],
            originalKey: key,
            deletedDate: new Date().toLocaleDateString()
        };
        
        delete folder.children[key];
        saveFileSystem();
        renderFileManager();
        showCatMessage(`"${item.name}" moved to Recycle Bin! 🗑️`);
    }
}

function fmCopy() {
    if (selectedFMItems.length === 0) {
        showCatMessage("Please select an item to copy! 😺");
        return;
    }
    
    fmClipboard = {
        key: selectedFMItems[0],
        sourcePath: [...currentPath]
    };
    fmClipboardAction = 'copy';
    showCatMessage("Item copied to clipboard! 📋");
}

function fmCut() {
    if (selectedFMItems.length === 0) {
        showCatMessage("Please select an item to cut! 😺");
        return;
    }
    
    fmClipboard = {
        key: selectedFMItems[0],
        sourcePath: [...currentPath]
    };
    fmClipboardAction = 'cut';
    showCatMessage("Item cut to clipboard! ✂️");
}

function fmPaste() {
    if (!fmClipboard) {
        showCatMessage("Nothing to paste! 😺");
        return;
    }
    
    // Get source folder
    let sourceFolder = fileSystem;
    for (const p of fmClipboard.sourcePath) {
        if (sourceFolder[p]) {
            sourceFolder = sourceFolder[p];
        } else if (sourceFolder.children && sourceFolder.children[p]) {
            sourceFolder = sourceFolder.children[p];
        }
    }
    
    const item = sourceFolder.children && sourceFolder.children[fmClipboard.key];
    if (!item) {
        showCatMessage("Source item not found! 😿");
        return;
    }
    
    const targetFolder = getCurrentFolder();
    if (!targetFolder.children) targetFolder.children = {};
    
    // Check for name conflict
    let newKey = fmClipboard.key;
    let counter = 1;
    while (targetFolder.children[newKey]) {
        const ext = item.name.includes('.') ? '.' + item.name.split('.').pop() : '';
        const baseName = item.name.replace(ext, '');
        newKey = `${baseName} (${counter})${ext}`;
        counter++;
    }
    
    if (fmClipboardAction === 'copy') {
        // Deep copy item
        targetFolder.children[newKey] = JSON.parse(JSON.stringify(item));
        if (newKey !== fmClipboard.key) {
            targetFolder.children[newKey].name = newKey;
        }
    } else if (fmClipboardAction === 'cut') {
        // Move item
        targetFolder.children[newKey] = item;
        if (newKey !== fmClipboard.key) {
            item.name = newKey;
        }
        delete sourceFolder.children[fmClipboard.key];
        fmClipboard = null;
        fmClipboardAction = null;
    }
    
    saveFileSystem();
    renderFileManager();
    showCatMessage("Item pasted! 📌");
}

function fmEmptyRecycleBin() {
    if (confirm('Empty the Recycle Bin? This cannot be undone!')) {
        fileSystem.recycle.children = {};
        saveFileSystem();
        renderFileManager();
        showCatMessage("Recycle Bin emptied! 🗑️");
    }
}

function fmRestoreFromRecycle() {
    if (selectedFMItems.length === 0) {
        showCatMessage("Please select an item to restore! 😺");
        return;
    }
    
    const key = selectedFMItems[0];
    const recycleBin = fileSystem.recycle;
    const item = recycleBin.children[key];
    
    if (!item || !item.originalPath) {
        showCatMessage("Cannot restore this item! 😿");
        return;
    }
    
    // Navigate to original location
    let targetFolder = fileSystem;
    for (const p of item.originalPath) {
        if (targetFolder[p]) {
            targetFolder = targetFolder[p];
        } else if (targetFolder.children && targetFolder.children[p]) {
            targetFolder = targetFolder.children[p];
        } else {
            showCatMessage("Original location not found! 😿");
            return;
        }
    }
    
    // Restore item
    if (!targetFolder.children) targetFolder.children = {};
    const restoredKey = item.originalKey || key;
    
    // Remove metadata
    const restoredItem = {...item};
    delete restoredItem.originalPath;
    delete restoredItem.originalKey;
    delete restoredItem.deletedDate;
    
    targetFolder.children[restoredKey] = restoredItem;
    delete recycleBin.children[key];
    
    saveFileSystem();
    renderFileManager();
    showCatMessage(`"${item.name}" restored! ♻️`);
}

// Initialize file system on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeFileSystem();
});

// Settings Functions

// Load all settings on page load
function loadAllSettings() {
    loadDisplaySettings();
    loadSoundSettings();
    loadMouseSettings();
    loadTaskbarSettings();
    loadInternetSettings();
    loadDateTimeSettings();
    loadAccessibilitySettings();
    loadCatSettings();
}

// Display Settings
function loadDisplaySettings() {
    const wallpaperData = localStorage.getItem('wallpaperData');
    const fontsize = localStorage.getItem('displayFontsize') || 'normal';
    
    if (wallpaperData) {
        const data = JSON.parse(wallpaperData);
        setWallpaper(data.type, data.value, data.position);
    }
    
    if (fontsize === 'large') {
        document.body.style.fontSize = '14px';
    } else if (fontsize === 'xlarge') {
        document.body.style.fontSize = '16px';
    }
    
    // Update UI when window opens
    const fontsizeSelect = document.getElementById('display-fontsize');
    if (fontsizeSelect) fontsizeSelect.value = fontsize;
}

const BUILTIN_WALLPAPERS = {
    'bliss': {
        name: 'Bliss',
        url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Cdefs%3E%3ClinearGradient id="sky" x1="0%25" y1="0%25" x2="0%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2387CEEB;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2300BFFF;stop-opacity:1" /%3E%3C/linearGradient%3E%3ClinearGradient id="grass" x1="0%25" y1="0%25" x2="0%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%239ACD32;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2332CD32;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23sky)" width="800" height="400"/%3E%3Cellipse cx="400" cy="500" rx="400" ry="200" fill="url(%23grass)"/%3E%3C/svg%3E'
    },
    'autumn': {
        name: 'Autumn',
        url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Cdefs%3E%3ClinearGradient id="autumn" x1="0%25" y1="0%25" x2="0%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF8C00;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23DC143C;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23autumn)" width="800" height="600"/%3E%3C/svg%3E'
    },
    'azul': {
        name: 'Azul',
        url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Cdefs%3E%3ClinearGradient id="azul" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%230066cc;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2300ccff;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23azul)" width="800" height="600"/%3E%3C/svg%3E'
    },
    'default': {
        name: 'XP Blue',
        url: ''
    }
};

function updateWallpaperOptions() {
    const type = document.getElementById('wallpaper-type').value;
    const optionsDiv = document.getElementById('wallpaper-options');
    
    optionsDiv.innerHTML = '';
    
    if (type === 'color') {
        optionsDiv.innerHTML = `
            <label>Choose a color:</label>
            <input type="color" id="wallpaper-color-picker" value="#5A8CC7" oninput="previewWallpaper()" />
        `;
    } else if (type === 'builtin') {
        optionsDiv.innerHTML = '<div class="builtin-wallpaper-grid" id="builtin-wallpaper-grid"></div>';
        const grid = document.getElementById('builtin-wallpaper-grid');
        
        for (const [key, wallpaper] of Object.entries(BUILTIN_WALLPAPERS)) {
            const div = document.createElement('div');
            div.className = 'builtin-wallpaper-option';
            div.dataset.key = key;
            div.onclick = () => {
                document.querySelectorAll('.builtin-wallpaper-option').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                previewWallpaper();
            };
            
            const thumb = document.createElement('div');
            thumb.className = 'builtin-wallpaper-thumb';
            if (key === 'default') {
                thumb.style.background = 'linear-gradient(to bottom, #5A8CC7 0%, #3A6EA5 100%)';
            } else {
                thumb.style.backgroundImage = `url(${wallpaper.url})`;
            }
            
            const name = document.createElement('div');
            name.className = 'builtin-wallpaper-name';
            name.textContent = wallpaper.name;
            
            div.appendChild(thumb);
            div.appendChild(name);
            grid.appendChild(div);
        }
    } else if (type === 'url') {
        optionsDiv.innerHTML = `
            <label>Enter image URL:</label>
            <input type="text" id="wallpaper-url-input" placeholder="https://example.com/image.jpg" oninput="previewWallpaper()" />
        `;
    } else if (type === 'upload') {
        optionsDiv.innerHTML = `
            <label>Upload an image:</label>
            <input type="file" id="wallpaper-file-input" accept="image/*" onchange="handleWallpaperUpload()" />
        `;
    }
    
    previewWallpaper();
}

function handleWallpaperUpload() {
    const file = document.getElementById('wallpaper-file-input').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('wallpaper-preview');
            preview.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
}

function previewWallpaper() {
    const type = document.getElementById('wallpaper-type').value;
    const position = document.getElementById('wallpaper-position').value;
    const preview = document.getElementById('wallpaper-preview');
    
    if (type === 'color') {
        const color = document.getElementById('wallpaper-color-picker').value;
        preview.style.background = color;
        preview.style.backgroundImage = 'none';
    } else if (type === 'builtin') {
        const selected = document.querySelector('.builtin-wallpaper-option.selected');
        if (selected) {
            const key = selected.dataset.key;
            const wallpaper = BUILTIN_WALLPAPERS[key];
            if (key === 'default') {
                preview.style.background = 'linear-gradient(to bottom, #5A8CC7 0%, #3A6EA5 100%)';
                preview.style.backgroundImage = 'none';
            } else {
                preview.style.backgroundImage = `url(${wallpaper.url})`;
            }
        }
    } else if (type === 'url') {
        const url = document.getElementById('wallpaper-url-input').value;
        if (url) {
            preview.style.backgroundImage = `url(${url})`;
        }
    }
    
    // Apply position
    if (position === 'stretch') {
        preview.style.backgroundSize = '100% 100%';
        preview.style.backgroundRepeat = 'no-repeat';
    } else if (position === 'tile') {
        preview.style.backgroundSize = 'auto';
        preview.style.backgroundRepeat = 'repeat';
    } else if (position === 'center') {
        preview.style.backgroundSize = 'auto';
        preview.style.backgroundRepeat = 'no-repeat';
        preview.style.backgroundPosition = 'center';
    } else if (position === 'fill') {
        preview.style.backgroundSize = 'cover';
        preview.style.backgroundRepeat = 'no-repeat';
    }
}

function setWallpaper(type, value, position) {
    const desktop = document.body;
    
    if (type === 'color') {
        desktop.style.background = value;
        desktop.style.backgroundImage = 'none';
    } else if (type === 'builtin') {
        const wallpaper = BUILTIN_WALLPAPERS[value];
        if (value === 'default') {
            desktop.style.background = 'linear-gradient(to bottom, #5A8CC7 0%, #3A6EA5 100%)';
            desktop.style.backgroundImage = 'none';
        } else {
            desktop.style.backgroundImage = `url(${wallpaper.url})`;
        }
    } else if (type === 'url' || type === 'upload') {
        desktop.style.backgroundImage = `url(${value})`;
    }
    
    // Apply position
    if (position === 'stretch') {
        desktop.style.backgroundSize = '100% 100%';
        desktop.style.backgroundRepeat = 'no-repeat';
    } else if (position === 'tile') {
        desktop.style.backgroundSize = 'auto';
        desktop.style.backgroundRepeat = 'repeat';
    } else if (position === 'center') {
        desktop.style.backgroundSize = 'auto';
        desktop.style.backgroundRepeat = 'no-repeat';
        desktop.style.backgroundPosition = 'center';
    } else if (position === 'fill') {
        desktop.style.backgroundSize = 'cover';
        desktop.style.backgroundRepeat = 'no-repeat';
        desktop.style.backgroundPosition = 'center';
    }
}

function applyDisplaySettings() {
    // Apply theme
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        const selectedTheme = themeSelector.value;
        applyTheme(selectedTheme);
    }
    
    const type = document.getElementById('wallpaper-type').value;
    const position = document.getElementById('wallpaper-position').value;
    const fontsize = document.getElementById('display-fontsize').value;
    
    let value = '';
    
    if (type === 'color') {
        value = document.getElementById('wallpaper-color-picker').value;
    } else if (type === 'builtin') {
        const selected = document.querySelector('.builtin-wallpaper-option.selected');
        if (selected) {
            value = selected.dataset.key;
        } else {
            value = 'default';
        }
    } else if (type === 'url') {
        value = document.getElementById('wallpaper-url-input').value;
    } else if (type === 'upload') {
        const preview = document.getElementById('wallpaper-preview');
        const bgImage = preview.style.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            value = bgImage.slice(5, -2); // Extract URL from url("...")
        }
    }
    
    setWallpaper(type, value, position);
    
    // Save settings
    localStorage.setItem('wallpaperData', JSON.stringify({ type, value, position }));
    localStorage.setItem('displayFontsize', fontsize);
    
    // Apply font size
    document.body.style.fontSize = fontsize === 'large' ? '14px' : fontsize === 'xlarge' ? '16px' : '12px';
    
    showCatMessage('Display settings applied! 🖥️');
}

function previewTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;
    
    const preview = document.getElementById('theme-preview');
    const titlebar = preview.querySelector('.preview-titlebar');
    const taskbar = preview.querySelector('.preview-taskbar');
    
    titlebar.style.background = theme.titlebar;
    taskbar.style.background = theme.taskbar;
    preview.style.background = theme.desktop;
}

function loadThemeSettings() {
    const savedTheme = localStorage.getItem('theme') || 'luna-blue';
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.value = savedTheme;
        previewTheme(savedTheme);
    }
}

// Initialize wallpaper options when display settings window opens
document.addEventListener('DOMContentLoaded', () => {
    const displayWindow = document.getElementById('display-settings-window');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class' && displayWindow.classList.contains('active')) {
                updateWallpaperOptions();
                loadThemeSettings();
            }
        });
    });
    observer.observe(displayWindow, { attributes: true });
});

// Sound Settings
function loadSoundSettings() {
    const volume = localStorage.getItem('soundVolume') || '50';
    const enabled = localStorage.getItem('soundEnabled') !== 'false';
    
    const volumeSlider = document.getElementById('sound-volume');
    const volumeValue = document.getElementById('sound-volume-value');
    const enabledCheckbox = document.getElementById('sound-enabled');
    
    if (volumeSlider) volumeSlider.value = volume;
    if (volumeValue) volumeValue.textContent = volume;
    if (enabledCheckbox) enabledCheckbox.checked = enabled;
}

function applySoundSettings() {
    const volume = document.getElementById('sound-volume').value;
    const enabled = document.getElementById('sound-enabled').checked;
    
    localStorage.setItem('soundVolume', volume);
    localStorage.setItem('soundEnabled', enabled.toString());
    
    document.getElementById('sound-volume-value').textContent = volume;
    document.getElementById('volume-slider').value = volume;
    document.getElementById('volume-value').textContent = volume;
    
    showCatMessage('Sound settings applied! 🔊');
}

function testSound() {
    showCatMessage('Meow! 🔊 (Sound test - actual audio not implemented)');
}

// Mouse Settings
function loadMouseSettings() {
    const speed = localStorage.getItem('mouseSpeed') || '1';
    const trails = localStorage.getItem('mouseTrails') === 'true';
    
    const speedSlider = document.getElementById('mouse-speed');
    const trailsCheckbox = document.getElementById('mouse-trails');
    
    if (speedSlider) speedSlider.value = speed;
    if (trailsCheckbox) trailsCheckbox.checked = trails;
    
    // Apply cursor speed (CSS cursor transition)
    document.body.style.cursor = trails ? 'crosshair' : 'default';
}

function applyMouseSettings() {
    const speed = document.getElementById('mouse-speed').value;
    const trails = document.getElementById('mouse-trails').checked;
    
    localStorage.setItem('mouseSpeed', speed);
    localStorage.setItem('mouseTrails', trails.toString());
    
    const speedText = speed < 0.8 ? 'Slow' : speed > 1.2 ? 'Fast' : 'Normal';
    document.getElementById('mouse-speed-value').textContent = speedText;
    
    document.body.style.cursor = trails ? 'crosshair' : 'default';
    
    showCatMessage('Mouse settings applied! 🖱️');
}

// Taskbar Settings
function loadTaskbarSettings() {
    const autohide = localStorage.getItem('taskbarAutohide') === 'true';
    const lock = localStorage.getItem('taskbarLock') !== 'false';
    const clock = localStorage.getItem('taskbarClock') !== 'false';
    
    const autohideCheckbox = document.getElementById('taskbar-autohide');
    const lockCheckbox = document.getElementById('taskbar-lock');
    const clockCheckbox = document.getElementById('taskbar-clock');
    
    if (autohideCheckbox) autohideCheckbox.checked = autohide;
    if (lockCheckbox) lockCheckbox.checked = lock;
    if (clockCheckbox) clockCheckbox.checked = clock;
    
    // Apply settings
    const taskbar = document.getElementById('taskbar');
    const clockEl = document.getElementById('clock');
    
    if (autohide) {
        taskbar.style.bottom = '-35px';
        taskbar.style.transition = 'bottom 0.3s';
        taskbar.addEventListener('mouseenter', () => taskbar.style.bottom = '0');
        taskbar.addEventListener('mouseleave', () => taskbar.style.bottom = '-35px');
    } else {
        taskbar.style.bottom = '0';
    }
    
    if (clockEl) clockEl.style.display = clock ? 'block' : 'none';
}

function applyTaskbarSettings() {
    const autohide = document.getElementById('taskbar-autohide').checked;
    const lock = document.getElementById('taskbar-lock').checked;
    const clock = document.getElementById('taskbar-clock').checked;
    
    localStorage.setItem('taskbarAutohide', autohide.toString());
    localStorage.setItem('taskbarLock', lock.toString());
    localStorage.setItem('taskbarClock', clock.toString());
    
    loadTaskbarSettings();
    
    showCatMessage('Taskbar settings applied! 📊');
}

// Internet Settings
function loadInternetSettings() {
    const homepage = localStorage.getItem('internetHomepage') || 'http://welcome.linux5.local';
    const proxy = localStorage.getItem('preferredProxy') || '0';
    
    const homepageInput = document.getElementById('internet-homepage');
    const proxySelect = document.getElementById('internet-proxy');
    
    if (homepageInput) homepageInput.value = homepage;
    if (proxySelect) proxySelect.value = proxy;
}

function applyInternetSettings() {
    const homepage = document.getElementById('internet-homepage').value;
    const proxy = document.getElementById('internet-proxy').value;
    
    localStorage.setItem('internetHomepage', homepage);
    localStorage.setItem('preferredProxy', proxy);
    
    currentProxyIndex = parseInt(proxy);
    
    showCatMessage('Internet settings applied! 🌐');
}

function addCustomProxy() {
    const customProxy = document.getElementById('internet-custom-proxy').value.trim();
    if (customProxy) {
        localStorage.setItem('customProxy', customProxy);
        proxyList.push({ name: 'Custom', url: customProxy });
        showCatMessage('Custom proxy added! 🌐');
    }
}

function testCurrentProxy() {
    const proxy = proxyList[currentProxyIndex];
    showCatMessage(`Testing ${proxy.name} proxy... (This will load a test URL)`);
    browserLoadURL('https://example.com');
    openWindow('browser-window');
}

function clearBrowserHistory() {
    browserHistory = [];
    browserHistoryIndex = -1;
    showCatMessage('Browsing history cleared! 🧹');
}

function clearAllData() {
    if (confirm('This will clear all browsing data including history, favorites, and cache. Continue?')) {
        browserHistory = [];
        browserHistoryIndex = -1;
        browserFavorites = [];
        localStorage.removeItem('browserFavorites');
        showCatMessage('All browsing data cleared! 🧹');
    }
}

function updateProxyPreview() {
    const proxyIndex = document.getElementById('internet-proxy').value;
    const proxy = proxyList[parseInt(proxyIndex)];
    showCatMessage(`Selected proxy: ${proxy.name}`);
}

// Date & Time Settings
function loadDateTimeSettings() {
    const format12 = localStorage.getItem('timeFormat12') !== 'false';
    const dateFormat = localStorage.getItem('dateFormat') || 'en-US';
    
    const format12Radio = document.querySelector('input[name="time-format"][value="12"]');
    const format24Radio = document.querySelector('input[name="time-format"][value="24"]');
    const dateFormatSelect = document.getElementById('datetime-format');
    
    if (format12Radio) format12Radio.checked = format12;
    if (format24Radio) format24Radio.checked = !format12;
    if (dateFormatSelect) dateFormatSelect.value = dateFormat;
    
    updateDateTimeCurrent();
}

function applyDateTimeSettings() {
    const format12 = document.querySelector('input[name="time-format"]:checked').value === '12';
    const dateFormat = document.getElementById('datetime-format').value;
    
    localStorage.setItem('timeFormat12', format12.toString());
    localStorage.setItem('dateFormat', dateFormat);
    
    updateDateTimeCurrent();
    updateClock(); // Update the taskbar clock
    
    showCatMessage('Date & Time settings applied! 🕐');
}

function updateDateTimeCurrent() {
    const currentEl = document.getElementById('datetime-current');
    if (!currentEl) return;
    
    const now = new Date();
    const format12 = localStorage.getItem('timeFormat12') !== 'false';
    const dateFormat = localStorage.getItem('dateFormat') || 'en-US';
    
    const timeStr = now.toLocaleTimeString('en-US', { hour12: format12 });
    const dateStr = now.toLocaleDateString(dateFormat);
    
    currentEl.textContent = `${dateStr} ${timeStr}`;
}

// System Settings
function resetAllSettings() {
    if (confirm('This will reset all settings to defaults. Continue?')) {
        localStorage.clear();
        location.reload();
    }
}

function exportSettings() {
    const settings = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        settings[key] = localStorage.getItem(key);
    }
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linux5-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showCatMessage('Settings exported! 💾');
}

function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const settings = JSON.parse(event.target.result);
                for (const key in settings) {
                    localStorage.setItem(key, settings[key]);
                }
                location.reload();
            } catch (err) {
                showCatMessage('Error importing settings! 😿');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Accessibility Settings
function loadAccessibilitySettings() {
    const contrast = localStorage.getItem('accessibilityContrast') === 'true';
    const largetext = localStorage.getItem('accessibilityLargetext') === 'true';
    const animations = localStorage.getItem('accessibilityAnimations') !== 'false';
    
    const contrastCheckbox = document.getElementById('accessibility-contrast');
    const largetextCheckbox = document.getElementById('accessibility-largetext');
    const animationsCheckbox = document.getElementById('accessibility-animations');
    
    if (contrastCheckbox) contrastCheckbox.checked = contrast;
    if (largetextCheckbox) largetextCheckbox.checked = largetext;
    if (animationsCheckbox) animationsCheckbox.checked = animations;
    
    // Apply settings
    if (contrast) {
        document.body.classList.add('high-contrast');
    }
    if (largetext) {
        document.body.style.fontSize = '16px';
    }
    if (!animations) {
        document.body.classList.add('no-animations');
    }
}

function applyAccessibilitySettings() {
    const contrast = document.getElementById('accessibility-contrast').checked;
    const largetext = document.getElementById('accessibility-largetext').checked;
    const animations = document.getElementById('accessibility-animations').checked;
    
    localStorage.setItem('accessibilityContrast', contrast.toString());
    localStorage.setItem('accessibilityLargetext', largetext.toString());
    localStorage.setItem('accessibilityAnimations', animations.toString());
    
    // Apply immediately
    document.body.classList.toggle('high-contrast', contrast);
    document.body.style.fontSize = largetext ? '16px' : '12px';
    document.body.classList.toggle('no-animations', !animations);
    
    showCatMessage('Accessibility settings applied! ♿');
}

// Cat Settings
// Cat size options
const catSizeOptions = {
    tiny: { width: 48, height: 48 },
    small: { width: 80, height: 80 },
    medium: { width: 128, height: 128 },
    large: { width: 200, height: 200 }
};

function loadCatSettings() {
    const enabled = localStorage.getItem('catEnabled') !== 'false';
    const name = localStorage.getItem('catName') || 'Buddy';
    const autoSpeak = localStorage.getItem('catAutoSpeak') !== 'false';
    const frequency = localStorage.getItem('catFrequency') || '60';
    const mood = localStorage.getItem('catMood') || 'playful';
    const size = localStorage.getItem('catSize') || 'small';
    
    const enabledCheckbox = document.getElementById('cat-enabled');
    const nameInput = document.getElementById('cat-name');
    const autoSpeakCheckbox = document.getElementById('cat-auto-speak');
    const frequencySelect = document.getElementById('cat-frequency');
    const moodSelect = document.getElementById('cat-mood');
    const sizeSelect = document.getElementById('cat-size');
    
    if (enabledCheckbox) enabledCheckbox.checked = enabled;
    if (nameInput) nameInput.value = name;
    if (autoSpeakCheckbox) autoSpeakCheckbox.checked = autoSpeak;
    if (frequencySelect) frequencySelect.value = frequency;
    if (moodSelect) moodSelect.value = mood;
    if (sizeSelect) sizeSelect.value = size;
    
    const cat = document.getElementById('cat-pet');
    if (cat) {
        cat.style.display = enabled ? 'block' : 'none';
        // Apply saved size
        const sizeOption = catSizeOptions[size];
        if (sizeOption) {
            cat.style.width = sizeOption.width + 'px';
            cat.style.height = sizeOption.height + 'px';
        }
    }
}

function applyCatSettings() {
    const enabled = document.getElementById('cat-enabled').checked;
    const name = document.getElementById('cat-name').value;
    const autoSpeak = document.getElementById('cat-auto-speak').checked;
    const frequency = document.getElementById('cat-frequency').value;
    const mood = document.getElementById('cat-mood').value;
    const size = document.getElementById('cat-size').value;
    
    localStorage.setItem('catEnabled', enabled.toString());
    localStorage.setItem('catName', name);
    localStorage.setItem('catAutoSpeak', autoSpeak.toString());
    localStorage.setItem('catFrequency', frequency);
    localStorage.setItem('catMood', mood);
    localStorage.setItem('catSize', size);
    
    const cat = document.getElementById('cat-pet');
    if (cat) {
        cat.style.display = enabled ? 'block' : 'none';
        // Apply selected size
        const sizeOption = catSizeOptions[size];
        if (sizeOption) {
            cat.style.width = sizeOption.width + 'px';
            cat.style.height = sizeOption.height + 'px';
        }
    }
    
    showCatMessage(`Settings applied! I'm ${name} the ${mood} cat! 🐱`);
}

// Control Panel View Toggle
let controlPanelClassicView = false;

function toggleControlPanelView() {
    controlPanelClassicView = !controlPanelClassicView;
    const grid = document.getElementById('control-panel-grid');
    const button = document.getElementById('cp-view-toggle');
    
    if (controlPanelClassicView) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        button.textContent = 'Switch to Category View';
    } else {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
        button.textContent = 'Switch to Classic View';
    }
}

// Initialize all settings on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add small delay to ensure DOM is ready
    setTimeout(() => {
        loadAllSettings();
        updateDateTimeCurrent();
        setInterval(updateDateTimeCurrent, 1000);
    }, 100);
});

// Initialize file system on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeFileSystem();
});

// ===== SOLITAIRE GAME =====
let solitaireState = {
    deck: [],
    drawPile: [],
    wastePile: [],
    foundations: [[], [], [], []],
    tableau: [[], [], [], [], [], [], []],
    drawMode: 1,
    score: 0,
    timer: 0,
    timerInterval: null,
    draggedCard: null,
    draggedFrom: null
};

function initializeSolitaire() {
    solitaireNew();
}

function solitaireNew() {
    // Reset state
    solitaireState.deck = createDeck();
    shuffleDeck(solitaireState.deck);
    solitaireState.drawPile = [];
    solitaireState.wastePile = [];
    solitaireState.foundations = [[], [], [], []];
    solitaireState.tableau = [[], [], [], [], [], [], []];
    solitaireState.score = 0;
    solitaireState.timer = 0;
    
    if (solitaireState.timerInterval) clearInterval(solitaireState.timerInterval);
    
    // Deal tableau
    for (let i = 0; i < 7; i++) {
        for (let j = i; j < 7; j++) {
            const card = solitaireState.deck.pop();
            card.faceUp = (i === j);
            solitaireState.tableau[j].push(card);
        }
    }
    
    // Remaining cards go to draw pile
    solitaireState.drawPile = solitaireState.deck;
    
    renderSolitaire();
    updateSolitaireDisplay();
    
    // Start timer
    solitaireState.timerInterval = setInterval(() => {
        solitaireState.timer++;
        document.getElementById('solitaire-time').textContent = solitaireState.timer;
    }, 1000);
}

function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];
    
    for (const suit of suits) {
        for (let i = 0; i < values.length; i++) {
            deck.push({
                suit,
                value: values[i],
                numValue: i + 1,
                color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
                faceUp: false
            });
        }
    }
    
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function solitaireToggleDraw() {
    solitaireState.drawMode = solitaireState.drawMode === 1 ? 3 : 1;
    document.getElementById('solitaire-draw-mode').textContent = solitaireState.drawMode;
}

function renderSolitaire() {
    const board = document.getElementById('solitaire-board');
    board.innerHTML = '';
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(7, 100px)';
    board.style.gridTemplateRows = 'auto';
    board.style.gap = '10px';
    board.style.padding = '20px';
    board.style.minHeight = '500px';
    
    // Top row: draw pile, waste pile, empty, foundations
    const topRow = document.createElement('div');
    topRow.style.display = 'contents';
    
    // Draw pile
    const drawPile = createPile('draw', solitaireState.drawPile.length > 0);
    drawPile.onclick = drawFromDeck;
    topRow.appendChild(drawPile);
    
    // Waste pile
    const wastePile = createPile('waste', solitaireState.wastePile.length > 0);
    if (solitaireState.wastePile.length > 0) {
        const topCard = solitaireState.wastePile[solitaireState.wastePile.length - 1];
        wastePile.appendChild(createCardElement(topCard, 'waste', solitaireState.wastePile.length - 1));
    }
    topRow.appendChild(wastePile);
    
    // Empty space
    topRow.appendChild(document.createElement('div'));
    
    // Foundations
    for (let i = 0; i < 4; i++) {
        const foundation = createPile('foundation-' + i, solitaireState.foundations[i].length > 0);
        if (solitaireState.foundations[i].length > 0) {
            const topCard = solitaireState.foundations[i][solitaireState.foundations[i].length - 1];
            foundation.appendChild(createCardElement(topCard, 'foundation-' + i, solitaireState.foundations[i].length - 1));
        }
        foundation.ondragover = (e) => e.preventDefault();
        foundation.ondrop = (e) => handleDrop(e, 'foundation', i);
        topRow.appendChild(foundation);
    }
    
    board.appendChild(topRow);
    
    // Tableau piles
    for (let i = 0; i < 7; i++) {
        const pile = createTableauPile(i);
        board.appendChild(pile);
    }
}

function createPile(type, hasCards) {
    const pile = document.createElement('div');
    pile.className = 'solitaire-pile';
    pile.dataset.pile = type;
    pile.style.width = '80px';
    pile.style.height = '110px';
    pile.style.border = '2px dashed ' + (hasCards ? '#0f0' : '#666');
    pile.style.borderRadius = '5px';
    pile.style.position = 'relative';
    pile.style.background = 'rgba(0,0,0,0.3)';
    return pile;
}

function createTableauPile(index) {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.minHeight = '110px';
    container.dataset.pile = 'tableau-' + index;
    container.ondragover = (e) => e.preventDefault();
    container.ondrop = (e) => handleDrop(e, 'tableau', index);
    
    const cards = solitaireState.tableau[index];
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardEl = createCardElement(card, 'tableau-' + index, i);
        cardEl.style.top = (i * 25) + 'px';
        container.appendChild(cardEl);
    }
    
    return container;
}

function createCardElement(card, pile, index) {
    const cardEl = document.createElement('div');
    cardEl.className = 'solitaire-card ' + (card.faceUp ? card.color : 'facedown');
    cardEl.style.width = '80px';
    cardEl.style.height = '110px';
    cardEl.style.border = '1px solid #000';
    cardEl.style.borderRadius = '5px';
    cardEl.style.background = card.faceUp ? '#fff' : '#0066cc';
    cardEl.style.position = 'absolute';
    cardEl.style.display = 'flex';
    cardEl.style.flexDirection = 'column';
    cardEl.style.alignItems = 'center';
    cardEl.style.justifyContent = 'center';
    cardEl.style.cursor = card.faceUp ? 'grab' : 'default';
    cardEl.style.userSelect = 'none';
    
    if (card.faceUp) {
        const valueEl = document.createElement('div');
        valueEl.textContent = card.value;
        valueEl.style.fontSize = '24px';
        valueEl.style.fontWeight = 'bold';
        valueEl.style.color = card.color;
        
        const suitEl = document.createElement('div');
        suitEl.textContent = card.suit;
        suitEl.style.fontSize = '32px';
        
        cardEl.appendChild(valueEl);
        cardEl.appendChild(suitEl);
        
        cardEl.draggable = true;
        cardEl.dataset.pile = pile;
        cardEl.dataset.index = index;
        cardEl.ondragstart = (e) => handleDragStart(e, card, pile, index);
    }
    
    return cardEl;
}

function drawFromDeck() {
    if (solitaireState.drawPile.length === 0) {
        // Recycle waste pile
        solitaireState.drawPile = solitaireState.wastePile.reverse();
        solitaireState.wastePile = [];
        solitaireState.drawPile.forEach(card => card.faceUp = false);
    } else {
        const card = solitaireState.drawPile.pop();
        card.faceUp = true;
        solitaireState.wastePile.push(card);
    }
    renderSolitaire();
}

function handleDragStart(e, card, pile, index) {
    solitaireState.draggedCard = card;
    solitaireState.draggedFrom = { pile, index };
    e.dataTransfer.effectAllowed = 'move';
}

function handleDrop(e, pileType, pileIndex) {
    e.preventDefault();
    
    const card = solitaireState.draggedCard;
    const from = solitaireState.draggedFrom;
    
    if (!card || !from) return;
    
    let canMove = false;
    
    if (pileType === 'tableau') {
        canMove = canPlaceOnTableau(card, solitaireState.tableau[pileIndex]);
        if (canMove) {
            moveCardToTableau(card, from, pileIndex);
        }
    } else if (pileType === 'foundation') {
        canMove = canPlaceOnFoundation(card, pileIndex);
        if (canMove) {
            moveCardToFoundation(card, from, pileIndex);
        }
    }
    
    solitaireState.draggedCard = null;
    solitaireState.draggedFrom = null;
}

function canPlaceOnTableau(card, pile) {
    if (pile.length === 0) {
        return card.value === 'K';
    }
    
    const topCard = pile[pile.length - 1];
    return topCard.faceUp &&
           card.color !== topCard.color &&
           card.numValue === topCard.numValue - 1;
}

function canPlaceOnFoundation(card, foundationIndex) {
    const foundation = solitaireState.foundations[foundationIndex];
    
    if (foundation.length === 0) {
        return card.value === 'A';
    }
    
    const topCard = foundation[foundation.length - 1];
    return card.suit === topCard.suit &&
           card.numValue === topCard.numValue + 1;
}

function moveCardToTableau(card, from, toIndex) {
    removeCardFromSource(from);
    solitaireState.tableau[toIndex].push(card);
    flipTopCard(from.pile);
    solitaireState.score += 5;
    renderSolitaire();
    updateSolitaireDisplay();
    checkWin();
}

function moveCardToFoundation(card, from, foundationIndex) {
    removeCardFromSource(from);
    solitaireState.foundations[foundationIndex].push(card);
    flipTopCard(from.pile);
    solitaireState.score += 10;
    renderSolitaire();
    updateSolitaireDisplay();
    checkWin();
}

function removeCardFromSource(from) {
    if (from.pile.startsWith('tableau-')) {
        const pileIndex = parseInt(from.pile.split('-')[1]);
        solitaireState.tableau[pileIndex].splice(from.index);
    } else if (from.pile === 'waste') {
        solitaireState.wastePile.pop();
    }
}

function flipTopCard(pile) {
    if (pile.startsWith('tableau-')) {
        const pileIndex = parseInt(pile.split('-')[1]);
        const tableauPile = solitaireState.tableau[pileIndex];
        if (tableauPile.length > 0) {
            tableauPile[tableauPile.length - 1].faceUp = true;
        }
    }
}

function checkWin() {
    const allFoundations = solitaireState.foundations;
    const won = allFoundations.every(f => f.length === 13);
    
    if (won) {
        setTimeout(() => {
            showCatMessage('Congratulations! You won! 🎉 Score: ' + solitaireState.score);
        }, 100);
    }
}

function updateSolitaireDisplay() {
    document.getElementById('solitaire-score').textContent = solitaireState.score;
    document.getElementById('solitaire-time').textContent = solitaireState.timer;
}

// ===== SNAKE GAME =====
let snakeState = {
    canvas: null,
    ctx: null,
    snake: [],
    food: null,
    direction: 'right',
    nextDirection: 'right',
    score: 0,
    highScore: 0,
    gameLoop: null,
    gameOver: false,
    gridSize: 20,
    speed: 150
};

function initializeSnake() {
    snakeState.canvas = document.getElementById('snake-canvas');
    snakeState.ctx = snakeState.canvas.getContext('2d');
    snakeState.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
    document.getElementById('snake-high').textContent = snakeState.highScore;
    
    document.addEventListener('keydown', (e) => {
        if (!snakeState.canvas.parentElement.parentElement.classList.contains('active')) return;
        
        switch(e.key) {
            case 'ArrowUp':
                if (snakeState.direction !== 'down') snakeState.nextDirection = 'up';
                e.preventDefault();
                break;
            case 'ArrowDown':
                if (snakeState.direction !== 'up') snakeState.nextDirection = 'down';
                e.preventDefault();
                break;
            case 'ArrowLeft':
                if (snakeState.direction !== 'right') snakeState.nextDirection = 'left';
                e.preventDefault();
                break;
            case 'ArrowRight':
                if (snakeState.direction !== 'left') snakeState.nextDirection = 'right';
                e.preventDefault();
                break;
        }
    });
    
    snakeNew();
}

function snakeNew() {
    snakeState.snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    snakeState.direction = 'right';
    snakeState.nextDirection = 'right';
    snakeState.score = 0;
    snakeState.gameOver = false;
    snakeState.speed = 150;
    
    snakeSpawnFood();
    document.getElementById('snake-score').textContent = 0;
    
    if (snakeState.gameLoop) clearInterval(snakeState.gameLoop);
    snakeState.gameLoop = setInterval(snakeUpdate, snakeState.speed);
}

function snakeSpawnFood() {
    const maxX = snakeState.canvas.width / snakeState.gridSize;
    const maxY = snakeState.canvas.height / snakeState.gridSize;
    
    do {
        snakeState.food = {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
    } while (snakeState.snake.some(seg => seg.x === snakeState.food.x && seg.y === snakeState.food.y));
}

function snakeUpdate() {
    if (snakeState.gameOver) return;
    
    snakeState.direction = snakeState.nextDirection;
    
    // Move snake
    const head = {...snakeState.snake[0]};
    
    switch(snakeState.direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Check wall collision
    const maxX = snakeState.canvas.width / snakeState.gridSize;
    const maxY = snakeState.canvas.height / snakeState.gridSize;
    
    if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY) {
        snakeGameOver();
        return;
    }
    
    // Check self collision
    if (snakeState.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        snakeGameOver();
        return;
    }
    
    snakeState.snake.unshift(head);
    
    // Check food collision
    if (head.x === snakeState.food.x && head.y === snakeState.food.y) {
        snakeState.score += 10;
        document.getElementById('snake-score').textContent = snakeState.score;
        snakeSpawnFood();
        
        // Increase speed slightly
        if (snakeState.score % 50 === 0 && snakeState.speed > 50) {
            snakeState.speed -= 10;
            clearInterval(snakeState.gameLoop);
            snakeState.gameLoop = setInterval(snakeUpdate, snakeState.speed);
        }
    } else {
        snakeState.snake.pop();
    }
    
    snakeDraw();
}

function snakeDraw() {
    const ctx = snakeState.ctx;
    const gs = snakeState.gridSize;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, snakeState.canvas.width, snakeState.canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#0f0';
    snakeState.snake.forEach((seg, i) => {
        ctx.fillRect(seg.x * gs, seg.y * gs, gs - 2, gs - 2);
        if (i === 0) {
            ctx.fillStyle = '#0f0';
        }
    });
    
    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(snakeState.food.x * gs, snakeState.food.y * gs, gs - 2, gs - 2);
}

function snakeGameOver() {
    snakeState.gameOver = true;
    clearInterval(snakeState.gameLoop);
    
    if (snakeState.score > snakeState.highScore) {
        snakeState.highScore = snakeState.score;
        localStorage.setItem('snakeHighScore', snakeState.highScore);
        document.getElementById('snake-high').textContent = snakeState.highScore;
        showCatMessage(`New high score: ${snakeState.highScore}! 🐍`);
    }
    
    const ctx = snakeState.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, snakeState.canvas.width, snakeState.canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', snakeState.canvas.width / 2, snakeState.canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${snakeState.score}`, snakeState.canvas.width / 2, snakeState.canvas.height / 2 + 40);
}

// ===== TETRIS GAME =====
let tetrisState = {
    canvas: null,
    ctx: null,
    nextCanvas: null,
    nextCtx: null,
    board: [],
    currentPiece: null,
    nextPiece: null,
    score: 0,
    lines: 0,
    level: 1,
    gameLoop: null,
    gameOver: false,
    paused: false,
    blockSize: 30,
    rows: 20,
    cols: 10,
    dropCounter: 0,
    dropInterval: 1000
};

const TETROMINOS = {
    'I': [[1,1,1,1]],
    'O': [[1,1],[1,1]],
    'T': [[0,1,0],[1,1,1]],
    'S': [[0,1,1],[1,1,0]],
    'Z': [[1,1,0],[0,1,1]],
    'J': [[1,0,0],[1,1,1]],
    'L': [[0,0,1],[1,1,1]]
};

const COLORS = {
    'I': '#00f0f0',
    'O': '#f0f000',
    'T': '#a000f0',
    'S': '#00f000',
    'Z': '#f00000',
    'J': '#0000f0',
    'L': '#f0a000'
};

function initializeTetris() {
    tetrisState.canvas = document.getElementById('tetris-canvas');
    tetrisState.ctx = tetrisState.canvas.getContext('2d');
    tetrisState.nextCanvas = document.getElementById('tetris-next-canvas');
    tetrisState.nextCtx = tetrisState.nextCanvas.getContext('2d');
    
    document.addEventListener('keydown', (e) => {
        if (!tetrisState.canvas.parentElement.parentElement.classList.contains('active')) return;
        if (tetrisState.gameOver || tetrisState.paused) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                tetrisMovePiece(-1, 0);
                e.preventDefault();
                break;
            case 'ArrowRight':
                tetrisMovePiece(1, 0);
                e.preventDefault();
                break;
            case 'ArrowDown':
                tetrisMovePiece(0, 1);
                e.preventDefault();
                break;
            case 'ArrowUp':
                tetrisRotatePiece();
                e.preventDefault();
                break;
            case ' ':
                tetrisHardDrop();
                e.preventDefault();
                break;
        }
    });
    
    tetrisNew();
}

function tetrisNew() {
    tetrisState.board = Array(tetrisState.rows).fill(null).map(() => Array(tetrisState.cols).fill(0));
    tetrisState.score = 0;
    tetrisState.lines = 0;
    tetrisState.level = 1;
    tetrisState.gameOver = false;
    tetrisState.paused = false;
    tetrisState.dropInterval = 1000;
    
    tetrisState.currentPiece = tetrisCreatePiece();
    tetrisState.nextPiece = tetrisCreatePiece();
    
    tetrisUpdateDisplay();
    tetrisDrawNext();
    
    if (tetrisState.gameLoop) clearInterval(tetrisState.gameLoop);
    tetrisState.gameLoop = setInterval(tetrisUpdate, 50);
}

function tetrisCreatePiece() {
    const pieces = Object.keys(TETROMINOS);
    const type = pieces[Math.floor(Math.random() * pieces.length)];
    return {
        type,
        shape: JSON.parse(JSON.stringify(TETROMINOS[type])),
        x: Math.floor(tetrisState.cols / 2) - 1,
        y: 0,
        color: COLORS[type]
    };
}

function tetrisUpdate() {
    if (tetrisState.gameOver || tetrisState.paused) return;
    
    tetrisState.dropCounter += 50;
    
    if (tetrisState.dropCounter > tetrisState.dropInterval) {
        if (!tetrisMovePiece(0, 1)) {
            tetrisMergePiece();
            tetrisClearLines();
            tetrisState.currentPiece = tetrisState.nextPiece;
            tetrisState.nextPiece = tetrisCreatePiece();
            tetrisDrawNext();
            
            if (tetrisCheckCollision(tetrisState.currentPiece)) {
                tetrisGameOver();
            }
        }
        tetrisState.dropCounter = 0;
    }
    
    tetrisDraw();
}

function tetrisMovePiece(dx, dy) {
    tetrisState.currentPiece.x += dx;
    tetrisState.currentPiece.y += dy;
    
    if (tetrisCheckCollision(tetrisState.currentPiece)) {
        tetrisState.currentPiece.x -= dx;
        tetrisState.currentPiece.y -= dy;
        return false;
    }
    
    return true;
}

function tetrisRotatePiece() {
    const piece = tetrisState.currentPiece;
    const newShape = piece.shape[0].map((_, i) => 
        piece.shape.map(row => row[i]).reverse()
    );
    
    const oldShape = piece.shape;
    piece.shape = newShape;
    
    if (tetrisCheckCollision(piece)) {
        piece.shape = oldShape;
    }
}

function tetrisHardDrop() {
    while (tetrisMovePiece(0, 1)) {}
    tetrisState.dropCounter = tetrisState.dropInterval;
}

function tetrisCheckCollision(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const newX = piece.x + x;
                const newY = piece.y + y;
                
                if (newX < 0 || newX >= tetrisState.cols || newY >= tetrisState.rows) {
                    return true;
                }
                
                if (newY >= 0 && tetrisState.board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function tetrisMergePiece() {
    const piece = tetrisState.currentPiece;
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const boardY = piece.y + y;
                const boardX = piece.x + x;
                if (boardY >= 0) {
                    tetrisState.board[boardY][boardX] = piece.color;
                }
            }
        }
    }
}

function tetrisClearLines() {
    let linesCleared = 0;
    
    for (let y = tetrisState.rows - 1; y >= 0; y--) {
        if (tetrisState.board[y].every(cell => cell !== 0)) {
            tetrisState.board.splice(y, 1);
            tetrisState.board.unshift(Array(tetrisState.cols).fill(0));
            linesCleared++;
            y++;
        }
    }
    
    if (linesCleared > 0) {
        tetrisState.lines += linesCleared;
        tetrisState.score += [0, 100, 300, 500, 800][linesCleared] * tetrisState.level;
        tetrisState.level = Math.floor(tetrisState.lines / 10) + 1;
        tetrisState.dropInterval = Math.max(100, 1000 - (tetrisState.level - 1) * 100);
        tetrisUpdateDisplay();
    }
}

function tetrisDraw() {
    const ctx = tetrisState.ctx;
    const bs = tetrisState.blockSize;
    
    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, tetrisState.canvas.width, tetrisState.canvas.height);
    
    // Draw board
    for (let y = 0; y < tetrisState.rows; y++) {
        for (let x = 0; x < tetrisState.cols; x++) {
            if (tetrisState.board[y][x]) {
                ctx.fillStyle = tetrisState.board[y][x];
                ctx.fillRect(x * bs, y * bs, bs - 1, bs - 1);
            }
        }
    }
    
    // Draw current piece
    const piece = tetrisState.currentPiece;
    ctx.fillStyle = piece.color;
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                ctx.fillRect((piece.x + x) * bs, (piece.y + y) * bs, bs - 1, bs - 1);
            }
        }
    }
}

function tetrisDrawNext() {
    const ctx = tetrisState.nextCtx;
    const piece = tetrisState.nextPiece;
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, tetrisState.nextCanvas.width, tetrisState.nextCanvas.height);
    
    ctx.fillStyle = piece.color;
    const bs = 20;
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                ctx.fillRect(x * bs + 10, y * bs + 10, bs - 1, bs - 1);
            }
        }
    }
}

function tetrisUpdateDisplay() {
    document.getElementById('tetris-score').textContent = tetrisState.score;
    document.getElementById('tetris-lines').textContent = tetrisState.lines;
    document.getElementById('tetris-level').textContent = tetrisState.level;
}

function tetrisPause() {
    tetrisState.paused = !tetrisState.paused;
}

function tetrisGameOver() {
    tetrisState.gameOver = true;
    clearInterval(tetrisState.gameLoop);
    
    const ctx = tetrisState.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, tetrisState.canvas.width, tetrisState.canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', tetrisState.canvas.width / 2, tetrisState.canvas.height / 2);
}

// ===== PINBALL GAME =====
let pinballState = {
    canvas: null,
    ctx: null,
    ball: null,
    leftFlipper: null,
    rightFlipper: null,
    bumpers: [],
    score: 0,
    ballsLeft: 3,
    gameOver: false,
    gameLoop: null,
    keys: {}
};

function initializePinball() {
    pinballState.canvas = document.getElementById('pinball-canvas');
    pinballState.ctx = pinballState.canvas.getContext('2d');
    
    document.addEventListener('keydown', (e) => {
        if (!pinballState.canvas.parentElement.parentElement.classList.contains('active')) return;
        if (e.key === 'z' || e.key === 'Z') pinballState.keys.leftFlipper = true;
        if (e.key === '/' || e.key === '?') pinballState.keys.rightFlipper = true;
        if (e.key === ' ' && !pinballState.ball.active && !pinballState.gameOver) {
            e.preventDefault();
            launchBall();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'z' || e.key === 'Z') pinballState.keys.leftFlipper = false;
        if (e.key === '/' || e.key === '?') pinballState.keys.rightFlipper = false;
    });
    
    pinballNew();
}

function pinballNew() {
    const width = pinballState.canvas.width;
    const height = pinballState.canvas.height;
    
    pinballState.score = 0;
    pinballState.ballsLeft = 3;
    pinballState.gameOver = false;
    
    pinballState.ball = {
        x: width / 2,
        y: 50,
        radius: 8,
        vx: 0,
        vy: 0,
        gravity: 0.3,
        bounce: 0.7,
        active: false
    };
    
    pinballState.leftFlipper = {
        x: width * 0.3,
        y: height - 50,
        length: 60,
        angle: -0.3,
        restAngle: -0.3,
        activeAngle: -0.8,
        active: false
    };
    
    pinballState.rightFlipper = {
        x: width * 0.7,
        y: height - 50,
        length: 60,
        angle: 0.3,
        restAngle: 0.3,
        activeAngle: 0.8,
        active: false
    };
    
    pinballState.bumpers = [
        { x: width * 0.3, y: 150, radius: 30, score: 100 },
        { x: width * 0.5, y: 120, radius: 30, score: 100 },
        { x: width * 0.7, y: 150, radius: 30, score: 100 }
    ];
    
    document.getElementById('pinball-score').textContent = 0;
    document.getElementById('pinball-balls').textContent = 3;
    
    if (pinballState.gameLoop) cancelAnimationFrame(pinballState.gameLoop);
    pinballGameLoop();
}

function launchBall() {
    pinballState.ball.active = true;
    pinballState.ball.x = pinballState.canvas.width - 50;
    pinballState.ball.y = pinballState.canvas.height - 100;
    pinballState.ball.vx = -5;
    pinballState.ball.vy = -15;
}

function pinballGameLoop() {
    pinballUpdate();
    pinballDraw();
    pinballState.gameLoop = requestAnimationFrame(pinballGameLoop);
}

function pinballUpdate() {
    if (!pinballState.ball.active || pinballState.gameOver) return;
    
    const ball = pinballState.ball;
    const width = pinballState.canvas.width;
    const height = pinballState.canvas.height;
    
    // Apply gravity
    ball.vy += ball.gravity;
    
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    // Wall collisions
    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= -ball.bounce;
    }
    if (ball.x + ball.radius > width) {
        ball.x = width - ball.radius;
        ball.vx *= -ball.bounce;
    }
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy *= -ball.bounce;
    }
    
    // Ball drain (bottom)
    if (ball.y > height) {
        pinballState.ballsLeft--;
        ball.active = false;
        document.getElementById('pinball-balls').textContent = pinballState.ballsLeft;
        
        if (pinballState.ballsLeft <= 0) {
            pinballState.gameOver = true;
            setTimeout(() => {
                showCatMessage('Game Over! Final Score: ' + pinballState.score);
            }, 100);
        } else {
            setTimeout(() => {
                showCatMessage('Ball Lost! ' + pinballState.ballsLeft + ' balls remaining. Press SPACE to launch.');
            }, 100);
        }
    }
    
    // Bumper collisions
    for (const bumper of pinballState.bumpers) {
        const dx = ball.x - bumper.x;
        const dy = ball.y - bumper.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < ball.radius + bumper.radius) {
            // Bounce away from bumper
            const angle = Math.atan2(dy, dx);
            ball.vx = Math.cos(angle) * 10;
            ball.vy = Math.sin(angle) * 10;
            pinballState.score += bumper.score;
            document.getElementById('pinball-score').textContent = pinballState.score;
        }
    }
    
    // Flipper physics
    updateFlipper(pinballState.leftFlipper, pinballState.keys.leftFlipper);
    updateFlipper(pinballState.rightFlipper, pinballState.keys.rightFlipper);
    checkFlipperCollision(pinballState.leftFlipper);
    checkFlipperCollision(pinballState.rightFlipper);
}

function updateFlipper(flipper, isActive) {
    flipper.active = isActive;
    const targetAngle = flipper.active ? flipper.activeAngle : flipper.restAngle;
    flipper.angle += (targetAngle - flipper.angle) * 0.3;
}

function checkFlipperCollision(flipper) {
    const ball = pinballState.ball;
    const endX = flipper.x + Math.cos(flipper.angle) * flipper.length;
    const endY = flipper.y + Math.sin(flipper.angle) * flipper.length;
    
    const dx = ball.x - endX;
    const dy = ball.y - endY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < ball.radius + 10 && flipper.active) {
        // Hit by flipper - launch ball
        const angle = flipper.angle - Math.PI / 2;
        ball.vx = Math.cos(angle) * 15;
        ball.vy = Math.sin(angle) * 15;
    }
}

function pinballDraw() {
    const ctx = pinballState.ctx;
    const width = pinballState.canvas.width;
    const height = pinballState.canvas.height;
    
    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw bumpers
    ctx.fillStyle = '#ff0';
    for (const bumper of pinballState.bumpers) {
        ctx.beginPath();
        ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw flippers
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 8;
    drawFlipper(pinballState.leftFlipper);
    drawFlipper(pinballState.rightFlipper);
    
    // Draw ball
    if (pinballState.ball.active) {
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(pinballState.ball.x, pinballState.ball.y, pinballState.ball.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw UI
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + pinballState.score, 10, 30);
    ctx.fillText('Balls: ' + pinballState.ballsLeft, 10, 60);
    if (!pinballState.ball.active && !pinballState.gameOver) {
        ctx.fillText('Press SPACE to launch', width / 2 - 100, height / 2);
    }
}

function drawFlipper(flipper) {
    const ctx = pinballState.ctx;
    ctx.beginPath();
    ctx.moveTo(flipper.x, flipper.y);
    const endX = flipper.x + Math.cos(flipper.angle) * flipper.length;
    const endY = flipper.y + Math.sin(flipper.angle) * flipper.length;
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

// ===== TIC-TAC-TOE GAME =====
let tictactoeState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    vsAI: true,
    gameOver: false,
    scores: { X: 0, O: 0, draw: 0 }
};

function initializeTicTacToe() {
    const saved = localStorage.getItem('tictactoeScores');
    if (saved) {
        tictactoeState.scores = JSON.parse(saved);
    }
    tictactoeNew();
}

function tictactoeNew() {
    tictactoeState.board = ['', '', '', '', '', '', '', '', ''];
    tictactoeState.currentPlayer = 'X';
    tictactoeState.gameOver = false;
    tictactoeRender();
    tictactoeUpdateStatus('Your turn (X)');
    tictactoeUpdateScores();
}

function tictactoeRender() {
    const board = document.getElementById('tictactoe-board');
    board.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'tictactoe-cell';
        if (tictactoeState.board[i]) {
            cell.textContent = tictactoeState.board[i];
            cell.classList.add(tictactoeState.board[i].toLowerCase());
        }
        cell.onclick = () => tictactoeMove(i);
        board.appendChild(cell);
    }
}

function tictactoeMove(index) {
    if (tictactoeState.gameOver || tictactoeState.board[index]) return;
    
    tictactoeState.board[index] = tictactoeState.currentPlayer;
    tictactoeRender();
    
    const winner = tictactoeCheckWinner();
    if (winner) {
        tictactoeEndGame(winner);
        return;
    }
    
    if (tictactoeState.board.every(cell => cell !== '')) {
        tictactoeEndGame('draw');
        return;
    }
    
    tictactoeState.currentPlayer = tictactoeState.currentPlayer === 'X' ? 'O' : 'X';
    
    if (tictactoeState.vsAI && tictactoeState.currentPlayer === 'O') {
        tictactoeUpdateStatus('Computer thinking...');
        setTimeout(() => {
            tictactoeAIMove();
        }, 500);
    } else {
        tictactoeUpdateStatus(`${tictactoeState.currentPlayer}'s turn`);
    }
}

function tictactoeAIMove() {
    // Simple AI: random empty cell
    const empty = [];
    tictactoeState.board.forEach((cell, i) => {
        if (!cell) empty.push(i);
    });
    
    if (empty.length > 0) {
        const move = empty[Math.floor(Math.random() * empty.length)];
        tictactoeMove(move);
    }
}

function tictactoeCheckWinner() {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (const [a, b, c] of wins) {
        if (tictactoeState.board[a] && 
            tictactoeState.board[a] === tictactoeState.board[b] && 
            tictactoeState.board[a] === tictactoeState.board[c]) {
            return tictactoeState.board[a];
        }
    }
    
    return null;
}

function tictactoeEndGame(result) {
    tictactoeState.gameOver = true;
    
    if (result === 'draw') {
        tictactoeState.scores.draw++;
        tictactoeUpdateStatus('Draw!');
    } else {
        tictactoeState.scores[result]++;
        tictactoeUpdateStatus(`${result} wins!`);
    }
    
    localStorage.setItem('tictactoeScores', JSON.stringify(tictactoeState.scores));
    tictactoeUpdateScores();
}

function tictactoeUpdateStatus(msg) {
    document.getElementById('tictactoe-status').textContent = msg;
}

function tictactoeUpdateScores() {
    document.getElementById('tictactoe-score-x').textContent = tictactoeState.scores.X;
    document.getElementById('tictactoe-score-o').textContent = tictactoeState.scores.O;
    document.getElementById('tictactoe-score-draw').textContent = tictactoeState.scores.draw;
}

function tictactoeToggleMode() {
    tictactoeState.vsAI = !tictactoeState.vsAI;
    document.getElementById('tictactoe-mode').textContent = tictactoeState.vsAI ? 'vs AI' : '2 Player';
    tictactoeNew();
}

// ===== NEW SETTINGS FUNCTIONS =====

// Network Settings
function applyNetworkSettings() {
    const useProxy = document.getElementById('network-use-proxy').checked;
    const proxyAddress = document.getElementById('network-proxy-address').value;
    const proxyPort = document.getElementById('network-proxy-port').value;
    
    localStorage.setItem('networkUseProxy', useProxy.toString());
    localStorage.setItem('networkProxyAddress', proxyAddress);
    localStorage.setItem('networkProxyPort', proxyPort);
    
    showCatMessage('Network settings applied! 📡');
}

function testNetworkConnection() {
    const status = document.getElementById('network-status');
    status.innerHTML = 'Status: <span style="color: orange;">Testing...</span>';
    
    setTimeout(() => {
        status.innerHTML = 'Status: <span style="color: green;">Connected</span>';
        showCatMessage('Connection test successful! 🌐');
    }, 1500);
}

// User Accounts Settings
function changeUsername() {
    const newName = prompt('Enter new username:', 'Guest User');
    if (newName) {
        document.getElementById('user-current-name').textContent = newName;
        document.querySelector('.user-name').textContent = newName;
        localStorage.setItem('username', newName);
        showCatMessage(`Username changed to "${newName}"! 👤`);
    }
}

function changeUserAvatar() {
    const avatar = document.getElementById('user-avatar').value;
    document.querySelector('.user-icon').textContent = avatar;
    showCatMessage('Avatar changed! 😊');
}

function applyUserAccountSettings() {
    const guestEnabled = document.getElementById('user-guest-enabled').checked;
    const avatar = document.getElementById('user-avatar').value;
    
    localStorage.setItem('userGuestEnabled', guestEnabled.toString());
    localStorage.setItem('userAvatar', avatar);
    
    document.querySelector('.user-icon').textContent = avatar;
    
    showCatMessage('User account settings applied! 👤');
}

// Power Settings
function applyPowerSettings() {
    const screenTimeout = document.getElementById('power-screen-timeout').value;
    const sleepTimeout = document.getElementById('power-sleep-timeout').value;
    const powerPlan = document.querySelector('input[name="power-plan"]:checked').value;
    
    localStorage.setItem('powerScreenTimeout', screenTimeout);
    localStorage.setItem('powerSleepTimeout', sleepTimeout);
    localStorage.setItem('powerPlan', powerPlan);
    
    showCatMessage('Power settings applied! 🔋');
}

// Folder Settings
function applyFolderSettings() {
    const showHidden = document.getElementById('folder-show-hidden').checked;
    const showExtensions = document.getElementById('folder-show-extensions').checked;
    const showSystem = document.getElementById('folder-show-system').checked;
    const clickMode = document.querySelector('input[name="folder-click"]:checked').value;
    const defaultView = document.getElementById('folder-default-view').value;
    
    localStorage.setItem('folderShowHidden', showHidden.toString());
    localStorage.setItem('folderShowExtensions', showExtensions.toString());
    localStorage.setItem('folderShowSystem', showSystem.toString());
    localStorage.setItem('folderClickMode', clickMode);
    localStorage.setItem('folderDefaultView', defaultView);
    
    // Apply default view
    fmViewMode = defaultView;
    if (document.getElementById('filemanager-window').classList.contains('active')) {
        renderFileManager();
    }
    
    showCatMessage('Folder options applied! 📂');
}

// Keyboard Settings
function applyKeyboardSettings() {
    const shortcutsEnabled = document.getElementById('keyboard-shortcuts-enabled').checked;
    const repeatDelay = document.getElementById('keyboard-repeat-delay').value;
    const repeatRate = document.getElementById('keyboard-repeat-rate').value;
    
    localStorage.setItem('keyboardShortcutsEnabled', shortcutsEnabled.toString());
    localStorage.setItem('keyboardRepeatDelay', repeatDelay);
    localStorage.setItem('keyboardRepeatRate', repeatRate);
    
    showCatMessage('Keyboard settings applied! ⌨️');
}

// Regional Settings
function applyRegionalSettings() {
    const language = document.getElementById('regional-language').value;
    const decimal = document.getElementById('regional-decimal').value;
    const grouping = document.getElementById('regional-grouping').value;
    const currency = document.getElementById('regional-currency').value;
    const currencyPosition = document.getElementById('regional-currency-position').value;
    
    localStorage.setItem('regionalLanguage', language);
    localStorage.setItem('regionalDecimal', decimal);
    localStorage.setItem('regionalGrouping', grouping);
    localStorage.setItem('regionalCurrency', currency);
    localStorage.setItem('regionalCurrencyPosition', currencyPosition);
    
    showCatMessage('Regional settings applied! 🌍');
}
