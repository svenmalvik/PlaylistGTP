#!/bin/bash

# Define the name of the ZIP file
ZIP_FILE="playlistFromCopyrights.zip"

# Remove the existing ZIP file if it exists
if [ -f "$ZIP_FILE" ]; then
  rm "$ZIP_FILE"
fi

# Create a new ZIP file containing all files in the current directory
zip -r "$ZIP_FILE" . -x "*.git*" -x "node_modules/*" -x "*.DS_Store" -x "*.psd"

echo "Extension packaged into $ZIP_FILE"