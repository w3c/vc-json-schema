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

// Removes dfns that aren't referenced anywhere in the spec.
// To ensure a definition appears in the Terminology section, use
//  and link to it!
// This is triggered by postProcess in the respec config.
function restrictRefs(config, document) {

  // Get set of ids internal dfns referenced in the spec body
  const internalDfnLinks = document.querySelectorAll("a.internalDFN");
  let internalDfnIds = new Set();
  for (const dfnLink of internalDfnLinks) {
    const dfnHref = dfnLink.href.split("#")[1];
    internalDfnIds.add(dfnHref);
  }

  // Remove unused dfns from the termlist
  const termlist = document.querySelector(".termlist");
  const linkIdsInDfns = [];
  for (const child of termlist.querySelectorAll("dfn")){
    if (!internalDfnIds.has(child.id)){
      let dt = child.closest("dt");
      let dd = dt.nextElementSibling;

      // Get internal links from dfns we're going to remove
      //  because these show up in the dfn-panels later and then
      //  trigger the local-refs-exist linter (see below)
      const linksInDfn = dd.querySelectorAll("a.internalDFN");
      for (link of linksInDfn) {
        linkIdsInDfns.push(link.id);
      }

      termlist.removeChild(dt);
      termlist.removeChild(dd);
    }
  }

  // Remove unused dfns from the dfn-panels
  //  (these are hidden, but still trigger the local-refs-exist linter)
  //  (this seems like a hack, there's probably a better way to hook into respec
  //   before it gets to this point)
  const dfnPanels = document.querySelectorAll(".dfn-panel");
  for (const panel of dfnPanels) {
    if (!internalDfnIds.has(panel.querySelector(".self-link").href.split("#")[1])) {
      panel.parentNode.removeChild(panel);
    }

    // Remove references to dfns we removed which link to other dfns
    const panelLinks = panel.querySelectorAll("li a");
    for (const link of panelLinks) {
      if (linkIdsInDfns.includes(link.href.split("#")[1])) {
        link.parentNode.removeChild(link);
      }
    }
  }
}

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