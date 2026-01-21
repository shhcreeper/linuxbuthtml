#!/bin/bash
# Build script for Linux/5 Java Edition

echo "Building Linux/5 Java Edition..."

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "Maven is not installed. Installing..."
    # This is platform-specific; adjust as needed
    # For Ubuntu/Debian:
    # sudo apt-get update && sudo apt-get install -y maven
    echo "Please install Maven manually and run this script again."
    exit 1
fi

# Clean and build
echo "Running Maven clean and package..."
cd "$(dirname "$0")"
mvn clean package

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "To run the application:"
    echo "  java -jar target/linux5-java-1.0.0-jar-with-dependencies.jar"
    echo ""
    echo "Or with Maven:"
    echo "  mvn exec:java"
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi
