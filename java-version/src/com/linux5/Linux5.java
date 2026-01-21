package com.linux5;

import javax.swing.*;
import java.awt.*;

/**
 * Linux/5 - Java Edition
 * Main entry point for the Linux/5 desktop environment
 */
public class Linux5 {
    public static void main(String[] args) {
        // Set Look and Feel to system default
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // Launch application on Event Dispatch Thread
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Linux/5 - Java Edition");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setSize(1280, 720);
            frame.setLocationRelativeTo(null);
            
            // Create desktop
            Desktop desktop = new Desktop();
            frame.add(desktop);
            
            frame.setVisible(true);
            
            // Show welcome message
            desktop.getCat().showMessage("Welcome to Linux/5! 🐱");
        });
    }
}
