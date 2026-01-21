package com.linux5;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.Random;

/**
 * The cat pet companion that appears on the desktop
 */
public class CatPet extends JPanel {
    private String[] messages = {
        "Meow! Hello!",
        "Did you know cats sleep 70% of their lives?",
        "I'm here to help! 😺",
        "Click me to chat!",
        "Purr... I'm feeling sleepy..."
    };
    
    private Random random = new Random();
    private Timer messageTimer;
    private String currentMessage = "";
    private Point dragOffset;
    
    public CatPet() {
        setSize(100, 100);
        setOpaque(false);
        setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        
        // Random messages
        messageTimer = new Timer(30000, e -> showRandomMessage());
        messageTimer.start();
        
        // Click to chat
        addMouseListener(new MouseAdapter() {
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    openChatWindow();
                }
            }
            
            public void mousePressed(MouseEvent e) {
                dragOffset = e.getPoint();
            }
        });
        
        // Draggable
        addMouseMotionListener(new MouseMotionAdapter() {
            public void mouseDragged(MouseEvent e) {
                Point newLocation = getLocation();
                newLocation.translate(e.getX() - dragOffset.x, e.getY() - dragOffset.y);
                
                // Keep cat within bounds
                if (getParent() != null) {
                    newLocation.x = Math.max(0, Math.min(newLocation.x, getParent().getWidth() - getWidth()));
                    newLocation.y = Math.max(0, Math.min(newLocation.y, getParent().getHeight() - getHeight()));
                }
                
                setLocation(newLocation);
            }
        });
    }
    
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        // Draw simple pixel cat (black silhouette)
        g2d.setColor(Color.BLACK);
        
        // Cat body
        g2d.fillOval(25, 40, 50, 40);
        
        // Cat head
        g2d.fillOval(30, 20, 40, 35);
        
        // Ears
        int[] earX1 = {32, 40, 35};
        int[] earY1 = {20, 15, 20};
        g2d.fillPolygon(earX1, earY1, 3);
        
        int[] earX2 = {60, 68, 65};
        int[] earY2 = {15, 20, 20};
        g2d.fillPolygon(earX2, earY2, 3);
        
        // Eyes
        g2d.setColor(Color.GREEN);
        g2d.fillOval(38, 28, 8, 8);
        g2d.fillOval(54, 28, 8, 8);
        
        // Pupils
        g2d.setColor(Color.BLACK);
        g2d.fillOval(41, 31, 3, 3);
        g2d.fillOval(57, 31, 3, 3);
        
        // Tail
        g2d.setColor(Color.BLACK);
        g2d.fillArc(60, 50, 30, 40, 0, 180);
        
        // Draw speech bubble if message
        if (!currentMessage.isEmpty()) {
            drawSpeechBubble(g2d, currentMessage);
        }
    }
    
    private void drawSpeechBubble(Graphics2D g, String message) {
        // Speech bubble background
        g.setColor(Color.WHITE);
        g.fillRoundRect(100, 10, 150, 60, 10, 10);
        
        // Border
        g.setColor(Color.BLACK);
        g.drawRoundRect(100, 10, 150, 60, 10, 10);
        
        // Pointer
        int[] pointerX = {100, 90, 100};
        int[] pointerY = {40, 50, 50};
        g.setColor(Color.WHITE);
        g.fillPolygon(pointerX, pointerY, 3);
        g.setColor(Color.BLACK);
        g.drawPolyline(pointerX, pointerY, 3);
        
        // Message text
        g.setColor(Color.BLACK);
        g.setFont(new Font("Arial", Font.PLAIN, 12));
        
        // Word wrap
        String[] words = message.split(" ");
        StringBuilder line = new StringBuilder();
        int y = 30;
        for (String word : words) {
            if (g.getFontMetrics().stringWidth(line + word) < 140) {
                line.append(word).append(" ");
            } else {
                g.drawString(line.toString(), 110, y);
                line = new StringBuilder(word + " ");
                y += 15;
            }
        }
        g.drawString(line.toString(), 110, y);
    }
    
    public void showMessage(String message) {
        currentMessage = message;
        repaint();
        
        Timer hideTimer = new Timer(8000, e -> {
            currentMessage = "";
            repaint();
        });
        hideTimer.setRepeats(false);
        hideTimer.start();
    }
    
    private void showRandomMessage() {
        showMessage(messages[random.nextInt(messages.length)]);
    }
    
    private void openChatWindow() {
        JOptionPane.showMessageDialog(this, 
            "Meow! I'm your desktop companion!\n\nI'll help you navigate Linux/5!\n\nDouble-click me anytime to chat! 🐱",
            "Cat Chat",
            JOptionPane.INFORMATION_MESSAGE);
    }
}
