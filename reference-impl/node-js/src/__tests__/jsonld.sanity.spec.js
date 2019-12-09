const jsigs = require("jsonld-signatures");
const { Ed25519KeyPair } = require("crypto-ld");
const { Ed25519Signature2018 } = jsigs.suites;
const { AuthenticationProofPurpose } = jsigs.purposes;

const {
  didKeyDoc,
  didKeypair,
  authenticateMeActionDoc,
  documentLoader
} = require("../__fixtures__");

const doc = {
  "@context": [
    "https://w3id.org/did/v1",
    "https://web-payments.org/contexts/security-v2.jsonld",
    {
      schema: "http://schema.org/",
      name: "schema:name",
      data: { "@id": "schema:data", "@type": "@json" }
    }
  ],
  name: "Alice",
  data: {
    hello: 1,
    foo: "bar"
  }
};

describe("jsonld.sanity", () => {
  it("sign verify", async () => {
    const key = new Ed25519KeyPair(didKeypair);
    const signed = await jsigs.sign(
      { ...doc },
      {
        documentLoader,
        suite: new Ed25519Signature2018({
          key
        }),
        purpose: new AuthenticationProofPurpose({
          challenge: "abc",
          domain: "example.com"
        }),
        compactProof: false
      }
    );
    const result = await jsigs.verify(signed, {
      documentLoader,
      suite: new Ed25519Signature2018({
        key
      }),
      purpose: new AuthenticationProofPurpose({
        controller: didKeyDoc,
        challenge: "abc",
        domain: "example.com"
      })
    });
    console.log(result);
    expect(result.verified).toBe(true);
  });
});
