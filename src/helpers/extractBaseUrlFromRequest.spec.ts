import { FastifyRequest } from "fastify";
import extractBaseUrlFromRequest from "./extractBaseUrlFromRequest";

describe("extractBaseUrlFromRequest", () => {
  it("should return the base url from the request", () => {
    const request = {
      protocol: "http",
      headers: {
        host: "localhost:3000",
      },
    };
    const baseUrl = extractBaseUrlFromRequest(
      request as unknown as FastifyRequest
    );
    expect(baseUrl).toBe("http://localhost:3000");
  });
});
