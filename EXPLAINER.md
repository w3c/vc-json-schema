# VC JSON Schema Explained

[Verifiable Credentials](https://w3c.github.io/vc-data-model/) provide a JSON-LD data model that enables the issuance, sharing, and verification of digital credentials in a secure and interoperable manner. These credentials provide a way for individuals, organizations, and other entities to digitally represent and share their qualifications, attributes, and/or other relevant information. Verifiable Credentials are designed to enhance trust, privacy, and control in digital interactions by allowing the owner of the credentials to control how their information is shared and verified.

## Authors

- Gabe Cohen
- Orie Steele
- Andres Uribe

## Participate

- [Issue tracker](https://github.com/w3c/vc-json-schema/issues)
- [Discussion forum](https://lists.w3.org/Archives/Public/public-vc-wg/)

## Goals

Leveraging the section on [Data Schemas](https://w3c.github.io/vc-data-model/#data-schemas) in the VC Data Model, we aim to provide a stable and usable implementation for the `credentialSchema` property using the widely-adopted [JSON Schema](https://json-schema.org/) technology for _data verification schemas_. This allows any verifiable credential to have its data shape defined by a JSON Schema. We allow the JSON Schema to be represented as plain JSON or as a verifiable credential.

As stated in the data model:

> Data schemas are useful when enforcing a specific structure on a given collection of data.
> 
> Data verification schemas, which are used to verify that the structure and contents of a credential or verifiable credential conform to a published schema.


## How It Works

Before constructing or issuing a verifiable credential, there must first be a JSON Schema. The JSON Schema can exist anywhere as long as it is URI-addressable. The JSON Schema can be conformant to any specification version listed in the latest draft of this specification. We provide two `type` values for using JSON Schema within the `credentialSchema` property of a verifiable credential:

1. `JsonSchema2023`

   For plain use of a JSON Schema, we make available the type `JsonSchema2023`.

2. `CredentialSchema2023`

   Should the author of a JSON schema want to add additional features such as status, integrity protection, or retaining authorship information, there is an option to wrap the schema in a verifiable credential. For use of a JSON Schema packaged as a verifiable credential, we make available the type `CredentialSchema2023`.

### Example using JsonSchema2023

**JSON Schema**

```json
{
  "$id": "https://example.com/schemas/email.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "name": "EmailCredential",
  "description": "EmailCredential using JsonSchema2023",
  "type": "object",
  "properties": {
    "credentialSubject": {
      "type": "object",
      "properties": {
        "emailAddress": {
          "type": "string",
          "format": "email"
        }
      },
      "required": [
        "emailAddress"
      ]
    }
  }
}
```

**Verifiable Credential**

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://www.w3.org/ns/credentials/examples/v2"
  ],
  "id": "https://example.com/credentials/3732",
  "type": ["VerifiableCredential", "EmailCredential"],
  "issuer": "https://example.com/issuers/14",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "emailAddress": "subject@example.com"
  },
  "credentialSchema": {
    "id": "https://example.com/schemas/email.json",
    "type": "JsonSchema2023"
  }
}
```

### Example using CredentialSchema2023

**JSON Schema as a Credential**

```json
{
  "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
  ],
  "id": "https://example.com/credentials/3734",
  "type": ["VerifiableCredential", "CredentialSchema2023"],
  "issuer": "https://example.com/issuers/14",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "$id": "https://example.com/schemas/email-credential-schema.json",
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "name": "EmailCredential",
    "description": "EmailCredential using CredentialSchema2023",
    "type": "object",
    "properties": {
      "credentialSubject": {
        "type": "object",
        "properties": {
          "emailAddress": {
            "type": "string",
            "format": "email"
          }
        },
        "required": ["emailAddress"]
      }
    }
  }
}
```

**Verifiable Credential**

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://www.w3.org/ns/credentials/examples/v2"
  ],
  "id": "https://example.com/credentials/3733",
  "type": ["VerifiableCredential", "EmailCredential"],
  "issuer": "https://example.com/issuers/14",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "emailAddress": "subject@example.com"
  },
  "credentialSchema": {
    "id": "https://example.com/credentials/3734",
    "type": "CredentialSchema2023"
  }
}
```

## Conclusions

This document is a high-level summary of VC JSON Schemas as one option for use of the `credentialSchema` property in the VC Data Model. There may be other `type` definitions that make use of schema mechanisms other than JSON Schema, as the VC Data Model is by design open and extensible.
