package com.linux5;

import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.event.*;

/**
 * A draggable window component with title bar and control buttons
 */
public class Window extends JPanel {
    private String title;
    private JPanel titleBar;
    private JPanel contentPanel;
    private Point dragOffset;
    private boolean maximized = false;
    private Rectangle normalBounds;
    private Desktop desktop;
    
    public Window(String title, JPanel content, int width, int height, Desktop desktop) {
        this.title = title;
        this.desktop = desktop;
        setLayout(new BorderLayout());
        setBounds(100, 100, width, height);
        setBorder(new LineBorder(new Color(10, 36, 106), 3));
        
        createTitleBar();
        
        contentPanel = content;
        add(contentPanel, BorderLayout.CENTER);
        
        setupDragging();
    }
    
    private void createTitleBar() {
        titleBar = new JPanel();
        titleBar.setLayout(new BorderLayout());
        titleBar.setBackground(new Color(10, 36, 106));
        titleBar.setPreferredSize(new Dimension(0, 30));
        
        JLabel titleLabel = new JLabel(title);
        titleLabel.setForeground(Color.WHITE);
        titleLabel.setBorder(new EmptyBorder(5, 10, 5, 10));
        titleBar.add(titleLabel, BorderLayout.WEST);
        
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 2, 2));
        buttonPanel.setOpaque(false);
        
        JButton minimizeBtn = createTitleButton("_");
        JButton maximizeBtn = createTitleButton("□");
        JButton closeBtn = createTitleButton("×");
        
        minimizeBtn.addActionListener(e -> minimize());
        maximizeBtn.addActionListener(e -> toggleMaximize());
        closeBtn.addActionListener(e -> close());
        
        buttonPanel.add(minimizeBtn);
        buttonPanel.add(maximizeBtn);
        buttonPanel.add(closeBtn);
        
        titleBar.add(buttonPanel, BorderLayout.EAST);
        add(titleBar, BorderLayout.NORTH);
    }
    
    private JButton createTitleButton(String text) {
        JButton btn = new JButton(text);
        btn.setPreferredSize(new Dimension(25, 20));
        btn.setFocusPainted(false);
        btn.setFont(new Font("Arial", Font.BOLD, 12));
        return btn;
    }
    
    private void setupDragging() {
        titleBar.addMouseListener(new MouseAdapter() {
            public void mousePressed(MouseEvent e) {
                dragOffset = e.getPoint();
            }
        });
        
        titleBar.addMouseMotionListener(new MouseMotionAdapter() {
            public void mouseDragged(MouseEvent e) {
                if (!maximized) {
                    Point newLocation = getLocation();
                    newLocation.translate(e.getX() - dragOffset.x, e.getY() - dragOffset.y);
                    
                    // Keep window within desktop bounds
                    newLocation.x = Math.max(0, Math.min(newLocation.x, getParent().getWidth() - getWidth()));
                    newLocation.y = Math.max(0, Math.min(newLocation.y, getParent().getHeight() - getHeight()));
                    
                    setLocation(newLocation);
                }
            }
        });
    }
    
    private void minimize() {
        setVisible(false);
    }
    
    private void toggleMaximize() {
        if (maximized) {
            setBounds(normalBounds);
            maximized = false;
        } else {
            normalBounds = getBounds();
            Container parent = getParent();
            setBounds(0, 0, parent.getWidth(), parent.getHeight() - 40); // Leave room for taskbar
            maximized = true;
        }
    }
    
    private void close() {
        desktop.removeWindow(this);
    }
    
    public String getTitle() {
        return title;
    }
}
