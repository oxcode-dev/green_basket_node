import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client"
import { faker } from '@faker-js/faker';


const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // const alice = await prisma.users.upsert({
    //     where: { email: "alice@prisma.io" },
    //     update: {},
    //     create: {
    //         email: "alice@prisma.io",
    //         first_name: "Alice",
    //         last_name: "Alice",
    //         // posts: {
    //         //     create: {
    //         //         title: "Check out Prisma with Next.js",
    //         //         content: "https://www.prisma.io/nextjs",
    //         //         published: true,
    //         //     },
    //         // },
    //     },
    // });

    // console.log({ alice });

//       category_id String? @db.Uuid
//   title String
//   slug String
//   summary String?
//   description String?
//   price Decimal @db.Decimal(10,2) @default(0.00)
//   stock Int @default(0)
//   is_active Boolean @default(true)
//   image String?
//   created_at DateTime @db.Timestamp(6) @default(now())
//   updated_at DateTime @db.Timestamp(6) @default(now())

// model categories {
//   id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   name String
//   slug String
//   description String?
//   created_at DateTime @db.Timestamp(6) @default(now())
//   updated_at DateTime @db.Timestamp(6) @default(now()) @updatedAt()

//   products products[]
// }

    const categories = await prisma.categories.createMany({
        data: [
            {
                name: faker.commerce.department(),
                slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
                description: faker.commerce.productDescription()
            },
            {
                name: faker.commerce.department(),
                slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
                description: faker.commerce.productDescription()
            },
            {
                name: faker.commerce.department(),
                slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
                description: faker.commerce.productDescription()
            },
            {
                name: faker.commerce.department(),
                slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
                description: faker.commerce.productDescription()
            },
            {
                name: faker.commerce.department(),
                slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
                description: faker.commerce.productDescription()
            },
        ]
    })
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });