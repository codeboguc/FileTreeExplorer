Invalid tree JSON fixtures for manual import / paste testing
===========================================================

Use Home: drag-drop, Browse, or paste. Expect red error text under the paste area.

  01-malformed-syntax.json     JSON.parse fails (unclosed braces)
  02-wrong-node-type.json      Zod: type must be folder|file
  03-file-missing-size.json    Zod: file requires non-negative size
  04-negative-file-size.json   Zod: size must be non-negative
  05-empty-trimmed-name.json   Zod: name must be non-empty after trim
  06-duplicate-sibling-names.json  App rule: duplicate names under same folder
  07-empty-array.json         Zod: array must have at least one node
  08-folder-children-not-array.json  Zod: children must be an array
  09-root-not-object.json      Zod: root must be object or array of nodes

Open from repo: public/import-test-invalid/
