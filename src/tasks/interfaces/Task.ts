import { Task as DBTask } from "@prisma/client";

export type Task = DBTask & {
  status: "TO_DO" | "DOING" | "DONE";
};
