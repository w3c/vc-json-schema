const jsigs = require("jsonld-signatures");
const { Ed25519KeyPair } = require("crypto-ld");
const { Ed25519Signature2018 } = jsigs.suites;
const { AssertionProofPurpose } = jsigs.purposes;

const didKeypair = {
  passphrase: null,
  id: "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
  controller: "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
  type: "Ed25519VerificationKey2018",
  privateKeyBase58:
    "55dKnusKVZjGK9rtTQgT3usTnALuChkzQpoksz4jES5G7AKMCpQCBt3azfko5oTMQD11gPxQ1bFRAYWSwcYSPdPV",
  publicKeyBase58: "25C16YaTbD96wAvdokKnTmD8ruWvYARDkc6nfNEA3L71"
};

const documentLoader = require("./documentLoader");
const didDocs = require("./didDocs");

const doc = {
  "@context": [
    "https://w3id.org/did/v1",
    "https://w3id.org/security/v2",
    {
      schema: "http://schema.org/",
      name: "schema:name",
      homepage: "schema:url",
      image: "schema:image"
    }
  ],
  name: "Manu Sporny",
  homepage: "https://manu.sporny.org/",
  image: "https://manu.sporny.org/images/manu.png"
};

describe("jsonld-signatures", () => {
  it("ensure sign verify work", async () => {
    const key = new Ed25519KeyPair(didKeypair);
    const signed = await jsigs.sign(
      { ...doc },
      {
        documentLoader,
        suite: new Ed25519Signature2018({
          key,
          date: "2019-12-11T03:50:55Z"
        }),
        purpose: new AssertionProofPurpose(),
        compactProof: false
      }
    );
    const result = await jsigs.verify(signed, {
      documentLoader,
      suite: new Ed25519Signature2018({
        key
      }),
      purpose: new AssertionProofPurpose({
        controller:
          didDocs["did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP"]
      })
    });
    expect(result.verified).toBe(true);
  });
});
