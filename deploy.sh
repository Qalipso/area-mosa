#!/usr/bin/env bash
# Deploy AREA MOSA website to Vercel
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Deploying AREA MOSA website to Vercel..."
npx vercel --prod --yes

echo "Done. Site live at https://area-mosa.vercel.app"
