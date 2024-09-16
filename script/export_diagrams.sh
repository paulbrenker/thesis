#!/bin/bash

# Ensure that drawio is installed, if not install via snap
if ! command -v drawio &> /dev/null; then
    echo "drawio is not installed. Installing drawio via snap..."
    sudo snap install drawio
    if [ $? -ne 0 ]; then
        echo "Failed to install drawio. Please install it manually."
        exit 1
    fi
fi

# Define source and destination directories
SOURCE_DIR="requirements"
DEST_DIR="tex/thesis/img"

SCALE=2

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Find all .drawio files in the source directory and its subdirectories
find "$SOURCE_DIR" -type f -name "*.drawio" | while read -r DRAWIO_FILE; do
    # Extract the filename without extension
    FILE_NAME=$(basename "$DRAWIO_FILE" .drawio)
    
    # Define the output PNG file path
    OUTPUT_FILE="$DEST_DIR/$FILE_NAME.png"
    
    # Export the .drawio file to PNG
    if drawio -x -f png -o "$OUTPUT_FILE" -s $SCALE "$DRAWIO_FILE"; then
        echo "Exported: $DRAWIO_FILE -> $OUTPUT_FILE"
    else
        echo "Error exporting $DRAWIO_FILE"
    fi
done

echo "Exporting completed."