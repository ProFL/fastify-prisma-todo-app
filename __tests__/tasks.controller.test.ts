import "reflect-metadata";

import { PrismaClient } from "@prisma/client";
import { FastifyInstance, RawServerDefault } from "fastify";
import request from "supertest";
import { container } from "tsyringe";
import App from "../src/app";
import { getTestDbPrismaClient } from "./setup";

describe("/tasks", () => {
  let app: FastifyInstance;
  let server: RawServerDefault;
  let client: PrismaClient;

  beforeAll(async () => {
    container.register(PrismaClient, { useValue: getTestDbPrismaClient() });
    app = container.resolve(App).build();
    client = container.resolve(PrismaClient);

    await app.ready();

    server = app.server;
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /", () => {
    it("should return paginated tasks", async () => {
      await client.task.createMany({
        data: [
          { title: "Task 1" },
          { title: "Task 2" },
          { title: "Task 3" },
          { title: "Task 4" },
        ],
      });

      const res = await request(server).get("/tasks?page[size]=2");

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].attributes.title).toBe("Task 4");
      expect(res.body.data[1].attributes.title).toBe("Task 3");
    });
  });

  describe("GET /:taskId", () => {
    it("should return the task with the given id", async () => {
      const task = await client.task.create({
        data: { title: "Task 1" },
      });

      const res = await request(server).get(`/tasks/${task.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(task.id.toString());
      expect(res.body.data.attributes.title).toBe(task.title);
    });
  });

  describe("POST /", () => {
    it("should create a new post", async () => {
      const payload = {
        data: {
          type: "tasks",
          attributes: {
            title: "Testing is very important",
          },
        },
      };

      const res = await request(server).post("/tasks").send(payload);

      expect(res.status).toBe(201);
      expect(res.body.data.type).toBe(payload.data.type);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.attributes.title).toBe(
        payload.data.attributes.title
      );
    });
  });
});
