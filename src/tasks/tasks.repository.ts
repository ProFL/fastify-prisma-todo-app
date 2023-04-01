import { PrismaClient } from "@prisma/client";
import { inject, singleton } from "tsyringe";
import { AppPrismaClient } from "../db";
import ResourceNotFoundError from "../errors/resourceNotFound.error";
import { Task } from "./interfaces/Task";
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
      tasks: tasks as Task[],
      paginationMeta: {
        pageNumber,
        pageSize,
        pageCount: Math.ceil(taskCount / pageSize),
      },
    };
  }

  async getTaskById(id: number): Promise<Task> {
    const task = (await this.client.task.findUnique({
      where: {
        id,
      },
    })) as Task;
    if (!task) {
      throw new ResourceNotFoundError(`Task with id ${id} not found`);
    }
    return task;
  }

  async createTask({ title }: CreateTaskInput): Promise<CreateTaskOutput> {
    return this.client.task.create({
      data: {
        title,
      },
    }) as Promise<Task>;
  }

  async updateTask(
    id: number,
    data: Pick<Task, "title" | "status">
  ): Promise<Task> {
    await this.getTaskById(id);
    return this.client.task.update({
      where: {
        id,
      },
      data,
    }) as Promise<Task>;
  }

  async deleteTask(id: number): Promise<void> {
    await this.client.task.deleteMany({
      where: {
        id,
      },
    });
  }
}
