#!/bin/bash

if ! command -v drawio &> /dev/null; then
    echo "drawio is not installed. Installing drawio via snap..."
    sudo snap install drawio
    if [ $? -ne 0 ]; then
        echo "Failed to install drawio. Please install it manually."
        exit 1
    fi
fi

SOURCE_DIR="requirements"
DEST_DIR="tex/img"

SCALE=2

mkdir -p "$DEST_DIR"

find "$SOURCE_DIR" -type f -name "*.drawio" | while read -r DRAWIO_FILE; do
    FILE_NAME=$(basename "$DRAWIO_FILE" .drawio)
    
    OUTPUT_FILE="$DEST_DIR/$FILE_NAME.png"
    
    if drawio -x -f png -o "$OUTPUT_FILE" -s $SCALE "$DRAWIO_FILE"; then
        echo "Exported: $DRAWIO_FILE -> $OUTPUT_FILE"
    else
        echo "Error exporting $DRAWIO_FILE"
    fi
done

echo "Exporting completed."