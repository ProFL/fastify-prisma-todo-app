import { Task } from "./Task";

export type CreateTaskInput = Pick<Task, "title">;
export type CreateTaskOutput = Task;
