import { PrismaClient } from "@prisma/client";
import { inject, singleton } from "tsyringe";
import { AppPrismaClient } from "../db";
import {
  CreateTaskInput,
  CreateTaskOutput,
} from "./interfaces/createTask.interfaces";
import {
  ListTasksInput,
  ListTasksOutput,
} from "./interfaces/listTasks.interfaces";

@singleton()
export default class TaskRespository {
  constructor(@inject(PrismaClient) private readonly client: AppPrismaClient) {}

  async listTasks({
    pageNumber = 1,
    pageSize = 10,
  }: ListTasksInput): Promise<ListTasksOutput> {
    const [taskCount, tasks] = await Promise.all([
      this.client.task.count(),
      this.client.task.findMany({
        orderBy: { updatedAt: "desc" },
        skip: (pageNumber - 1) * pageSize || 0,
        take: pageSize || 10,
      }),
    ]);

    return {
      tasks,
      paginationMeta: {
        pageNumber,
        pageSize,
        pageCount: Math.ceil(taskCount / pageSize),
      },
    };
  }

  async createTask({ title }: CreateTaskInput): Promise<CreateTaskOutput> {
    return this.client.task.create({
      data: {
        title,
      },
    });
  }
}
