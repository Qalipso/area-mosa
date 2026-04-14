#!/usr/bin/env bash
# Update n8n booking workflow: import + activate + restart
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKFLOW_FILE="$SCRIPT_DIR/n8n/booking-agent-workflow.json"
WORKFLOW_ID="area-mosa-booking-agent"

if [ ! -f "$WORKFLOW_FILE" ]; then
  echo "ERROR: Workflow file not found: $WORKFLOW_FILE"
  exit 1
fi

echo "1/3 Copying workflow into n8n container..."
docker cp "$WORKFLOW_FILE" n8n:/tmp/workflow.json

echo "2/3 Importing workflow..."
docker exec n8n n8n import:workflow --input=/tmp/workflow.json

echo "3/3 Restarting n8n..."
docker restart n8n

echo "Done. Workflow '$WORKFLOW_ID' updated. Wait ~10s for n8n to start."
