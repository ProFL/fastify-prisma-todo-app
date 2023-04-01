import { PrismaClient } from "@prisma/client";
import fastify, { FastifyInstance } from "fastify";
import { inject, singleton } from "tsyringe";
import { v4 as uuid } from "uuid";
import { AppPrismaClient } from "./db";
import JSONAPIError from "./errors/jsonApi.error";
import TasksController from "./tasks/tasks.controller";

@singleton()
export default class AppFactory {
  private readonly app: FastifyInstance;

  constructor(
    @inject(PrismaClient) private readonly dbClient: AppPrismaClient,
    @inject(TasksController) private readonly tasksController: TasksController
  ) {
    this.app = fastify({
      ignoreTrailingSlash: true,
      logger: true,
      genReqId: () => uuid(),
    });
  }

  private setupHooks() {
    let queryLogger = this.app.log;

    this.dbClient.$on("query", (e) => {
      queryLogger.debug(e);
    });

    this.app.addHook("onClose", async () => {
      await this.dbClient.$disconnect();
    });

    this.app.addHook("preHandler", async (request, _) => {
      queryLogger = request.log;
    });
  }

  private setupRoutes() {
    this.app.route({
      method: "GET",
      url: "/",
      async handler(request, reply) {
        return { hello: "world" };
      },
    });

    this.app.register(this.tasksController.buildFastifyPlugin("/tasks"));
  }

  build(): FastifyInstance {
    this.app.addHook("onClose", async () => {
      await this.dbClient.$disconnect();
    });

    this.setupHooks();
    this.setupRoutes();

    this.app.setErrorHandler((error, request, reply) => {
      if (error instanceof JSONAPIError) {
        reply.code(error.statusCode);
        reply.send(error.jsonError);
      } else {
        this.app.log.error(error);
        reply.code(500);
        reply.send({
          status: "Internal Server Error",
          title: "Something went wrong while processing your request",
        });
      }
    });

    return this.app;
  }
}
