import { FastifyRequest } from "fastify";

export default function extractBaseUrlFromRequest({
  protocol,
  headers,
}: FastifyRequest): string {
  return `${protocol}://${headers.host}`;
}
