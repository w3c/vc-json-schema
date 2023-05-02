/* globals omitTerms, respecConfig, $, require */
/* exported linkCrossReferences, restrictReferences, fixIncludes */

var vcwg = {
  // Add as the respecConfig localBiblio variable
  // Extend or override global respec references
  localBiblio: {
    "RFC 3339": {
      title: "Date and Time on the Internet: Timestamps",
      date: "2002",
      href: "https://www.rfc-editor.org/rfc/rfc3339",
      authors: [
        "G. Klyne",
        "Clearswift Corporation",
        "C. Newman",
        "Sun Microsystems"
      ],
      publisher: "Internet Engineering Task Force (IETF)"
    },
    "VC-DATA-MODEL": {
      href: "https://www.w3.org/TR/vc-data-model/",
      title: "Verifiable Credentials Data Model 1.0",
      publisher: "W3C"
    },
    "JSON-SCHEMA": {
      href: "https://json-schema.org/draft/2020-12/json-schema-core.html",
      title: "JSON Schema: A Media Type for Describing JSON Documents",
      publisher: "IETF"
    },
    "JSON-SCHEMA-VALIDATION": {
      href: "https://json-schema.org/draft/2020-12/json-schema-validation.html",
      title: "JSON Schema Validation: A Vocabulary for Structural Validation of JSON",
      publisher: "IETF"
    },
    "DID-CORE": {
      href: "https://w3c.github.io/did-core/",
      title: "Decentralized Identifiers (DIDs) v1.0",
      publisher: "W3C"
    },
    "JSON-LD": {
      href: "https://w3c.github.io/json-ld-syntax/",
      title: "JSON-LD 1.1: A JSON-based Serialization for Linked Data",
      publisher: "W3C"
    },
    "VC-JWT": {
      href: "https://www.w3.org/TR/vc-jwt/",
      title: "Securing Verifiable Credentials using JSON Web Tokens",
      publisher: "W3C"
    },
    "DATA-INTEGRITY": {
      href: "https://w3c-ccg.github.io/data-integrity-spec/",
      title: "Data Integrity. Manu Sporny; Dave Longley. Credentials Community Group. CG-DRAFT",
      publisher: "W3C"
    },
    "JOSE": {
      href: "https://jose.readthedocs.io/en/latest/",
      title: "Javascript Object Signing and Encryption (JOSE)",
      publisher: "IETF"
    },
    "JSON-SCHEMA-IMPLMENTATIONS": {
      href: "https://json-schema.org/implementations.html",
      title: "JSON Schema Implementations",
      publisher: "json-schema-org"
    },
    "RFC 2119": {
      href: "https://www.rfc-editor.org/rfc/rfc2119",
      title: "Key words for use in RFCs to Indicate Requirement Levels. S. Bradner. IETF. March 1997. Best Current Practice",
      publisher: "IETF"
    },
    "RFC 8174": {
      href: "https://www.rfc-editor.org/rfc/rfc8174",
      title: "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words. B. Leiba. IETF. May 2017. Best Current Practice",
      publisher: "IETF"
    }
  }
};

require(["core/pubsubhub"], (respecEvents) => {
  "use strict";

  console.log("RESPEC EVENTS", respecEvents);

  respecEvents.sub('end-all', (message) => {
    console.log("END EVENT", message);
    // remove data-cite on where the citation is to ourselves.
    const selfDfns = document.querySelectorAll("dfn[data-cite^='" + respecConfig.shortName.toUpperCase() + "#']");
    for (const dfn of selfDfns) {
      delete dfn.dataset.cite;
    }

    // Update data-cite references to ourselves.
    const selfRefs = document.querySelectorAll("a[data-cite^='" + respecConfig.shortName.toUpperCase() + "#']");
    for (const anchor of selfRefs) {
      anchor.href= anchor.dataset.cite.replace(/^.*#/,"#");
      delete anchor.dataset.cite;
    }

  });

});

function _esc(s) {
  return s.replace(/&/g,'&amp;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/</g,'&lt;');
}

function reindent(text) {
  // TODO: use trimEnd when Edge supports it
  const lines = text.trimRight().split("\n");
  while (lines.length && !lines[0].trim()) {
    lines.shift();
  }
  const indents = lines.filter(s => s.trim()).map(s => s.search(/[^\s]/));
  const leastIndent = Math.min(...indents);
  return lines.map(s => s.slice(leastIndent)).join("\n");
}

function updateExample(doc, content) {
  // perform transformations to make it render and prettier
  return _esc(reindent(unComment(doc, content)));
}

function unComment(doc, content) {
  // perform transformations to make it render and prettier
  return content
    .replace(/<!--/, '')
    .replace(/-->/, '')
    .replace(/< !\s*-\s*-/g, '<!--')
    .replace(/-\s*- >/g, '-->')
    .replace(/-\s*-\s*&gt;/g, '--&gt;');
}