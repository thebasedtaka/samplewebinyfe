// seed.ts
const MANAGE_URL =
  process.env.WEBINY_CMS_MANAGE_URL ||
  "https://d366rswf2s5l35.cloudfront.net/cms/manage";
const API_TOKEN = process.env.WEBINY_API_TOKEN;

if (!API_TOKEN) {
  console.error("Missing WEBINY_API_TOKEN in environment variables.");
  process.exit(1);
}

const CREATE_PRODUCT_MUTATION = /* GraphQL */ `
  mutation CreateProduct($data: ProductInput!, $fields: [String!]!) {
    createProduct(data: $data, fields: $fields) {
      data {
        id
        entryId
      }
      error {
        message
        code
      }
    }
  }
`;

const PUBLISH_PRODUCT_MUTATION = /* GraphQL */ `
  mutation PublishProduct($revision: ID!) {
    publishProduct(revision: $revision) {
      data {
        id
      }
      error {
        message
        code
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
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

const requestedFields = ["id", "entryId", "name", "sku", "description", "price"];

const therapyServices = [
  {
    name: "Individual Psychotherapy",
    sku: "SRV-IND-50",
    description:
      "One-on-one virtual or in-person sessions focusing on anxiety, mood regulation, and life transitions.",
    price: 165.0,
  },
  {
    name: "Cognitive Behavioral Therapy (CBT)",
    sku: "SRV-CBT-50",
    description:
      "Structured, goal-oriented sessions targeting cognitive reframing, habit formation, and stress management.",
    price: 180.0,
  },
  {
    name: "Couples & Relationship Counseling",
    sku: "SRV-CPL-60",
    description:
      "Facilitated dialogue designed to rebuild trust, communication flow, and mutual alignment.",
    price: 210.0,
  },
  {
    name: "Mindfulness-Based Stress Reduction",
    sku: "SRV-MBSR-45",
    description:
      "Guided somatic practices and somatic grounding routines to lower chronic autonomic strain.",
    price: 140.0,
  },
];

async function seed() {
  console.log("Seeding therapy services...\n");

  for (const item of therapyServices) {
    // Both 'data' and 'fields' must be provided in the variables object
    const createRes = await gqlRequest(CREATE_PRODUCT_MUTATION, {
      data: item,
      fields: requestedFields,
    });

    if (createRes.errors?.length) {
      console.error(`Failed to create "${item.name}":`, createRes.errors[0].message);
      continue;
    }

    if (createRes.data?.createProduct?.error) {
      console.error(
        `Failed to create "${item.name}":`,
        createRes.data.createProduct.error.message
      );
      continue;
    }

    const createdId = createRes.data.createProduct.data.id;
    console.log(`Created: ${item.name} (ID: ${createdId})`);

    const publishRes = await gqlRequest(PUBLISH_PRODUCT_MUTATION, {
      revision: createdId,
    });

    if (publishRes.errors?.length || publishRes.data?.publishProduct?.error) {
      console.error(
        `Failed to publish "${item.name}":`,
        publishRes.errors?.[0]?.message || publishRes.data?.publishProduct?.error?.message
      );
    } else {
      console.log(`Published: ${item.name}`);
    }
  }

  console.log("\nFinished seeding.");
}

seed();