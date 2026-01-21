package com.linux5;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;

/**
 * Desktop panel that contains all windows, icons, taskbar, and the cat pet
 */
public class Desktop extends JPanel {
    private ArrayList<Window> windows;
    private Taskbar taskbar;
    private CatPet cat;
    private Image backgroundImage;
    private Color backgroundColor;
    
    public Desktop() {
        setLayout(null);
        windows = new ArrayList<>();
        backgroundColor = new Color(58, 110, 165); // Luna Blue default
        
        // Create desktop icons
        createDesktopIcons();
        
        // Initialize taskbar (must be added after icons)
        taskbar = new Taskbar(this);
        add(taskbar);
        
        // Initialize cat pet
        cat = new CatPet();
        add(cat);
        
        // Right-click context menu
        setupContextMenu();
        
        // Add component listener to reposition elements on resize
        addComponentListener(new ComponentAdapter() {
            @Override
            public void componentResized(ComponentEvent e) {
                repositionElements();
            }
        });
    }
    
    private void repositionElements() {
        // Reposition taskbar
        if (taskbar != null) {
            taskbar.setBounds(0, getHeight() - 40, getWidth(), 40);
        }
        
        // Reposition cat
        if (cat != null) {
            cat.setLocation(getWidth() - 150, getHeight() - 200);
        }
    }
    
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        
        // Draw background
        if (backgroundImage != null) {
            g.drawImage(backgroundImage, 0, 0, getWidth(), getHeight(), this);
        } else {
            // Draw gradient background
            Graphics2D g2d = (Graphics2D) g;
            GradientPaint gradient = new GradientPaint(
                0, 0, new Color(90, 150, 215),
                0, getHeight(), backgroundColor
            );
            g2d.setPaint(gradient);
            g2d.fillRect(0, 0, getWidth(), getHeight());
        }
    }
    
    private void createDesktopIcons() {
        addDesktopIcon("My Computer", 20, 20, () -> openMyComputer());
        addDesktopIcon("Recycle Bin", 20, 100, () -> openRecycleBin());
        addDesktopIcon("Internet Explorer", 20, 180, () -> openBrowser());
        addDesktopIcon("Notepad", 20, 260, () -> openNotepad());
        addDesktopIcon("Games", 20, 340, () -> openGames());
    }
    
    private void addDesktopIcon(String name, int x, int y, Runnable action) {
        JButton icon = new JButton("<html><center>" + name + "</center></html>");
        icon.setBounds(x, y, 80, 80);
        icon.setVerticalTextPosition(SwingConstants.BOTTOM);
        icon.setHorizontalTextPosition(SwingConstants.CENTER);
        icon.setFocusPainted(false);
        icon.setContentAreaFilled(false);
        icon.setBorderPainted(false);
        icon.setForeground(Color.WHITE);
        icon.setFont(new Font("Arial", Font.PLAIN, 11));
        icon.addActionListener(e -> action.run());
        
        // Double-click support
        icon.addMouseListener(new MouseAdapter() {
            private long lastClickTime = 0;
            
            @Override
            public void mouseClicked(MouseEvent e) {
                long currentTime = System.currentTimeMillis();
                if (currentTime - lastClickTime < 500) {
                    action.run();
                }
                lastClickTime = currentTime;
            }
        });
        
        add(icon);
    }
    
    public void openWindow(String title, JPanel content, int width, int height) {
        Window window = new Window(title, content, width, height, this);
        window.setLocation(100 + windows.size() * 30, 100 + windows.size() * 30);
        windows.add(window);
        add(window);
        
        // Bring window to front by changing its layer
        setComponentZOrder(window, 0);
        
        taskbar.addWindowButton(window);
        revalidate();
        repaint();
    }
    
    public void removeWindow(Window window) {
        windows.remove(window);
        remove(window);
        taskbar.removeWindowButton(window);
        revalidate();
        repaint();
    }
    
    public CatPet getCat() {
        return cat;
    }
    
    private void setupContextMenu() {
        JPopupMenu contextMenu = new JPopupMenu();
        JMenuItem refresh = new JMenuItem("Refresh");
        JMenuItem properties = new JMenuItem("Properties");
        JMenuItem newFolder = new JMenuItem("New > Folder");
        
        refresh.addActionListener(e -> repaint());
        properties.addActionListener(e -> showProperties());
        
        contextMenu.add(refresh);
        contextMenu.add(properties);
        contextMenu.add(newFolder);
        
        addMouseListener(new MouseAdapter() {
            public void mousePressed(MouseEvent e) {
                if (e.isPopupTrigger()) {
                    contextMenu.show(e.getComponent(), e.getX(), e.getY());
                }
            }
            
            public void mouseReleased(MouseEvent e) {
                if (e.isPopupTrigger()) {
                    contextMenu.show(e.getComponent(), e.getX(), e.getY());
                }
            }
        });
    }
    
    // App launchers
    private void openMyComputer() {
        JPanel content = new JPanel();
        content.setLayout(new BorderLayout());
        content.add(new JLabel("My Computer - Not yet implemented"), BorderLayout.CENTER);
        openWindow("My Computer", content, 700, 500);
    }
    
    private void openRecycleBin() {
        JPanel content = new JPanel();
        content.setLayout(new BorderLayout());
        content.add(new JLabel("Recycle Bin - Not yet implemented"), BorderLayout.CENTER);
        openWindow("Recycle Bin", content, 600, 400);
    }
    
    private void openBrowser() {
        JPanel content = new JPanel();
        content.setLayout(new BorderLayout());
        content.add(new JLabel("Internet Explorer - Not yet implemented"), BorderLayout.CENTER);
        openWindow("Internet Explorer", content, 1024, 768);
    }
    
    private void openNotepad() {
        JPanel content = new JPanel();
        content.setLayout(new BorderLayout());
        JTextArea textArea = new JTextArea();
        textArea.setFont(new Font("Monospaced", Font.PLAIN, 14));
        content.add(new JScrollPane(textArea), BorderLayout.CENTER);
        openWindow("Notepad", content, 600, 500);
    }
    
    private void openGames() {
        JPanel content = new JPanel();
        content.setLayout(new GridLayout(2, 3, 10, 10));
        content.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        
        JButton minesweeper = new JButton("Minesweeper");
        JButton solitaire = new JButton("Solitaire");
        JButton snake = new JButton("Snake");
        
        content.add(minesweeper);
        content.add(solitaire);
        content.add(snake);
        
        openWindow("Games", content, 500, 400);
    }
    
    private void showProperties() {
        JOptionPane.showMessageDialog(this, 
            "Linux/5 - Java Edition\nVersion 1.0.0\n(c) 2026 Linux/5 Corporation",
            "Desktop Properties",
            JOptionPane.INFORMATION_MESSAGE);
    }
}
