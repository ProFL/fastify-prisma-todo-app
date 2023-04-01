export default {
  type: "object",
  properties: {
    type: { type: "string", enum: ["tasks"] },
    id: { type: "string" },
    attributes: {
      type: "object",
      properties: {
        title: { type: "string" },
        status: { type: "string", enum: ["TO_DO", "DOING", "DONE"] },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
      },
    },
  },
};
