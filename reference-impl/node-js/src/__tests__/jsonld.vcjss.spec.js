const jsigs = require("jsonld-signatures");
const { Ed25519KeyPair } = require("crypto-ld");
const { Ed25519Signature2018 } = jsigs.suites;
const { AssertionProofPurpose } = jsigs.purposes;

const {
  documentLoader,
  didKeypair,
  didKeyDoc,
  exampleUnsigned
} = require("../__fixtures__");

const doc = {
  "@context": [
    "https://w3id.org/did/v1",
    "https://web-payments.org/contexts/security-v2.jsonld",
    "https://w3c-ccg.github.io/vc-json-schemas/context/vc-json-schema-v0.0.jsonld"
  ],
  name: "EmailCredentialSchema",
  author: "did:work:MDP8AsFhHzhwUvGNuYkX7T",
  authored: "2018-01-01T00:00:00+00:00",
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    description: "Email",
    type: "object",
    properties: {
      emailAddress: {
        type: "string",
        format: "email"
      }
    },
    required: ["emailAddress"],
    additionalProperties: false
  }
};

describe("jsonld.vcjss", () => {
  it("sign verify", async () => {
    const key = new Ed25519KeyPair(didKeypair);
    const signed = await jsigs.sign(
      { ...doc },
      {
        documentLoader,
        suite: new Ed25519Signature2018({
          key
        }),
        purpose: new AssertionProofPurpose(),
        compactProof: false
      }
    );

    console.log(JSON.stringify(signed, null, 2));

    const result = await jsigs.verify(signed, {
      documentLoader,
      suite: new Ed25519Signature2018({
        key
      }),
      purpose: new AssertionProofPurpose({
        controller: didKeyDoc
      })
    });

    console.log(result);
    expect(result.verified).toBe(true);
  });
});
