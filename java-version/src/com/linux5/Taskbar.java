package com.linux5;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;

/**
 * Taskbar component with Start button, window buttons, and system tray
 */
public class Taskbar extends JPanel {
    private JButton startButton;
    private JPanel windowButtonsPanel;
    private JPanel systemTray;
    private Desktop desktop;
    private ArrayList<JButton> windowButtons;
    
    public Taskbar(Desktop desktop) {
        this.desktop = desktop;
        this.windowButtons = new ArrayList<>();
        
        setLayout(new BorderLayout());
        setPreferredSize(new Dimension(0, 40));
        setBackground(new Color(49, 104, 213));
        
        // Start button
        startButton = new JButton("start");
        startButton.setPreferredSize(new Dimension(100, 40));
        startButton.setBackground(new Color(60, 143, 60));
        startButton.setForeground(Color.WHITE);
        startButton.setFont(new Font("Arial", Font.BOLD, 14));
        startButton.setFocusPainted(false);
        add(startButton, BorderLayout.WEST);
        
        // Window buttons area
        windowButtonsPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 2, 2));
        windowButtonsPanel.setOpaque(false);
        add(windowButtonsPanel, BorderLayout.CENTER);
        
        // System tray
        systemTray = new JPanel(new FlowLayout(FlowLayout.RIGHT, 5, 5));
        systemTray.setOpaque(false);
        systemTray.setPreferredSize(new Dimension(200, 40));
        
        // Add system tray icons
        JLabel volumeIcon = new JLabel("🔊");
        JLabel networkIcon = new JLabel("🌐");
        JLabel clockLabel = new JLabel();
        
        systemTray.add(volumeIcon);
        systemTray.add(networkIcon);
        systemTray.add(clockLabel);
        
        add(systemTray, BorderLayout.EAST);
        
        // Update clock
        Timer clockTimer = new Timer(1000, e -> {
            clockLabel.setText(new java.text.SimpleDateFormat("h:mm a").format(new java.util.Date()));
        });
        clockTimer.start();
        clockLabel.setText(new java.text.SimpleDateFormat("h:mm a").format(new java.util.Date()));
    }
    
    public void addWindowButton(Window window) {
        JButton button = new JButton(window.getTitle());
        button.setPreferredSize(new Dimension(150, 30));
        button.setFocusPainted(false);
        button.addActionListener(e -> {
            if (window.isVisible()) {
                window.setVisible(false);
            } else {
                window.setVisible(true);
                // Bring window to front by changing its layer
                Container parent = window.getParent();
                if (parent != null) {
                    parent.setComponentZOrder(window, 0);
                    parent.repaint();
                }
            }
        });
        
        windowButtons.add(button);
        windowButtonsPanel.add(button);
        windowButtonsPanel.revalidate();
        windowButtonsPanel.repaint();
    }
    
    public void removeWindowButton(Window window) {
        // Find and remove button for this window
        for (int i = 0; i < windowButtons.size(); i++) {
            if (windowButtons.get(i).getText().equals(window.getTitle())) {
                windowButtonsPanel.remove(windowButtons.get(i));
                windowButtons.remove(i);
                windowButtonsPanel.revalidate();
                windowButtonsPanel.repaint();
                break;
            }
        }
    }
}
