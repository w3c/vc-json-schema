const jose = require("jose");
const base64url = require("base64url");
JSON.canonicalize = require("canonicalize");

const {
  exampleJoseNonLinkedDataSignature2020Unsigned,
  exampleJoseNonLinkedDataSignature2020Signed
} = require("../__fixtures__");

describe("non-jsonld", () => {
  it("sign verify", async () => {
    const privateKeyJwk = {
      crv: "Ed25519",
      x: "D-5zI9uCYOAk_bN_QWD2XAQ_gIyHUh-6OY7nVk-Rg0g",
      d: "zA65gfNF5g2CLKQnl8uRbGI2IRjJIE7PTZki7Qin9bw",
      kty: "OKP"
    };
    const header = {
      alg: "EdDSA"
    };
    const payload = exampleJoseNonLinkedDataSignature2020Unsigned;
    payload.proof = {
      type: "JoseNonLinkedDataSignature2020",
      created: "2019-12-09T06:02:19Z",
      verificationMethod:
        "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
      proofPurpose: "assertionMethod"
    };
    const flat = jose.JWS.sign.flattened(
      JSON.canonicalize(payload),
      jose.JWK.asKey(privateKeyJwk),
      header
    );
    const jws = `${flat.protected}..${flat.signature}`;
    const signed = { ...payload, proof: { ...payload.proof, jws } };

    expect(signed).toEqual(exampleJoseNonLinkedDataSignature2020Signed);

    let reconstructedPayload = { ...signed };
    let [
      encodedHeader,
      encodedSignature
    ] = reconstructedPayload.proof.jws.split("..");
    delete reconstructedPayload.proof.jws;
    const encodedPayload = base64url.encode(
      JSON.canonicalize(reconstructedPayload)
    );
    const reconstructedJWS = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;

    const verified = jose.JWS.verify(
      reconstructedJWS,
      jose.JWK.asKey(privateKeyJwk)
    );

    expect(verified).toEqual(exampleJoseNonLinkedDataSignature2020Unsigned);
    // in a client library we might reappend the jws, after verifiying it...
  });
});
