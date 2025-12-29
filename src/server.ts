import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    prisma.$connect();

    console.log("server is connected");

    app.listen(PORT, () => {
      console.log("Server is running on:", PORT);
    });
  } catch (error) {
    console.error("Error connectiing to the database:", error);
    prisma.$disconnect();
    process.exit(1);
  }
}

main();
