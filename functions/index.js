const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const Anthropic = require("@anthropic-ai/sdk");

const anthropicKey = defineSecret("ANTHROPIC_API_KEY");

exports.scanFuelReceipt = onRequest(
  { secrets: [anthropicKey], cors: ["https://barrett928-design.github.io"], invoker: "public" },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { imageBase64, mediaType } = req.body;
    if (!imageBase64 || !mediaType) {
      return res.status(400).json({ error: "Missing imageBase64 or mediaType" });
    }

    const client = new Anthropic({ apiKey: anthropicKey.value() });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: imageBase64 },
            },
            {
              type: "text",
              text: `This is a fuel receipt. Extract the following fields and return ONLY valid JSON, no explanation:
{
  "date": "YYYY-MM-DD or null",
  "location": "station name and/or city or null",
  "diesel_gal": number or null,
  "diesel_subtotal": number or null,
  "diesel_taxes_and_fees": number or null,
  "diesel_total": number or null,
  "gas_gal": number or null,
  "gas_subtotal": number or null,
  "gas_taxes_and_fees": number or null,
  "gas_total": number or null,
  "notes": "any relevant notes like jerry can, card number, etc or null"
}
For *_subtotal: the pre-tax fuel charge. For *_taxes_and_fees: any taxes, fees, or surcharges. For *_total: the final after-tax amount charged (subtotal + taxes). If the receipt shows only one total with no breakdown, put it in *_total and leave subtotal and taxes_and_fees null.
If diesel and regular/unleaded are both on the receipt, map diesel→diesel fields and regular/unleaded→gas fields.
If only one fuel type is present and it's clearly diesel, use diesel fields. If it's regular/unleaded, use gas fields.
Return only the JSON object.`,
            },
          ],
        },
      ],
    });

    let text = message.content[0].text.trim();
    // Strip markdown code fences if Claude wrapped the response
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const json = JSON.parse(text);
    return res.status(200).json(json);
  }
);
