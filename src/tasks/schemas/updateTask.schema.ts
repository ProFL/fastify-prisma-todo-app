import TASK_SCHEMA from "./task.schema";

export default {
  params: {
    type: "object",
    properties: {
      taskId: { type: "number" },
    },
    required: ["taskId"],
  },
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
              title: TASK_SCHEMA.properties.attributes.properties.title,
              status: TASK_SCHEMA.properties.attributes.properties.status,
            },
            required: ["title", "status"],
          },
        },
        required: ["attributes"],
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
