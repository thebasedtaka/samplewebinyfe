// seed.ts
const MANAGE_URL =
  process.env.WEBINY_CMS_MANAGE_URL ||
  "https://d366rswf2s5l35.cloudfront.net/cms/manage";
const API_TOKEN = process.env.WEBINY_API_TOKEN;

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
  console.log(`Seeding therapy services to ${MANAGE_URL}...\n`);

  for (const item of therapyServices) {
    // Wrap fields in the "values" key:
    const createRes = await gqlRequest(CREATE_THERAPY_SERVICE_MUTATION, {
      data: {
        values: item,
      },
    });

    if (createRes.errors?.length) {
      console.error(
        `Failed to create "${item.name}":`,
        JSON.stringify(createRes.errors, null, 2)
      );
      continue;
    }

    if (createRes.data?.createTherapyService?.error) {
      const error = createRes.data.createTherapyService.error;

      if (isExistingServiceError(error.data)) {
        console.log(`Already exists: ${item.name} (slug and SKU are unique)`);
        continue;
      }

      console.error(
        `Failed to create "${item.name}":`,
        error.message,
        JSON.stringify(error.data || {}, null, 2)
      );
      continue;
    }

    const createdId = createRes.data.createTherapyService.data.id;
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
}

seed();