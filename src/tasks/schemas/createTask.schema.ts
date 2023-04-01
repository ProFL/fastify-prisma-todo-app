import TASK_SCHEMA from "./task.schema";


export default {
  body: {
    type: "object",
    properties: {
      data: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["tasks"] },
          attributes: {
            type: "object",
            properties: {
              title: { type: "string" },
            },
            required: ["title"],
          },
        },
        required: ["type", "attributes"],
      },
    },
    required: ["data"],
  },
  response: {
    201: {
      type: "object",
      properties: {
        links: {
          type: "object",
          properties: {
            self: { type: "string" },
          },
        },
        data: TASK_SCHEMA,
      },
    },
  },
};
