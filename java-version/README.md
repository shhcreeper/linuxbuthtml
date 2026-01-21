# Linux/5 - Java Edition

A desktop environment simulation built with Java Swing, inspired by Windows XP.

![Linux/5 Java Edition](screenshot.png)

## Features

- **Desktop Environment**: Complete desktop with draggable icons and windows
- **Taskbar**: Windows-style taskbar with Start button, window buttons, and system tray
- **Cat Pet Companion**: Interactive desktop pet that can chat with you
- **Window Management**: Draggable, resizable windows with minimize, maximize, and close buttons
- **Multiple Applications** (Planned):
  - Internet Explorer-style browser
  - Notepad text editor
  - Calculator
  - Paint application
  - File Manager
  - Games (Minesweeper, Solitaire, Snake, Tetris)

## Requirements

- Java 11 or higher
- Maven (for building)

## Building

To build the project with Maven:

```bash
cd java-version
mvn clean package
```

This will create two JAR files in the `target/` directory:
- `linux5-java-1.0.0.jar` - Regular JAR
- `linux5-java-1.0.0-jar-with-dependencies.jar` - Executable JAR with all dependencies

## Running

### Option 1: Run with Maven

```bash
mvn exec:java
```

### Option 2: Run the executable JAR

```bash
java -jar target/linux5-java-1.0.0-jar-with-dependencies.jar
```

### Option 3: Compile and run manually

```bash
# Compile
javac -d bin src/com/linux5/*.java

# Run
java -cp bin com.linux5.Linux5
```

## Project Structure

```
java-version/
├── src/
│   └── com/
│       └── linux5/
│           ├── Linux5.java          # Main application entry point
│           ├── Desktop.java         # Desktop panel with icons and background
│           ├── Window.java          # Draggable window component
│           ├── Taskbar.java         # Taskbar with Start button and system tray
│           ├── CatPet.java          # Interactive cat pet companion
│           ├── apps/                # Application implementations
│           │   ├── Browser.java
│           │   ├── Notepad.java
│           │   ├── Calculator.java
│           │   ├── Paint.java
│           │   └── FileManager.java
│           └── games/               # Game implementations
│               ├── Minesweeper.java
│               ├── Solitaire.java
│               ├── Snake.java
│               ├── Tetris.java
│               └── Pinball.java
├── resources/
│   ├── images/                      # Image resources
│   └── sounds/                      # Sound resources
├── pom.xml                          # Maven build configuration
└── README.md                        # This file
```

## Development

### Core Classes

- **Linux5**: Main entry point that initializes the application
- **Desktop**: Main panel containing all desktop elements (icons, windows, taskbar, cat)
- **Window**: Draggable window with title bar and control buttons
- **Taskbar**: Bottom taskbar with Start button, window buttons, and system tray
- **CatPet**: Interactive desktop companion with speech bubbles

### Adding New Windows

To add a new window to the desktop:

```java
JPanel content = new JPanel();
// ... customize your content panel ...
desktop.openWindow("My Window", content, 600, 400);
```

### Cat Messages

The cat pet can show messages:

```java
desktop.getCat().showMessage("Hello! I'm the desktop cat!");
```

## Features Roadmap

### Phase 1: Core Desktop (✅ Complete)
- [x] Desktop with gradient background
- [x] Draggable icons
- [x] Window management (drag, minimize, maximize, close)
- [x] Taskbar with Start button
- [x] System tray with clock
- [x] Cat pet companion

### Phase 2: Basic Applications
- [ ] Notepad (text editor)
- [ ] Calculator
- [ ] Internet Explorer (basic browser)
- [ ] Paint (drawing application)
- [ ] File Manager

### Phase 3: Games
- [ ] Minesweeper
- [ ] Solitaire
- [ ] Snake
- [ ] Tetris
- [ ] Pinball

### Phase 4: Advanced Features
- [ ] Start Menu
- [ ] Control Panel
- [ ] Task Manager
- [ ] Command Prompt
- [ ] Theme system
- [ ] Sound effects

## Technical Details

### Technologies Used
- **Java Swing**: GUI framework
- **Java AWT**: Graphics and event handling
- **Maven**: Build automation

### Design Patterns
- **Component Pattern**: Windows and desktop elements are self-contained components
- **Observer Pattern**: Window management and taskbar updates
- **Strategy Pattern**: Different application types

## Contributing

This is a personal project, but contributions are welcome! Please feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

(c) 2026 Linux/5 Corporation. All rights reserved.

## Credits

Inspired by:
- Windows XP desktop environment
- Bonzi Buddy
- Classic Windows games

Built with ❤️ and Java Swing
