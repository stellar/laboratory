const map = {
  name: "map",
  description: "",
  properties: {
    map: {
      type: "array",
      items: {
        type: "array",
        items: [
          {
            type: "U32",
            description: "",
          },
          {
            type: "Bool",
          },
        ],
        minItems: 2,
        maxItems: 2,
      },
    },
  },
  required: ["map"],
  additionalProperties: false,
  type: "object",
};

const tuple = {
  name: "tuple",
  description: "",
  properties: {
    tuple: {
      type: "array",
      items: [
        {
          type: "ScSymbol",
          description: "ScSymbol is a string",
        },
        {
          type: "U32",
          description: "",
        },
      ],
      minItems: 2,
      maxItems: 2,
    },
  },
  required: ["tuple"],
  additionalProperties: false,
  type: "object",
};

const vec = {
  name: "vec",
  description: "",
  properties: {
    vec: {
      type: "array",
      items: {
        type: "U32",
        description: "",
      },
    },
  },
  required: ["vec"],
  additionalProperties: false,
  type: "object",
};

const tuple_strukt = {
  name: "tuple_strukt",
  description: "",
  properties: {
    tuple_strukt: {
      type: "array",
      items: [
        {
          description: "This is from the rust doc above the struct Test",
          properties: {
            a: {
              type: "U32",
              description: "",
            },
            b: {
              type: "Bool",
            },
            c: {
              type: "ScSymbol",
              description: "ScSymbol is a string",
            },
            additionalProperties: false,
          },
          required: ["a", "b", "c"],
          type: "object",
        },
        {
          oneOf: [
            {
              type: "object",
              title: "First",
              properties: {
                tag: "First",
              },
              additionalProperties: false,
              required: ["tag"],
            },
            {
              type: "object",
              title: "Second",
              properties: {
                tag: "Second",
              },
              additionalProperties: false,
              required: ["tag"],
            },
            {
              type: "object",
              title: "Third",
              properties: {
                tag: "Third",
              },
              additionalProperties: false,
              required: ["tag"],
            },
          ],
        },
      ],
      minItems: 2,
      maxItems: 2,
    },
  },
  required: ["tuple_strukt"],
  additionalProperties: false,
  type: "object",
};

const strukt_hel = {
  name: "strukt_hel",
  description: "Example contract method which takes a struct",
  properties: {
    strukt: {
      description: "This is from the rust doc above the struct Test",
      properties: {
        a: {
          type: "U32",
          description: "",
        },
        b: {
          type: "Bool",
        },
        c: {
          type: "ScSymbol",
          description: "ScSymbol is a string",
        },
        additionalProperties: false,
      },
      required: ["a", "b", "c"],
      type: "object",
    },
  },
  required: ["strukt"],
  additionalProperties: false,
  type: "object",
};
