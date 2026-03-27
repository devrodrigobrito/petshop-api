import { prisma } from "../../src/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

async function createUser({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: UserRole;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`User ${email} already exists`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      isActive: true,
    },
  });

  console.log(`User ${email} created`);
}

async function main() {
  await createUser({
    email: "admin@petshop.com",
    password: "admin123",
    role: UserRole.ADMIN,
  });

  await createUser({
    email: "employee@petshop.com",
    password: "employee123",
    role: UserRole.EMPLOYEE,
  });

  await createUser({
    email: "rodrigobr@petshop.com",
    password: "rodrigobr123",
    role: UserRole.ADMIN,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
