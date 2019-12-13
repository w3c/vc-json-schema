var Validator = require("jsonschema").Validator;
var v = new Validator();

const vcSchema = require("./unsigned.schema.json");
const vcInstanceUnsigned = require("./unsigned.vc.json");

describe("vc-json-schema", () => {
  it("ensure unigned credential matches vc-json-schema", async () => {
    v.validate(vcInstanceUnsigned.credentialSubject, vcSchema.schema, {
      throwError: true
    });
  });
});
