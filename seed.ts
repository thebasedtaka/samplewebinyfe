// seed.ts
const MANAGE_URL =
  process.env.WEBINY_CMS_MANAGE_URL ||
  "https://d366rswf2s5l35.cloudfront.net/cms/manage";
const API_TOKEN = process.env.WEBINY_API_TOKEN;

// Set to true to only create the first item, so you can verify the fix
// before running the full batch. Flip to false once confirmed.
const TEST_MODE = false;

if (!API_TOKEN) {
  console.error("Missing WEBINY_API_TOKEN in environment variables.");
  process.exit(1);
}

// Minimal Lexical rich text payload object expected by Webiny Manage API
const createLexicalContent = (text: string) => ({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text,
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});

const CREATE_THERAPY_SERVICE_MUTATION = /* GraphQL */ `
  mutation CreateTherapyService($data: TherapyServiceInput!) {
    createTherapyService(data: $data) {
      data {
        id
        entryId
      }
      error {
        message
        code
        data
      }
    }
  }
`;

const PUBLISH_THERAPY_SERVICE_MUTATION = /* GraphQL */ `
  mutation PublishTherapyService($revision: ID!) {
    publishTherapyService(revision: $revision) {
      data {
        id
      }
      error {
        message
        code
        data
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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} from ${MANAGE_URL}: ${text}`);
  }

  return res.json();
}

function isExistingServiceError(error: unknown) {
  const message = JSON.stringify(error);
  return message.includes('"fieldId":"slug"') && message.includes('"fieldId":"sku"');
}

const therapyServices = [
  {
    name: "Individual Psychotherapy",
    slug: "individual-psychotherapy",
    sku: "SRV-IND-50",
    category: "individual",
    deliveryMethod: ["Virtual", "In-Person"],
    durationMinutes: 50,
    price: 165.0,
    shortDescription:
      "One-on-one virtual or in-person sessions focusing on anxiety, mood regulation, and life transitions.",
    description: createLexicalContent(
      "Our individual psychotherapy sessions provide dedicated clinical support to help unpack emotional patterns, navigate life adjustments, and build sustainable emotional resilience."
    ),
    isFeatured: true,
  },
  {
    name: "Cognitive Behavioral Therapy (CBT)",
    slug: "cognitive-behavioral-therapy",
    sku: "SRV-CBT-50",
    category: "individual",
    deliveryMethod: ["Virtual", "In-Person"],
    durationMinutes: 50,
    price: 180.0,
    shortDescription:
      "Structured, goal-oriented sessions targeting cognitive reframing, habit formation, and stress management.",
    description: createLexicalContent(
      "Evidence-based cognitive reframing designed to identify distorted thinking cycles, interrupt maladaptive behaviors, and establish practical daily coping mechanics."
    ),
    isFeatured: true,
  },
  {
    name: "Couples & Relationship Counseling",
    slug: "couples-relationship-counseling",
    sku: "SRV-CPL-60",
    category: "couples",
    deliveryMethod: ["Virtual", "In-Person"],
    durationMinutes: 60,
    price: 210.0,
    shortDescription:
      "Facilitated dialogue designed to rebuild trust, communication flow, and mutual alignment.",
    description: createLexicalContent(
      "Guided relational dialogue helping couples move past gridlock, understand reciprocal emotional triggers, and establish shared vulnerability."
    ),
    isFeatured: true,
  },
  {
    name: "Mindfulness-Based Stress Reduction",
    slug: "mindfulness-based-stress-reduction",
    sku: "SRV-MBSR-45",
    category: "individual",
    deliveryMethod: ["Virtual"],
    durationMinutes: 45,
    price: 140.0,
    shortDescription:
      "Guided somatic practices and grounding routines to lower chronic autonomic strain.",
    description: createLexicalContent(
      "Somatic grounding and mindfulness training aimed at regulating nervous system arousal and alleviating chronic cognitive strain."
    ),
    isFeatured: false,
  },
];

async function seed() {
  const items = TEST_MODE ? therapyServices.slice(0, 1) : therapyServices;

  console.log(`Seeding therapy services to ${MANAGE_URL}...`);
  if (TEST_MODE) {
    console.log("TEST_MODE is on — only creating the first entry.\n");
  } else {
    console.log("");
  }

  for (const item of items) {
    // Confirmed via schema introspection: TherapyServiceInput has a
    // "values: TherapyServiceInputValues" field, so the mutation input
    // DOES need the values wrapper (the original script had this right).
    const createRes = await gqlRequest(CREATE_THERAPY_SERVICE_MUTATION, {
      data: { values: item },
    });

    // Log the full raw response so nothing gets missed — Webiny often
    // returns errors inside data.createTherapyService.error rather than
    // (or in addition to) the top-level errors array.
    console.log(`--- Response for "${item.name}" ---`);
    console.log(JSON.stringify(createRes, null, 2));

    if (createRes.errors?.length) {
      console.error(`Failed to create "${item.name}" (GraphQL errors above).`);
      continue;
    }

    if (createRes.data?.createTherapyService?.error) {
      const error = createRes.data.createTherapyService.error;

      if (isExistingServiceError(error.data)) {
        console.log(`Already exists: ${item.name} (slug and SKU are unique)`);
        continue;
      }

      console.error(`Failed to create "${item.name}":`, error.message);
      continue;
    }

    const createdId = createRes.data?.createTherapyService?.data?.id;
    if (!createdId) {
      console.error(
        `No id returned for "${item.name}" — check the raw response above before continuing.`
      );
      continue;
    }
    console.log(`Created: ${item.name} (ID: ${createdId})`);

    const publishRes = await gqlRequest(PUBLISH_THERAPY_SERVICE_MUTATION, {
      revision: createdId,
    });

    if (
      publishRes.errors?.length ||
      publishRes.data?.publishTherapyService?.error
    ) {
      console.error(
        `Failed to publish "${item.name}":`,
        publishRes.errors?.[0]?.message ||
          publishRes.data?.publishTherapyService?.error?.message
      );
    } else {
      console.log(`Published: ${item.name}`);
    }
  }

  console.log("\nFinished seeding.");
  if (TEST_MODE) {
    console.log(
      "Check Admin now: open the created entry and confirm the Full Description field renders correctly. If it looks right, set TEST_MODE = false and re-run for the rest."
    );
  }
}

seed();