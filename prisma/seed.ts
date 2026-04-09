import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client"
import { faker } from '@faker-js/faker';
import { create } from "node:domain";


const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.categories.deleteMany();
    await prisma.products.deleteMany();

    const categories = await prisma.categories.createMany({
        data: [
            {
                name: faker.commerce.department(),
                slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
                description: faker.commerce.productDescription(),
                // products: {
                //     create: [
                //         {
                //             title: faker.commerce.productName(),
                //             slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
                //             summary: faker.commerce.productDescription(),
                //             description: faker.commerce.productDescription(),
                //             price: parseFloat(faker.commerce.price()),
                //             stock: faker.number.int({ min: 0, max: 100 }),
                //             is_active: faker.datatype.boolean(),
                //             image: faker.image.url(),
                //         }
                //     ]
                // }
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