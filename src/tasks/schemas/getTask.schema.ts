import TASK_SCHEMA from "./task.schema";

export default {
  params: {
    type: "object",
    properties: {
      taskId: { type: "number" },
    },
    required: ["taskId"],
  },
  response: {
    200: {
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
