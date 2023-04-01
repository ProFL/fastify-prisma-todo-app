import { Task } from "./Task";

export type UpdateTaskInput = Pick<Task, "title" | "status">;
export type UpdateTaskOutput = Task;
