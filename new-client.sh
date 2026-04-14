#!/bin/bash
# Generate a new client booking workflow from the AREA MOSA template
# Usage: ./new-client.sh <instance-name> <business-name> <phone> <master-name> <address>
#
# Example:
#   ./new-client.sh "barberia-gs" "Barberia GS" "59812345678" "Carlos" "Centro, Montevideo"
#
# After running, edit the generated workflow JSON to customize:
# - Services list and durations
# - Working hours
# - Languages (default: Spanish only)

set -euo pipefail

INSTANCE_NAME="${1:?Usage: $0 <instance-name> <business-name> <phone> <master-name> <address>}"
BUSINESS_NAME="${2:?Missing business name}"
PHONE="${3:?Missing phone number (digits only)}"
MASTER_NAME="${4:?Missing master/owner name}"
ADDRESS="${5:?Missing address}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/n8n"
OUTPUT_DIR="$SCRIPT_DIR/../$INSTANCE_NAME/n8n"

echo "=== Generating booking automation for: $BUSINESS_NAME ==="
echo "  Instance: $INSTANCE_NAME"
echo "  Phone: $PHONE"
echo "  Master: $MASTER_NAME"
echo "  Address: $ADDRESS"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Generate booking workflow
echo "1. Generating booking-agent-workflow.json..."
sed \
  -e "s/AREA MOSA/$BUSINESS_NAME/g" \
  -e "s/area-mosa/$INSTANCE_NAME/g" \
  -e "s/59894786877/$PHONE/g" \
  -e "s/Artem/$MASTER_NAME/g" \
  -e "s/Cordon, Montevideo, Uruguay/$ADDRESS/g" \
  -e "s/Cord.n, Montevideo, Uruguay/$ADDRESS/g" \
  -e "s/whatsapp-booking/${INSTANCE_NAME}-booking/g" \
  "$TEMPLATE_DIR/booking-agent-workflow.json" > "$OUTPUT_DIR/booking-agent-workflow.json"

# Generate reminder workflow
echo "2. Generating reminder-workflow.json..."
sed \
  -e "s/AREA MOSA/$BUSINESS_NAME/g" \
  -e "s/area-mosa/$INSTANCE_NAME/g" \
  -e "s/59894786877/$PHONE/g" \
  -e "s/Artem/$MASTER_NAME/g" \
  -e "s/Cordon, Montevideo, Uruguay/$ADDRESS/g" \
  -e "s/Cord.n, Montevideo, Uruguay/$ADDRESS/g" \
  "$TEMPLATE_DIR/reminder-workflow.json" > "$OUTPUT_DIR/reminder-workflow.json"

echo ""
echo "=== Done! Files generated in: $OUTPUT_DIR ==="
echo ""
echo "Next steps:"
echo "  1. Edit $OUTPUT_DIR/booking-agent-workflow.json"
echo "     - Update services list in the AI Agent system prompt"
echo "     - Update working hours"
echo "     - Update languages if needed"
echo "  2. Import both files into n8n"
echo "  3. Create Evolution API instance: $INSTANCE_NAME"
echo "  4. Scan QR code with WhatsApp: +$PHONE"
echo "  5. Set webhook URL in Evolution API"
echo "  6. Test!"
