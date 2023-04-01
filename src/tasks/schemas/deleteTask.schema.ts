export default {
  params: {
    type: "object",
    properties: {
      taskId: { type: "number" },
    },
    required: ["taskId"],
  },
  response: {
    204: { type: "null" },
  },
};
