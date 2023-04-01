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
import {
  CREATE_TASK_SCHEMA,
  GET_TASK_SCHEMA,
  LIST_TASKS_SCHEMA,
} from "./schemas";
import TaskRespository from "./tasks.repository";

@singleton()
export default class TasksController implements Controller {
  constructor(
    @inject(TaskRespository) private readonly taskRepository: TaskRespository
  ) {}

  buildFastifyPlugin(prefix: string = "/"): FastifyPluginAsync {
    return async (fastify: FastifyInstance, options: unknown) => {
      fastify.route({
        method: "GET",
        url: prefix,
        schema: LIST_TASKS_SCHEMA,
        handler: this.listTasksHandler.bind(this),
      });

      fastify.route({
        method: "POST",
        url: prefix,
        schema: CREATE_TASK_SCHEMA,
        handler: this.createTaskHandler.bind(this),
      });

      fastify.route({
        method: "GET",
        url: `${prefix}/:taskId`,
        schema: GET_TASK_SCHEMA,
        handler: this.getTaskHandler.bind(this),
      });
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
        type: "tasks",
        id: id,
        attributes,
        links: {
          self: `${baseUrl}${request.url}/${id}`,
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
          self: `${baseUrl}${request.url}/${id}`,
        },
      },
    };
  }

  async getTaskHandler(request: FastifyRequest, reply: FastifyReply) {
    const { taskId } = request.params as { taskId: number };

    const task = await this.taskRepository.getTaskById(taskId);

    if (!task) {
      reply.code(404);
      return;
    }

    const baseUrl = extractBaseUrlFromRequest(request);
    const { id, ...attributes } = task;
    return {
      links: {
        self: `${baseUrl}${request.url}`,
      },
      data: {
        id: id,
        type: "tasks",
        attributes: attributes,
      },
    };
  }
}
