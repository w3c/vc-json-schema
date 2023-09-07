## Verifiable Credential JSON Schema 2023

This specification provides a mechanism for the use of [JSON Schemas](https://json-schema.org/) with [Verifiable Credentials](https://w3c.github.io/vc-data-model/). A significant part of the integrity of a Verifiable Credential comes from the ability to structure its contents so that all three parties — issuer, holder, verifier — may have a consistent mechanism of trust in interpreting the data that they are provided with. We introducing a new data model for an object to facilitate backing Credentials with JSON Schemas that we call a Credential Schema.

https://w3c.github.io/vc-json-schema/

We encourage contributions meeting the [Contribution Guidelines](CONTRIBUTING.md).  While we prefer the creation of issues
and Pull Requests in the GitHub repository, discussions may also occur on the [public-credentials](http://lists.w3.org/Archives/Public/public-credentials/) mailing list.

### Test Suite

A [docker](https://www.docker.com/)-based test suite for the specification can [be found here](https://github.com/w3c/vc-json-schema-test-suite). All implementers are encouraged to add to the test suite.

### Building

To build, we use [`respec`](https://respec.org/).

After installing `respec`, you can build the spec locally using the following command:

```sh
respec --localhost index.html out.html --verbose -e
```

Next open up `out.html` in a web browser and review the document.

### Other useful links
* [Public group email archive](https://lists.w3.org/Archives/Public/public-credentials/)
* [VC Data Model](https://www.w3.org/TR/vc-data-model/)
* [JSON Schema](https://json-schema.org/)
* [Test Suite](https://github.com/w3c/vc-json-schema-test-suite)
