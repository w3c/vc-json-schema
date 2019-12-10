const jose = require("jose");
const base64url = require("base64url");
const stringify = require("json-stringify-deterministic");

const { exampleUnsigned } = require("../__fixtures__");

describe("non-jsonld", () => {
  it("sign verify", async () => {
    delete exampleUnsigned["@context"];
    const privateKeyJwk = {
      crv: "Ed25519",
      x: "D-5zI9uCYOAk_bN_QWD2XAQ_gIyHUh-6OY7nVk-Rg0g",
      d: "zA65gfNF5g2CLKQnl8uRbGI2IRjJIE7PTZki7Qin9bw",
      kty: "OKP"
    };
    const header = {
      alg: "EdDSA"
    };
    const payload = exampleUnsigned;
    payload.proof = {
      type: "JoseNonLinkedDataSignature2020",
      created: "2019-12-09T06:02:19Z",
      verificationMethod:
        "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
      proofPurpose: "assertionMethod"
    };
    const flat = jose.JWS.sign.flattened(
      stringify(payload),
      jose.JWK.asKey(privateKeyJwk),
      header
    );
    const jws = `${flat.protected}..${flat.signature}`;
    const signed = { ...payload, proof: { ...payload.proof, jws } };
    expect(signed).toEqual({
      type: "https://credentials.workday.com/docs/credential-schema.json",
      modelVersion: "1.0",
      id:
        "did:work:MDP8AsFhHzhwUvGNuYkX7T;id=06e126d1-fa44-4882-a243-1e326fbe21db;version=1.0",
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
      },
      proof: {
        type: "JoseNonLinkedDataSignature2020",
        created: "2019-12-09T06:02:19Z",
        verificationMethod:
          "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
        proofPurpose: "assertionMethod",
        jws:
          "eyJhbGciOiJFZERTQSJ9..EXIU59Ik7ayisAqsey1jHE6Kc83aPsS3ygh3H0rLctvMWGSkrGZGwskk1wySPF8wd2_-EX59vSl5_M51MoWSBQ"
      }
    });

    let reconstructedPayload = { ...signed };
    let [
      encodedHeader,
      encodedSignature
    ] = reconstructedPayload.proof.jws.split("..");
    delete reconstructedPayload.proof.jws;
    const encodedPayload = base64url.encode(stringify(reconstructedPayload));
    const reconstructedJWS = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;

    const verified = jose.JWS.verify(
      reconstructedJWS,
      jose.JWK.asKey(privateKeyJwk)
    );

    expect(verified).toEqual({
      type: "https://credentials.workday.com/docs/credential-schema.json",
      modelVersion: "1.0",
      id:
        "did:work:MDP8AsFhHzhwUvGNuYkX7T;id=06e126d1-fa44-4882-a243-1e326fbe21db;version=1.0",
      name: "EmailCredentialSchema",
      author: "did:work:MDP8AsFhHzhwUvGNuYkX7T",
      authored: "2018-01-01T00:00:00+00:00",
      schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        description: "Email",
        type: "object",
        properties: { emailAddress: { type: "string", format: "email" } },
        required: ["emailAddress"],
        additionalProperties: false
      },
      proof: {
        type: "JoseNonLinkedDataSignature2020",
        created: "2019-12-09T06:02:19Z",
        verificationMethod:
          "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
        proofPurpose: "assertionMethod"
      }
    });

    // in a client library we might reappend the jws, after verifiying it...
  });
});
