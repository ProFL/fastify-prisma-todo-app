import { PaginationInput, PaginationMeta } from "../../helpers/interfaces";
import { Task } from "./Task";

export type ListTasksInput = PaginationInput;

export type ListTasksOutput = {
  tasks: Task[];
  paginationMeta: PaginationMeta;
};
