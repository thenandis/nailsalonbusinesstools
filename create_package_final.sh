#!/bin/bash
# =========================================
#  CHNSC Nail Salon Business Tools
#  Package Creator v6 FINAL - Standalone User Build
#  macOS/Linux Version
# =========================================

echo "copying from /build to /parkthebuild for deployment"

# Delete parkthebuild if it exists
if [ -d "parkthebuild" ]; then
    rm -rf parkthebuild
fi

# Recreate parkthebuild
mkdir parkthebuild

# Copy latest build output to parkthebuild
cp -R build/* parkthebuild/

# Get the current date and time
YYYYMMDD=$(date +"%Y%m%d")
echo "$YYYYMMDD"

HHMMSS=$(date +"%H%M%S")
echo "$HHMMSS"

# Combine into formatted date-time
formattedDateTime="${YYYYMMDD}-${HHMMSS}"

PACKAGE_NAME="nail-salon-business-tools-FINALCHECK-v${formattedDateTime}"
SOURCE_DIR="parkthebuild"

echo "🏗️  Creating standalone package: ${PACKAGE_NAME}"
echo ""

# Clean up any existing package
if [ -d "$PACKAGE_NAME" ]; then
    echo "🧹 Cleaning up previous package..."
    rm -rf "$PACKAGE_NAME"
fi

# Create package directory
mkdir "$PACKAGE_NAME"

echo "📁 Copying application files..."
cp -R "$SOURCE_DIR/"* "$PACKAGE_NAME/"

# Remove instructions.html if present
if [ -f "$PACKAGE_NAME/instructions.html" ]; then
    echo "🗑️  Removing redundant instructions.html..."
    rm "$PACKAGE_NAME/instructions.html"
fi

# Rename index.html to CHNSC_StartPage.html
echo "🔄 Renaming index.html to CHNSC_StartPage.html..."
if [ -f "$PACKAGE_NAME/index.html" ]; then
    mv "$PACKAGE_NAME/index.html" "$PACKAGE_NAME/CHNSC_StartPage.html"
fi

echo "✅ Package created successfully!"
echo ""
echo "📋 Package Contents:"
echo "   📄 CHNSC_StartPage.html         (Main entry point)"
echo "   📁 documentation/               (Technical guides and instructions)"
echo "   📁 static/                      (Application assets)"
echo "   📄 manifest.json, favicon.ico   (App metadata)"
echo "   📄 service-worker.js            (Offline support)"
echo "   📄 All other necessary files"
echo ""
echo "👤 User Instructions:"
echo "   1. Unzip the package"
echo "   2. Double-click CHNSC_StartPage.html"
echo "   3. Start using immediately!"
echo "   4. Check documentation/ folder for guides"
echo ""
echo "🌐 Web Server Deployment:"
echo "   1. Upload entire folder to web server"
echo "   2. Access via: yourdomain.com/CHNSC_StartPage.html"
echo "   3. See documentation/ folder for technical details"
echo ""

# Check if zip command is available
if command -v zip &> /dev/null; then
    echo "🗜️  Creating ZIP file..."
    zip -r -q "${PACKAGE_NAME}.zip" "$PACKAGE_NAME"
    echo "✅ ZIP file created: ${PACKAGE_NAME}.zip"
else
    echo "📝 Note: zip command not found. Please manually ZIP the folder:"
    echo "   Folder: $PACKAGE_NAME"
    echo "   Suggested name: ${PACKAGE_NAME}.zip"
fi

echo "✨ Ready to distribute!"
echo ""
echo "Press any key to continue..."
read -n 1 -s
