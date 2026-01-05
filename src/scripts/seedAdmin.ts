import { prisma } from "../lib/prisma";
import { userRole } from "../middleware/auth";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: "shawon the admin boss!!!!!!",
      email: "shawon3@admin.com",
      password: "admin1234",
      role: userRole.ADMIN,
      phone: "12233445",
    };

    const existAcc = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existAcc) {
      throw new Error("User already exists");
    }

    const signUpAdmin = await fetch(
      `http://localhost:5000/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );

    // console.log(signUpAdmin);

    if (signUpAdmin.ok) {
      await prisma.user.updateMany({
        where: { email: adminData.email },
        data: { emailVerified: true },
      });
    }
  } catch (err: any) {
    throw new Error(err.message || "failed to create admin user");
  }
};

seedAdmin();
