import TASK_SCHEMA from "./task.schema";


export default {
  querystring: {
    type: "object",
    properties: {
      "page[size]": { type: "number" },
      "page[number]": { type: "number" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        links: {
          type: "object",
          properties: {
            self: { type: "string" },
            first: { type: "string" },
            last: { type: "string" },
            prev: { type: "string" },
            next: { type: "string" },
          },
        },
        data: {
          type: "array",
          items: {
            ...TASK_SCHEMA,
            properties: {
              ...TASK_SCHEMA.properties,
              links: {
                type: "object",
                properties: {
                  self: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};
