import { Node as ProseMirrorNode } from "prosemirror-model";
import { Schema, DOMParser as ProseMirrorDOMParser } from "prosemirror-model";

// Define your schema or import it from Tiptap's StarterKit
const schema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: {
      content: "inline*",
      toDOM: () => ["p", 0],
      parseDOM: [{ tag: "p" }],
    },
    text: { inline: true, toDOM: () => ["text", 0] },
    // add other nodes as needed
  },
  marks: {
    // add marks as needed
  },
});

// Convert HTML to ProseMirror JSON
export const htmlToProseMirrorJSON = (html: string, schema: any) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const node = ProseMirrorDOMParser.fromSchema(schema).parse(doc.body);
  return node.toJSON();
};

// Convert ProseMirror JSON to HTML
export const proseMirrorJSONToHTML = (json: any) => {
  const node = ProseMirrorNode.fromJSON(schema, json);
  return node.textContent;
};
