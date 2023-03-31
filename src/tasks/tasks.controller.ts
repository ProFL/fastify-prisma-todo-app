import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { inject, singleton } from "tsyringe";
import buildPaginationLinks from "../helpers/buildPaginationLinks";
import extractBaseUrlFromRequest from "../helpers/extractBaseUrlFromRequest";
import { Controller, JSONApiPaginationQuery } from "../helpers/interfaces";
import TaskRespository from "./tasks.repository";

@singleton()
export default class TasksController implements Controller {
  constructor(
    @inject(TaskRespository) private readonly taskRepository: TaskRespository
  ) {}

  buildFastifyPlugin(prefix: string = "/"): FastifyPluginAsync {
    return async (fastify: FastifyInstance, options: unknown) => {
      const taskSchema = {
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

      fastify.get(
        `${prefix}`,
        {
          schema: {
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
                      ...taskSchema,
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
        },
        this.listTasksHandler.bind(this)
      );

      fastify.post(
        prefix,
        {
          schema: {
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
                  data: taskSchema,
                },
              },
            },
          },
        },
        this.createTaskHandler.bind(this)
      );
    };
  }

  async listTasksHandler(request: FastifyRequest, reply: FastifyReply) {
    let { "page[size]": pageSize, "page[number]": pageNumber } =
      request.query as JSONApiPaginationQuery;

    const { tasks, paginationMeta } = await this.taskRepository.listTasks({
      pageNumber,
      pageSize,
    });

    const baseUrl = extractBaseUrlFromRequest(request);

    return {
      links: buildPaginationLinks(baseUrl, request.url, paginationMeta),
      data: tasks.map(({ id, ...attributes }) => ({
        id: id,
        type: "tasks",
        attributes,
        links: {
          self: `${baseUrl}${request.routerPath}/${id}`,
        },
      })),
    };
  }

  async createTaskHandler(request: FastifyRequest, reply: FastifyReply) {
    const { data } = request.body as {
      data: { attributes: { title: string } };
    };

    const { id, ...attributes } = await this.taskRepository.createTask({
      title: data.attributes.title,
    });

    reply.code(201);
    const baseUrl = extractBaseUrlFromRequest(request);
    return {
      data: {
        id,
        type: "tasks",
        attributes: attributes,
        links: {
          self: `${baseUrl}${request.routerPath}/${id}`,
        },
      },
    };
  }
}
