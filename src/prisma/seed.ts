import { db } from "./db.ts";
import bcrypt from "bcrypt";

async function main() {
  // Явно передаём строку подключения, чтобы Prisma 8 знала, куда стучаться
  await db.connect({
    url: "postgresql://postgres:prisma@localhost:5433/shop_db",
  });

  const hashedPassword = await bcrypt.hash("123", 10);

  const user = await db.orm.public.User.create({
    email: "test2@example.com", 
    password: hashedPassword,
    name: "Пётр",
  });


  console.log("УСПЕХ! Пользователь создан:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Закрываем соединение, чтобы скрипт завершился
    await db.close();
  });
