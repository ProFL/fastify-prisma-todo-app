import { FastifyPluginAsync, FastifySchema, RouteOptions } from "fastify";

export type JSONApiPaginationQuery = {
  "page[size]"?: number;
  "page[number]"?: number;
};

export type PaginationInput = {
  pageNumber?: number;
  pageSize?: number;
};

export type PaginationMeta = Required<PaginationInput> & { pageCount: number };

export type FastifyResources = {
  schemas: FastifySchema[];
  routes: RouteOptions[];
};

export interface Controller {
  buildFastifyPlugin(prefix?: string): FastifyPluginAsync;
}
