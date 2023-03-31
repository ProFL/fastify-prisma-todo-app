import { Task } from "@prisma/client";

export type CreateTaskInput = {
  title: string;
};

export type CreateTaskOutput = Task;
