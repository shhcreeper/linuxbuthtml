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
    
    // Enable skip after 1 second
    setTimeout(() => {
        canSkip = true;
    }, 1000);
    
    // Skip handlers
    const handleSkip = () => {
        if (canSkip && !bootSequenceCompleted) {
            bootSequenceCompleted = true;
            localStorage.setItem('skipBootSequence', 'true');
            finishBootSequence();
        }
    };
    
    skipButton.addEventListener('click', handleSkip);
    document.addEventListener('keydown', handleSkip, { once: true });
    
    // Stage 1: BIOS Screen (2.5 seconds)
    setTimeout(() => {
        if (!bootSequenceCompleted) {
            biosScreen.classList.remove('active');
            bootloaderScreen.classList.add('active');
            currentStage = 1;
        }
    }, 2500);
    
    // Stage 2: Boot Loader Screen (2.5 seconds)
    setTimeout(() => {
        if (!bootSequenceCompleted) {
            bootloaderScreen.classList.remove('active');
            xpBootScreen.classList.add('active');
            currentStage = 2;
        }
    }, 5000);
    
    // Stage 3: XP Boot Screen (4 seconds)
    setTimeout(() => {
        if (!bootSequenceCompleted) {
            xpBootScreen.classList.remove('active');
            welcomeScreen.classList.add('active');
            currentStage = 3;
        }
    }, 9000);
    
    // Stage 4: Welcome Screen (2 seconds)
    setTimeout(() => {
        if (!bootSequenceCompleted) {
            bootSequenceCompleted = true;
            finishBootSequence();
        }
    }, 11000);
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
    
    // Show welcome message only if boot sequence was skipped
    if (bootSequenceCompleted) {
        // Boot sequence finished, will show greeting from finishBootSequence
    } else {
        setTimeout(() => {
            showCatMessage("Hi there! I'm your friendly Linux/5 assistant! 😺");
        }, 2000);
    }
    
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
                openWindow(windowId + '-window');
                toggleStartMenu();
            }
        });
    });
    
    // Context menu handling
    const catPet = document.getElementById('cat-pet');
    const catContextMenu = document.getElementById('cat-context-menu');
    const desktop = document.getElementById('desktop');
    const desktopContextMenu = document.getElementById('desktop-context-menu');
    
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
    
    document.addEventListener('click', () => {
        catContextMenu.classList.add('hidden');
        desktopContextMenu.classList.add('hidden');
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
let browserPages = {
    welcome: `<h1>Welcome to Linux/5 Browser!</h1>
        <p>This is a simulated web browser. Try these links:</p>
        <ul>
            <li><a href="#" onclick="browserNavigate('welcome'); return false;">Home</a></li>
            <li><a href="#" onclick="browserNavigate('about'); return false;">About Linux/5</a></li>
            <li><a href="#" onclick="browserNavigate('help'); return false;">Help & Tips</a></li>
            <li><a href="#" onclick="browserNavigate('games'); return false;">Games Portal</a></li>
        </ul>`,
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
    browserNavigate('welcome');
}

function browserNavigate(page) {
    const content = document.getElementById('browser-content');
    const urlBar = document.getElementById('browser-url');
    
    if (browserPages[page]) {
        content.innerHTML = browserPages[page];
        urlBar.value = 'http://' + page + '.linux5.local';
        browserHistory.push(page);
        browserHistoryIndex = browserHistory.length - 1;
    }
}

function browserBack() {
    if (browserHistoryIndex > 0) {
        browserHistoryIndex--;
        const page = browserHistory[browserHistoryIndex];
        const content = document.getElementById('browser-content');
        const urlBar = document.getElementById('browser-url');
        content.innerHTML = browserPages[page];
        urlBar.value = 'http://' + page + '.linux5.local';
    }
}

function browserForward() {
    if (browserHistoryIndex < browserHistory.length - 1) {
        browserHistoryIndex++;
        const page = browserHistory[browserHistoryIndex];
        const content = document.getElementById('browser-content');
        const urlBar = document.getElementById('browser-url');
        content.innerHTML = browserPages[page];
        urlBar.value = 'http://' + page + '.linux5.local';
    }
}

function browserRefresh() {
    const page = browserHistory[browserHistoryIndex];
    const content = document.getElementById('browser-content');
    content.innerHTML = browserPages[page];
}

function browserHome() {
    browserNavigate('welcome');
}

function browserGo() {
    showCatMessage("That's not a real website, silly! Try the links on the home page! 😸");
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
const originalOpenWindow = openWindow;
window.openWindow = function(windowId) {
    originalOpenWindow(windowId);
    if (windowId === 'calendar-window') {
        displayCalendar();
    }
};
