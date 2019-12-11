const jsigs = require("jsonld-signatures");
const { Ed25519KeyPair } = require("crypto-ld");
const { Ed25519Signature2018 } = jsigs.suites;
const { AssertionProofPurpose } = jsigs.purposes;
JSON.canonicalize = require("canonicalize");

const {
  documentLoader,
  didKeypair,
  didKeyDoc,
  exampleEd25519Signature2018Unsigned,
  exampleEd25519Signature2018Signed
} = require("../__fixtures__");

describe("jsonld.vcjss", () => {
  it("sign verify", async () => {
    const key = new Ed25519KeyPair(didKeypair);
    const signed = await jsigs.sign(
      { ...exampleEd25519Signature2018Unsigned },
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

    expect(signed).toEqual(exampleEd25519Signature2018Signed);
    // console.log(JSON.canonicalize(signed));

    const result = await jsigs.verify(signed, {
      documentLoader,
      suite: new Ed25519Signature2018({
        key
      }),
      purpose: new AssertionProofPurpose({
        controller: didKeyDoc
      })
    });
    expect(result.verified).toBe(true);
  });
});
