This directory contains simple examples of signed vc-json-schema's.

A JSON-LD version using Ed25519Signature2018 looks like this:

```
{
  "@context": [
    "https://w3id.org/did/v1",
    "https://web-payments.org/contexts/security-v2.jsonld",
    "https://w3c-ccg.github.io/vc-json-schemas/context/vc-json-schema-v0.0.jsonld"
  ],
  "author": "did:work:MDP8AsFhHzhwUvGNuYkX7T",
  "authored": "2018-01-01T00:00:00+00:00",
  "id": "did:work:MDP8AsFhHzhwUvGNuYkX7T;id=06e126d1-fa44-4882-a243-1e326fbe21db;version=1.0",
  "modelVersion": "1.0",
  "name": "EmailCredentialSchema",
  "proof": {
    "created": "2019-12-11T03:50:55Z",
    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..kNEwxM2S5lftF2qM_Agp-75lv3QOGTHYhSqH6kHjMwfXJ7tRsjt20_bp89wzh9jPBOn2t2Zc4D7LAXjPWTXsDA",
    "proofPurpose": "assertionMethod",
    "type": "Ed25519Signature2018",
    "verificationMethod": "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP"
  },
  "schema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "additionalProperties": false,
    "description": "Email",
    "properties": { "emailAddress": { "format": "email", "type": "string" } },
    "required": ["emailAddress"],
    "type": "object"
  },
  "type": "https://credentials.workday.com/docs/credential-schema.json"
}

```

A custom JOSE non JSON-LD based signature suite JoseNonLinkedDataSignature2020, looks like this:

```
{
  "author": "did:work:MDP8AsFhHzhwUvGNuYkX7T",
  "authored": "2018-01-01T00:00:00+00:00",
  "id": "did:work:MDP8AsFhHzhwUvGNuYkX7T;id=06e126d1-fa44-4882-a243-1e326fbe21db;version=1.0",
  "modelVersion": "1.0",
  "name": "EmailCredentialSchema",
  "proof": {
    "created": "2019-12-09T06:02:19Z",
    "jws": "eyJhbGciOiJFZERTQSJ9..EXIU59Ik7ayisAqsey1jHE6Kc83aPsS3ygh3H0rLctvMWGSkrGZGwskk1wySPF8wd2_-EX59vSl5_M51MoWSBQ",
    "proofPurpose": "assertionMethod",
    "type": "JoseNonLinkedDataSignature2020",
    "verificationMethod": "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP"
  },
  "schema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "additionalProperties": false,
    "description": "Email",
    "properties": { "emailAddress": { "format": "email", "type": "string" } },
    "required": ["emailAddress"],
    "type": "object"
  },
  "type": "https://credentials.workday.com/docs/credential-schema.json"
}
```

Note that while both `look` like JSON-LD Signed Documents, the `JoseNonLinkedDataSignature2020` one does not have an `@context`.
