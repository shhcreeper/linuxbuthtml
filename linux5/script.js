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
    
    // Center window if not positioned
    if (!window.style.left) {
        window.style.left = (window.innerWidth / 2 - 300) + 'px';
        window.style.top = (window.innerHeight / 2 - 200) + 'px';
        window.style.width = '500px';
        window.style.height = '400px';
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

function loadURLWithProxy(url, proxyIndex = currentProxyIndex, triedProxies = []) {
    const content = document.getElementById('browser-content');
    const loading = document.getElementById('browser-loading');
    
    // Validate URL
    try {
        new URL(url);
    } catch (e) {
        content.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <h2 style="color: red;">⚠️ Invalid URL</h2>
                <p>The URL <strong>${url}</strong> is not valid.</p>
                <p style="margin-top: 20px;">
                    <button onclick="browserNavigate('welcome')" class="browser-btn">Go to Home Page</button>
                </p>
            </div>
        `;
        return;
    }
    
    // Check if we've tried all proxies
    if (proxyIndex >= proxyList.length) {
        loading.classList.add('hidden');
        updateBrowserStatus('All proxies failed');
        content.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <h2 style="color: red;">⚠️ Cannot Display Page</h2>
                <p>The page at <strong>${url}</strong> could not be loaded with any proxy.</p>
                <p style="font-size: 12px; color: #666; margin-top: 15px;">
                    <strong>Tried proxies:</strong><br>
                    ${triedProxies.join('<br>')}
                </p>
                <p style="font-size: 12px; color: #666; margin-top: 15px;">
                    This could be due to:
                </p>
                <ul style="text-align: left; display: inline-block; font-size: 12px; color: #666;">
                    <li>The website blocking all proxy access (CORS)</li>
                    <li>The website being unavailable</li>
                    <li>Network connectivity issues</li>
                    <li>All proxy services being temporarily unavailable</li>
                </ul>
                <p style="margin-top: 20px;">
                    <button onclick="loadURLWithProxy('${url}', 0, [])" class="browser-btn">Try Again</button>
                    <button onclick="window.open('${url}', '_blank')" class="browser-btn">Open in New Tab</button>
                    <button onclick="browserNavigate('welcome')" class="browser-btn">Go to Home Page</button>
                </p>
            </div>
        `;
        showCatMessage("Oops! All proxies failed. Some sites really don't like proxies! 😿");
        return;
    }
    
    const proxy = proxyList[proxyIndex];
    triedProxies.push(proxy.name);
    
    updateBrowserStatus(`Loading via ${proxy.name}...`);
    loading.classList.remove('hidden');
    
    // Properly encode URL for proxy
    const proxyURL = proxy.url + encodeURIComponent(url);
    
    // Clear content and show loading message
    content.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <p>Loading ${url}...</p>
            <p style="font-size: 12px; color: #666;">Using ${proxy.name} proxy (${proxyIndex + 1}/${proxyList.length})</p>
            <p style="font-size: 10px; color: #999; margin-top: 10px;">Tried: ${triedProxies.join(', ')}</p>
        </div>
    `;
    
    // Set timeout for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    fetch(proxyURL, { signal: controller.signal })
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(html => {
            loading.classList.add('hidden');
            updateBrowserStatus(`Done (via ${proxy.name})`);
            
            // Process HTML to fix relative URLs
            html = processProxiedHTML(html, url);
            
            // Create iframe to display content
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
            
            content.innerHTML = '';
            content.appendChild(iframe);
            
            // Write HTML to iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(html);
            iframeDoc.close();
            
            // Add to history
            browserHistory.push({ type: 'url', url: currentBrowserURL });
            browserHistoryIndex = browserHistory.length - 1;
            
            // Save successful proxy
            currentProxyIndex = proxyIndex;
            localStorage.setItem('preferredProxy', proxyIndex.toString());
        })
        .catch(error => {
            clearTimeout(timeoutId);
            console.log(`Proxy ${proxy.name} failed:`, error.message);
            
            // Try next proxy
            loadURLWithProxy(url, proxyIndex + 1, triedProxies);
        });
}

function processProxiedHTML(html, originalURL) {
    try {
        const urlObj = new URL(originalURL);
        const baseURL = `${urlObj.protocol}//${urlObj.host}`;
        
        // Inject base tag to fix relative URLs
        if (!html.includes('<base')) {
            html = html.replace(/<head>/i, `<head><base href="${baseURL}/">`);
        }
        
        // Try to rewrite some common relative URLs (basic approach)
        // Note: This is a simplified approach and won't catch everything
        html = html.replace(/href=["']\/([^"']*?)["']/gi, `href="${baseURL}/$1"`);
        html = html.replace(/src=["']\/([^"']*?)["']/gi, `src="${baseURL}/$1"`);
        
    } catch (e) {
        console.error('Error processing HTML:', e);
    }
    
    return html;
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
let paintTool = 'pen';
let paintColor = '#000000';
let paintSize = 3;

function initializePaint() {
    const canvas = document.getElementById('paint-canvas');
    paintCtx = canvas.getContext('2d');
    
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', stopPaint);
    canvas.addEventListener('mouseleave', stopPaint);
}

function startPaint(e) {
    isPainting = true;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    paintCtx.beginPath();
    paintCtx.moveTo(x, y);
}

function paint(e) {
    if (!isPainting) return;
    
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    paintCtx.lineWidth = paintSize;
    paintCtx.lineCap = 'round';
    paintCtx.strokeStyle = paintTool === 'eraser' ? '#ffffff' : paintColor;
    
    paintCtx.lineTo(x, y);
    paintCtx.stroke();
}

function stopPaint() {
    isPainting = false;
}

function paintSelectTool(tool) {
    paintTool = tool;
    document.querySelectorAll('.paint-toolbar button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('paint-' + tool).classList.add('active');
}

function paintChangeColor() {
    paintColor = document.getElementById('paint-color').value;
}

function paintClear() {
    const canvas = document.getElementById('paint-canvas');
    paintCtx.clearRect(0, 0, canvas.width, canvas.height);
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

function initializeMinesweeper() {
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
    board.style.gridTemplateColumns = `repeat(${mineCols}, 25px)`;
    
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
    
    const desktop = document.getElementById('desktop');
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0066cc;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-weight: bold;
        flex-direction: column;
        gap: 20px;
    `;
    
    const messages = {
        'shutdown': 'Shutting down...',
        'restart': 'Restarting...',
        'logoff': 'Logging off...'
    };
    
    overlay.innerHTML = `<div>${messages[option]}</div><div style="font-size: 14px;">Just kidding! 😄</div>`;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        document.body.removeChild(overlay);
        showCatMessage("I can't really shut down! I'm just a webpage! 😹");
    }, 3000);
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
let currentPath = 'mycomputer';
let fmHistory = [];
let fmHistoryIndex = -1;
let fmViewMode = 'icons'; // icons, list, details
let fmClipboard = null;
let fmClipboardAction = null; // 'copy' or 'cut'
let selectedFMItems = [];

function initializeFileSystem() {
document.addEventListener('DOMContentLoaded', () => {
    initializeFileSystem();
});
    const saved = localStorage.getItem('linux5FileSystem');
    if (saved) {
        fileSystem = JSON.parse(saved);
    } else {
        // Create default file system
        fileSystem = {
            desktop: {
                type: 'folder',
                name: 'Desktop',
                children: {}
            },
            mydocuments: {
                type: 'folder',
                name: 'My Documents',
                children: {
                    'My Pictures': { type: 'folder', name: 'My Pictures', children: {} },
                    'My Music': { type: 'folder', name: 'My Music', children: {} },
                    'My Videos': { type: 'folder', name: 'My Videos', children: {} }
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
                    'Local Disk (C:)': { type: 'drive', name: 'Local Disk (C:)', children: {} },
                    'CD Drive (D:)': { type: 'drive', name: 'CD Drive (D:)', children: {} }
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

function fmNavigate(path) {
    currentPath = path;
    fmHistory.push(path);
    fmHistoryIndex = fmHistory.length - 1;
    renderFileManager();
}

function fmBack() {
    if (fmHistoryIndex > 0) {
        fmHistoryIndex--;
        currentPath = fmHistory[fmHistoryIndex];
        renderFileManager();
    }
}

function fmForward() {
    if (fmHistoryIndex < fmHistory.length - 1) {
        fmHistoryIndex++;
        currentPath = fmHistory[fmHistoryIndex];
        renderFileManager();
    }
}

function fmUp() {
    // Navigate to parent folder
    if (currentPath !== 'mycomputer') {
        fmNavigate('mycomputer');
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
    
    const folder = fileSystem[currentPath];
    if (!folder) {
        content.innerHTML = '<p>Folder not found.</p>';
        return;
    }
    
    // Update UI
    title.textContent = folder.name;
    address.value = folder.name;
    
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
                html += `<div>${item.type === 'folder' ? 'Folder' : 'File'}</div>`;
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
    
    // Update sidebar selection
    document.querySelectorAll('.fm-tree-item').forEach(item => {
        item.classList.remove('selected');
    });
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
    const folder = fileSystem[currentPath];
    const item = folder.children[key];
    
    if (!item) return;
    
    if (item.type === 'folder' || item.type === 'drive') {
        // Navigate into folder - not yet fully implemented
        showCatMessage(`Opening ${item.name}... (Sub-navigation not yet implemented)`);
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
        const folder = fileSystem[currentPath];
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
        const folder = fileSystem[currentPath];
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
    const folder = fileSystem[currentPath];
    const item = folder.children[key];
    
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
    const folder = fileSystem[currentPath];
    const item = folder.children[key];
    
    if (confirm(`Move "${item.name}" to Recycle Bin?`)) {
        // Move to recycle bin
        fileSystem.recycle.children[key] = item;
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
    
    fmClipboard = selectedFMItems[0];
    fmClipboardAction = 'copy';
    showCatMessage("Item copied to clipboard! 📋");
}

function fmCut() {
    if (selectedFMItems.length === 0) {
        showCatMessage("Please select an item to cut! 😺");
        return;
    }
    
    fmClipboard = selectedFMItems[0];
    fmClipboardAction = 'cut';
    showCatMessage("Item cut to clipboard! ✂️");
}

function fmPaste() {
    if (!fmClipboard) {
        showCatMessage("Nothing to paste! 😺");
        return;
    }
    
    const sourceFolder = getCurrentFolderForItem(fmClipboard);
    if (!sourceFolder) return;
    
    const item = sourceFolder.children[fmClipboard];
    const targetFolder = fileSystem[currentPath];
    
    if (fmClipboardAction === 'copy') {
        // Copy item
        targetFolder.children[fmClipboard] = JSON.parse(JSON.stringify(item));
    } else if (fmClipboardAction === 'cut') {
        // Move item
        targetFolder.children[fmClipboard] = item;
        delete sourceFolder.children[fmClipboard];
        fmClipboard = null;
        fmClipboardAction = null;
    }
    
    saveFileSystem();
    renderFileManager();
    showCatMessage("Item pasted! 📌");
}

function getCurrentFolderForItem(key) {
    // Search for the folder containing this item
    for (const path in fileSystem) {
        const folder = fileSystem[path];
        if (folder.children && folder.children[key]) {
            return folder;
        }
    }
    return null;
}

function fmEmptyRecycleBin() {
    if (confirm('Empty the Recycle Bin?')) {
        fileSystem.recycle.children = {};
        saveFileSystem();
        renderFileManager();
        showCatMessage("Recycle Bin emptied! 🗑️");
    }
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
    const wallpaper = localStorage.getItem('displayWallpaper') || '#5A8CC7';
    const fontsize = localStorage.getItem('displayFontsize') || 'normal';
    
    document.body.style.background = wallpaper;
    if (wallpaper.startsWith('#')) {
        document.body.style.backgroundImage = 'none';
    }
    
    if (fontsize === 'large') {
        document.body.style.fontSize = '14px';
    } else if (fontsize === 'xlarge') {
        document.body.style.fontSize = '16px';
    }
    
    // Update UI
    const wallpaperSelect = document.getElementById('display-wallpaper');
    const fontsizeSelect = document.getElementById('display-fontsize');
    if (wallpaperSelect) wallpaperSelect.value = wallpaper;
    if (fontsizeSelect) fontsizeSelect.value = fontsize;
}

function applyDisplaySettings() {
    const wallpaper = document.getElementById('display-wallpaper').value;
    const fontsize = document.getElementById('display-fontsize').value;
    
    localStorage.setItem('displayWallpaper', wallpaper);
    localStorage.setItem('displayFontsize', fontsize);
    
    document.body.style.background = wallpaper;
    if (wallpaper.startsWith('#')) {
        document.body.style.backgroundImage = 'none';
    }
    
    document.body.style.fontSize = fontsize === 'large' ? '14px' : fontsize === 'xlarge' ? '16px' : '12px';
    
    showCatMessage('Display settings applied! 🖥️');
}

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
function loadCatSettings() {
    const enabled = localStorage.getItem('catEnabled') !== 'false';
    const name = localStorage.getItem('catName') || 'Buddy';
    const autoSpeak = localStorage.getItem('catAutoSpeak') !== 'false';
    const frequency = localStorage.getItem('catFrequency') || '60';
    const mood = localStorage.getItem('catMood') || 'playful';
    
    const enabledCheckbox = document.getElementById('cat-enabled');
    const nameInput = document.getElementById('cat-name');
    const autoSpeakCheckbox = document.getElementById('cat-auto-speak');
    const frequencySelect = document.getElementById('cat-frequency');
    const moodSelect = document.getElementById('cat-mood');
    
    if (enabledCheckbox) enabledCheckbox.checked = enabled;
    if (nameInput) nameInput.value = name;
    if (autoSpeakCheckbox) autoSpeakCheckbox.checked = autoSpeak;
    if (frequencySelect) frequencySelect.value = frequency;
    if (moodSelect) moodSelect.value = mood;
    
    const cat = document.getElementById('cat-pet');
    if (cat) cat.style.display = enabled ? 'block' : 'none';
}

function applyCatSettings() {
    const enabled = document.getElementById('cat-enabled').checked;
    const name = document.getElementById('cat-name').value;
    const autoSpeak = document.getElementById('cat-auto-speak').checked;
    const frequency = document.getElementById('cat-frequency').value;
    const mood = document.getElementById('cat-mood').value;
    
    localStorage.setItem('catEnabled', enabled.toString());
    localStorage.setItem('catName', name);
    localStorage.setItem('catAutoSpeak', autoSpeak.toString());
    localStorage.setItem('catFrequency', frequency);
    localStorage.setItem('catMood', mood);
    
    const cat = document.getElementById('cat-pet');
    if (cat) cat.style.display = enabled ? 'block' : 'none';
    
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
