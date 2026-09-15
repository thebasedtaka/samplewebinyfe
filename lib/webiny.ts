import { Webiny } from "@webiny/sdk";

const API_ENDPOINT =
  process.env.WEBINY_API_ENDPOINT ||
  process.env.NEXT_PUBLIC_WEBINY_API_URL ||
  process.env.NEXT_PUBLIC_WEBINY_CMS_READ_API_URL ||
  "";

const API_TOKEN =
  process.env.WEBINY_API_TOKEN || process.env.NEXT_PUBLIC_WEBINY_API_TOKEN || "";

const API_TENANT = process.env.WEBINY_API_TENANT || "root";

if (!API_ENDPOINT || !API_TOKEN) {
  throw new Error(
    "Missing required environment variables: WEBINY_API_ENDPOINT and WEBINY_API_TOKEN. Add them to .env.local or your GitHub Actions secrets."
  );
}

// Initialize and export the SDK
export const sdk = new Webiny({
  token: API_TOKEN,
  endpoint: API_ENDPOINT,
  tenant: API_TENANT,
});

// Export CmsEntryData type for use in components
export type { CmsEntryData } from "@webiny/sdk";