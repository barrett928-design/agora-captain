#!/bin/bash
# Run once after cloning to set up Claude memory and install dependencies

set -e

echo "Setting up Agora Captain..."

# Install app dependencies
npm install

# Install function dependencies
cd functions && npm install && cd ..

# Set up Claude memory files for this user account
PROJECT_PATH=$(pwd)
ENCODED_PATH=$(echo "$PROJECT_PATH" | sed 's|/|-|g' | sed 's|^-||')
MEMORY_DEST="$HOME/.claude/projects/$ENCODED_PATH/memory"

mkdir -p "$MEMORY_DEST"
cp .claude/memory/*.md "$MEMORY_DEST/"
echo "Claude memory installed to $MEMORY_DEST"

echo ""
echo "Done. Next steps:"
echo "  npm run dev       — start dev server"
echo "  npm test          — run tests"
echo "  npm run deploy    — deploy to GitHub Pages"
