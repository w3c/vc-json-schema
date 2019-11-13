# Verifiable Credentials JSON Schema Specification
- Editors:
  - [Gabe Cohen](mailto:gabe.cohen@workday.com)[(Workday)](https://credentials.workday.com/)
  - [Orie Steele](https://www.linkedin.com/in/or13b/)[(Transmute)](https://www.transmute.industries/)

- Authors: 
  - [Bjorn Hamel](mailto:bjorn.hamel@workday.com)[(Workday)](https://credentials.workday.com/)
  - [Joe Genereux](mailto:joe.genereux@workday.com)[(Workday)](https://credentials.workday.com/)
  - [Jonathan Reynolds](mailto:jonathan.reynolds@workday.com)[(Workday)](https://credentials.workday.com/)
  - [Rory Martin](mailto:rory.martin@workday.com)[(Workday)](https://credentials.workday.com/)
- Last updated: 2019-11-07

## Status
- Status: **DRAFT**
- Status Date: 2019-09-27

## Abstract
The [W3C Verifiable Credentials Data Model](https://w3c.github.io/vc-data-model/) specifies the models used for Verifiable Credentials and Verifiable Presentations, and explains the relationships between three parties: _issuer_, _holder_, and _verifier_. A critical piece of infrastructure out of the scope of those specifications is the __Credential Schema__. This specification provides a mechanism to express a Credential Schema and the protocols for evolving the schema.

## Contents
  * [Abstract](#abstract)
  * [Contents](#contents)
  * [Standards & Compliance](#standards--compliance)
  * [Formatting](#formatting)
  * [Specification](#specification)
    - [1.0 Introduction](#10-introduction)
    - [1.1 What Is a Credential Schema?](#11-what-is-a-credential-schema)
    - [1.2 Schema Guarantees](#12-schema-guarantees)
    - [1.3 Where Can I Find a Credential Schema?](#13-where-can-i-find-a-credential-schema)
    - [1.4 A Note on Versioning](#14-a-note-on-versioning)
    - [2.0 Credential Schema Definition](#20-credential-schema-definition)
      + [JSON Schema](#json-schema)
      + [Example](#example)
    - [2.1 Type](#21-type)
    - [2.2 Model Version](#22-model-version)
    - [2.3 ID](#23-id)
    - [2.4 Schema Version](#24-schema-version)
      + [Addition](#addition)
      + [Revision](#revision)
      + [Model](#model)
    - [2.5 Name](#25-name)
    - [2.6 Author](#26-author)
    - [2.7 Authored](#27-authored)
    - [2.8 JSON Schema](#28-json-schema)
  * [Extensibility](#extensibility)
  * [Drawbacks](#drawbacks)
  * [Alternatives](#alternatives)
  * [Prior Art](#prior-art)
  * [Security & Privacy Considerations](#security--privacy-considerations)
  * [Interoperability Considerations](#interoperability-considerations)
  * [Glossary](#glossary)
  * [References](#references)

## Standards & Compliance
The [W3C Verifiable Credentials Data Model](https://w3c.github.io/vc-data-model/) specifies the models used for Verifiable Credentials and Verifiable Presentations, and while this spec attempts to align closely to the W3C model, it should __NOT__ be assumed this specification is fully compliant at the time of this writing. Ultimately, we would like to comply with the W3C specification; however, due to the fact that the W3C specification is under active development and is subject to change, we have diverged from that model with several "forks" that are fully outlined in this specification.

## Formatting
The W3C Verifiable Credentials Data Model provides its examples in the JSON Linked Data (JSON-LD) interchange format. The specification allows for other formats, such as standard JSON with JSON Schema but provides only limited examples. In the [credentialSchema](https://www.w3.org/TR/vc-data-model/#data-schemas) section, _JSON-SCHEMA-2018_ validation is explicitly called out. This specification does not use JSON-LD. If it becomes evident that it would be useful to include JSON-LD or another format that decision would be made in a revisal draft at a later date.

The Verifiable Credentials data model relies heavily upon standard JSON with validation provided by [JSON Schema Draft 7](https://json-schema.org/). The data model embeds JSON Schema documents inside a larger document that contains useful metadata about a given credential schema.

## Specification

### 1.0 Introduction
This specification provides a mechanism for the use of verifiable credentials in a highly scalable, secure, and verifiable way. A large part of the integrity of a verifiable credential is how to structure the credential so that all three parties (issuer, holder, verifier) may have a singular mechanism of trust into what they are using. We call that document a _Credential Schema_.

This specification provides a standardized way of creating Credential Schemas to be used in credentialing platforms, how to version them, and how to read them.

### 1.1 What is a Credential Schema?
The __Credential Schema__ is a document that is used to guarantee the structure, and by extension the semantics, of the set of claims comprising a Verifiable Credential. A shared Credential Schema allows all parties to reference data in a known way.

A schema can be viewed from four perspectives: the author, issuer, verifier and holder.

__Author__: An author creates a schema as a blueprint for a verifiable credential, specifying the shape and format of the data in such a credential.

__Issuer__: Issuers utilize schemas to provide structure and meaning to the data they issue as verifiable credentials. By using schemas, issuers contribute to a credentialing ecosystem, and promote the use and adoption of data standards.

__Verifier__: A verifier requesting data needs to do so with knowledge of the  credential shapes. Credential Schemas allow a Verifier to ask for data knowing that an issuer has issued in an understood way and that a holder's wallet can find data matching that requested.

__Holder__: Holders, or those who are the subject of credential issuance, can make sense of the data they own -- values -- by viewing it against a schema -- keys. When data is requested from them by referencing a Credential Schema, this known structure allows the holder's wallet to return the data specifically requested by the verifier.

### 1.2 Schema Guarantees
By adhering to the specification, the following guarantees can be made about a schema:

 * A schema is _versionable_ and new versions can evolve it over time
 * A schema is available for any issuer to use and any verifier, or other platform member to _read_
 * A schema always guarantees the structure of a credential. The described structure can be used by the Verifier to understand what data the Holder holds. There is no requirement for the Verifier to validate sent data against the schema since this sent data may only be partial, for example in event of a proof request only requiring a single field from a credential with multiple fields defined in the schema.

### 1.3 Where Can I Find a Credential Schema?
Credential Schemas are created and made available as immutable objects on a distributed ledger.

### 1.4 A Note on Versioning
Schemas are versioned in two ways, via `modelVersion` and `version` properties, both of which are expanded upon later in this document. Versioning provides benefits for schema authors, issuers, and verifiers to make sense of their data.

Authors and Issuers care about versioning to track advancements and changes over time both for formatting changes (e.g. supporting JSON Schema Draft 7 as opposed to Draft 6) as well as fields as a schema converges to its most currently usable form (e.g. adding a new required field). Holders care about versioning to know where and how their credential can be used. Similarly, Verifiers care about versioning to know which data, or model versions they should accept in their systems.

### 2.0 Credential Schema Definition
This section provides the json-schema definition for Credential Schema along with an example of a Credential Schema for an Email Verified Credential.

#### JSON Schema
<details>
  <summary>Show/Hide JSON Schema</summary>

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "modelVersion": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "author": {
      "type": "string"
    },
    "authored": {
      "type": "string"
    },
    "schema": {
      "type": "object",
      "properties": {
        "$schema": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "type": {
          "type": "string"
        },
        "properties": {
          "type": "object"
        },
        "required": {
          "type": "array",
          "items": [
            {
              "type": "string"
            }
          ]
        },
        "additionalProperties": {
          "type": "boolean"
        }
      },
      "required": [
        "$schema",
        "description",
        "type",
        "properties",
        "required",
        "additionalProperties"
      ]
    },
    "proof": {
      "type": "object",
      "properties": {
        "created": {
          "type": "string"
        },
        "creator": {
          "type": "string"
        },
        "nonce": {
          "type": "string"
        },
        "signatureValue": {
          "type": "string"
        },
        "type": {
          "type": "string"
        }
      },
      "required": [
        "created",
        "creator",
        "nonce",
        "signatureValue",
        "type"
      ]
    }
  },
  "required": [
    "type",
    "modelVersion",
    "name",
    "author",
    "authored",
    "schema",
    "proof"
  ]
}
```

</details>

#### Example
```json
{
  "type": "https://credentials.workday.com/docs/credential-schema.json",
  "modelVersion": "1.0",
  "id": "did:work:MDP8AsFhHzhwUvGNuYkX7T;id=06e126d1-fa44-4882-a243-1e326fbe21db;version=1.0",
  "name": "EmailCredentialSchema",
  "author": "did:work:MDP8AsFhHzhwUvGNuYkX7T",
  "authored": "2018-01-01T00:00:00+00:00",
  "schema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Email",
    "type": "object",
    "properties": {
      "emailAddress": {
        "type": "string",
        "format": "email"
      }
    },
    "required": ["emailAddress"],
    "additionalProperties": false
  },
  "proof": {
      "created": "2019-09-27T06:26:11Z",
      "creator": "did:work:MDP8AsFhHzhwUvGNuYkX7T#key-1",
      "nonce": "0efba23d-2987-4441-998e-23a9d9af79f0",
      "signatureValue": "2A7ZF9f9TWMdtgn57Y6dP6RQGs52xg2QdjUESZUuf4J9BUnwwWFNL8vFshQAEQF6ZFBXjYLYNU4hzXNKc3R6y6re",
      "type": "Ed25519VerificationKey2018"
  }
}
```

### 2.1 Type
It is important in software systems for machines to understand the context of what a document is. In credential schemas this is declared in the __type__ field. This field resolves to a JSON schema with details about the __schema metadata__ that applies to the schema.

### 2.2 Model Version
After a machine has parsed the type property it should know that the document it is reading is a credential schema. The next field is the version, which  denotes what version of the __schema metadata__ this is. 

### 2.3 ID
A globally unique identifier to locate the schema on a distributed ledger. Each credential schema has its own unique identifier, and each _version_ of a credential schema is required to have its own unique identifier. 

This identifier is a [Generic DID Parameter Name](https://w3c-ccg.github.io/did-core/#generic-did-parameter-names) based upon the author of the schema. For example, if the author had a did like `did:work:abcdefghi` a possible schema ID the author created would have an identifier such as: `did:work:abcdefghi;id=17de181feb67447da4e78259d92d0240;version=1.0`

### 2.4 Schema Version
Schema versioning is defined as __MODEL.REVISION__ where __MODEL__ is a breaking change and __REVISION__ is non-breaking. The version is contained within the schema identifier.

With schemas we are concerned with a new schema and backwards compatibility of _existing data_ on an older schema. 

__MODEL__ Updating this number tells the end user that this version breaks the schema for ANY interaction with an older schema. For verification if a holder presents a credential built from a schema of version 1.0 and the platform is only looking for > 2.0, it is *not* able to parse ANY information.

__REVISION__ Updating this number tells the end user that this version may prevent interactions with parts of the schema. For verification if a holder presents a credential built from a schema of version 1.0 and the platform is looking for > 1.5, there are likely to be SOME fields incompatible with the expected credential.

#### REVISION
The addition or removal of an __optional__ field is what would typically constitute a __REVISION__. Removing or adding an optional field does not break historical data in a schema and in the claims exchange protocol fields that are returned negative in the optional field can be ignored as they are optional by default.

```json
{
 "type": "https://credentials.workday.com/docs/credential-schema.json",
 "modelVersion": "1.0",
 "id": "did:work:MDP8AsFhHzhwUvGNuYkX7T;id=06e126d1-fa44-4882-a243-1e326fbe21db;version=1.0",
 "name": "EmailCredentialSchema",
 "author": "did:work:MDP8AsFhHzhwUvGNuYkX7T",
 "authored": "2018-01-01T00:00:00+00:00",
 "schema": {
   "$schema": "http://json-schema.org/draft-07/schema#",
   "description": "Email",
   "type": "object",
   "properties": {
 	  "emailAddress": {
   	  "type": "string",
   	  "format": "email"
    }
   },
   "required": ["emailAddress"],
   "additionalProperties": false
 }...
```

In this example we once again reference the email schema, but this time we add an optional field _backupEmailAddress_. Notice how this would not break the claims exchange because the field is _optional_.

```json
{
 "type": "https://credentials.workday.com/docs/credential-schema.json",
 "modelVersion": "1.0",
 "id": "did:work:MDP8AsFhHzhwUvGNuYkX7T;id=06e126d1-fa44-4882-a243-1e326fbe21db;version=1.1",
 "name": "EmailCredentialSchema",
 "author": "did:work:abc123",
 "authored": "2018-01-01T00:00:00+00:00",
 "schema": {
   "$schema": "http://json-schema.org/draft-07/schema#",
   "description": "Email",
   "type": "object",
   "properties": {
    "emailAddress": {
      "type": "string",
      "format": "email"
    },
    "backupEmailAddress": {
      "type": "string",
      "format": "email"
    }
   },
   "required": ["emailAddress"],
   "additionalProperties": false
 }
```

#### MODEL
When a schema breaks historical data we call it a model change. This is the major differentiating point between other schema versioning protocols which allow for some breaking changes because as we learned in the problem section, even breaking one area can lead to very difficult issues for verifiers through the credential exchange protocol. The most common case of a __MODEL__ change is the addition or subtraction of a required field. It is also important to note that for the change of a key name on a required field constitutes a MODEL change. Why? Because technically that introduces a breaking change and adds a required field.

An example of this rule is when the `additionalProperties` field's value changes. Changing `additionalProperties` from `false` to `true` __OR__ from `true` to `false` constitutes a breaking change, necessitating a __MODEL__ increment.

```json
{
 "type": "https://credentials.workday.com/docs/credential-schema.json",
 "modelVersion": "1.0",
 "id": "did:work:MDP8AsFhHzhwUvGNuYkX7T;id=06e126d1-fa44-4882-a243-1e326fbe21db;version=1.1",
 "name": "EmailCredentialSchema",
 "author": "did:work:MDP8AsFhHzhwUvGNuYkX7T",
 "authored": "2018-01-01T00:00:00+00:00",
 "schema": {
   "$schema": "http://json-schema.org/draft-07/schema#",
   "description": "Email",
   "type": "object",
   "properties": {
    "emailAddress": {
      "type": "string",
      "format": "email"
    },
    "backupEmailAddress": {
      "type": "string",
      "format": "email"
    }
   },
   "required": ["emailAddress"],
   "additionalProperties": false
 }
```

This time our credentialing requirements for email have changed and email address is no longer enough information on a credential, and we need to attach a name for verification as well to our schema. This is a _required_ field, so we know it is a __MODEL__ change.

```json
{
 "type": "https://credentials.workday.com/docs/credential-schema.json",
 "modelVersion": "1.0",
 "id": "did:work:MDP8AsFhHzhwUvGNuYkX7T;id=06e126d1-fa44-4882-a243-1e326fbe21db;version=2.0",
 "name": "EmailCredentialSchema",
 "author": "did:work:MDP8AsFhHzhwUvGNuYkX7T",
 "authored": "2018-01-01T00:00:00+00:00",
 "schema": {
   "$schema": "http://json-schema.org/draft-07/schema#",
   "description": "Email",
   "type": "object",
   "properties": {
    "emailAddress": {
      "type": "string",
      "format": "email"
    },
    "firstName": {
      "type": "string"
    },
    "backupEmailAddress": {
      "type": "string",
      "format": "email"
    }
   },
   "required": ["emailAddress", "firstName"],
   "additionalProperties": false
 }
```

### 2.5 Name
A human-readable name for the schema.

### 2.6 Author
DID of the identity which authored the credential schema.

### 2.7 Authored
RFC-3339 date on which the schema was created.

### 2.8 Schema
This is where the Credential Schema data fields are defined

```json
{
 "$schema": "http://json-schema.org/draft-07/schema#",
 "description": "Email",
 "type": "object",
 "properties": {
   "emailAddress": {
 	   "type": "string",
 	   "format": "email"
   }
 },
 "required": ["emailAddress"],
 "additionalProperties": false
}
```

## Extensibility
By introducing a `modelVersion` field we allow the credential schema to become extensible. Properties such as `derivedFrom` could reference a schema that a new schema is built on top of. Similarly, platform-utility features such as searchability could be provided by adding a `tags` array that contains categorization and classification information for a schema.

These are just a few examples that illustrate the flexibility of the proposed model. It can be extended to support a wide variety of use-cases and make the burden on issuance and verification simpler by facilitating the development of higher-level tooling.

## Drawbacks
Within a credentialing ecosystem, relying heavily upon JSON Schema makes data shapes for credentials consistent, and could enable an ecosystem with many similar schemas with slight changes (naming, capitalization). Without proper oversight or authoritative schemas to limit duplication or misuse utilization of JSON Schema could lead to a poor user experience. At the platform level tooling can be provided to minimize confusion and promote reuse.

Within the broader Credentialing Ecosystem, interoperability could be more difficult if the wider community adopts JSON-LD without advocating for pairing with JSON Schema based schemas or credentials. This issue can mainly be side-stepped with the metadata we include -- the _Credential Schema_ –– since this model is flexible to change. A new __modelVersion__ could be introduced that supports JSON-LD and removes support for JSON Schema. A drawback here is the requirement that all schemas have this piece of metadata, which itself is versioned and evolvable.

A flip side to drawbacks of the usage of JSON Schema is that there is a plethora of documentation, libraries, and usage of JSON Schema across programming languages and the web.

## Alternatives
[JSON-LD](https://json-ld.org/) schemas is the most prominent alternative.

## Prior Art
* The [Verifiable Credential Specification](https://w3c.github.io/vc-data-model/) is valuable for providing initial context.
* Hyperledger Indy uses [schemas](https://github.com/sovrin-foundation/protocol/blob/master/themis/schema.md) in a similar way to the description in this document.

## Security & Privacy Considerations
Privacy & security considerations mainly revolve around Personally Identifiable Information (PII) leaks in schemas. Any field which a user could enter data is a potential area for personally identifiable information. When implementing systems that support the storage and querying of schemas relevant data privacy laws and regulations must be taken into account.

## Interoperability Considerations
The primary concern of this specification is to facilitate an ecosystem in which Verifiable Credentials can be issued and used. To be interoperable, additional schema types may need to be supported. Given the investment into a robust versioning strategy of our __Credential Schema Metadata__ interoperability with the current design is less of a concern.

A goal of publishing this document is to promote others to adopt our schema philosophy. It also opens the door for providing feedback and collaborative contribution to developing primitives that would lead to a successful verifiable ecosystem.

## Glossary
__Schema Metadata__: Top level information about a credential schema. An example for an email credential schema is provided below.

```json
{
  "type": "https://credentials.workday.com/docs/credential-schema.json",
  "modelVersion": "1.0",
  "id": "did:work:MDP8AsFhHzhwUvGNuYkX7T;id=06e126d1-fa44-4882-a243-1e326fbe21db;version=1.0",
  "name": "Email",
  "author": "did:work:MDP8AsFhHzhwUvGNuYkX7T",
  "authored": "2018-01-01T00:00:00+00:00"
}
```

__Credential Schema__: The data template for a credential. An example of an email credential schema is provided below.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "Email",
  "type": "object",
  "properties": {
    "emailAddress": {
      "type": "string",
      "format": "email"
    }
  },
  "required": ["emailAddress"],
  "additionalProperties": false
}
```

## References
- [Verifiable Credential Specification](https://w3c.github.io/vc-data-model/)
- [DID Specification](https://w3c-ccg.github.io/did-core)
- [JSON Schema](https://json-schema.org/)
- [JSON-LD](https://json-ld.org/)
- [RFC-3339](https://tools.ietf.org/html/rfc3339)
- [Hyperledger Indy Schemas](https://github.com/sovrin-foundation/protocol/blob/master/themis/schema.md)
