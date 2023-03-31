import "reflect-metadata";

import { container } from "tsyringe";
import AppFactory from "./app";
import { registerPrismaClient } from "./db";

registerPrismaClient();
const app = container.resolve(AppFactory);

app
  .build()
  .listen({ host: "0.0.0.0", port: +(process.env.PORT || 3000) })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
