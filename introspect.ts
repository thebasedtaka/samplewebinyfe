const MANAGE_URL =
  process.env.WEBINY_CMS_MANAGE_URL ||
  "https://d366rswf2s5l35.cloudfront.net/cms/manage";
const API_TOKEN = process.env.WEBINY_API_TOKEN;

if (!API_TOKEN) {
  console.error("Missing WEBINY_API_TOKEN in environment variables.");
  process.exit(1);
}

const QUERY = /* GraphQL */ `
  query IntrospectEnum($name: String!) {
    __type(name: $name) {
      name
      kind
      enumValues {
        name
      }
    }
  }
`;

async function gqlRequest(query: string, variables: Record<string, unknown>) {
  const res = await fetch(MANAGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
      "x-tenant": "root",
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function main() {
  const res = await gqlRequest(QUERY, { name: "TherapyServiceListSorter" });
  console.log(JSON.stringify(res, null, 2));
}

main();
export {};
