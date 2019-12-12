const jsigs = require("jsonld-signatures");
const { Ed25519KeyPair } = require("crypto-ld");
const { Ed25519Signature2018 } = jsigs.suites;
const vc = require("vc-js");

const key = {
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

const credential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  id: "http://example.edu/credentials/58473",
  type: ["VerifiableCredential", "UniversityDegreeCredential"],
  issuer: "did:example:ebfeb1f712ebc6f1c276e12ec21",
  issuanceDate: "2019-12-02T15:08:37.751Z",
  credentialSubject: {
    id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
    degree: {
      type: "BachelorDegree",
      name: "Bachelor of Science and Arts"
    }
  }
};

jest.setTimeout(10 * 1000);

describe("vc-js", () => {
  it("ensure sign verify work", async () => {
    const suite = new Ed25519Signature2018({
      key: new Ed25519KeyPair(key)
    });
    const signed = await vc.issue({
      credential,
      suite,
      documentLoader
    });
    const result = await vc.verify({
      credential: signed,
      suite,
      controller:
        didDocs["did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP"]
    });
    expect(result.verified).toBe(true);
  });
});
