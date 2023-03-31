import { Task } from "@prisma/client";
import { PaginationInput, PaginationMeta } from "../../helpers/interfaces";

export type ListTasksInput = PaginationInput;

export type ListTasksOutput = {
  tasks: Task[];
  paginationMeta: PaginationMeta;
};
