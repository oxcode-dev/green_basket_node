import { faker } from '@faker-js/faker';
import { prisma } from './lib/prisma.ts';
import { ca } from 'zod/locales';

async function createCategories() {
    let name = faker.commerce.department()
    const data ={
        name: name,
        slug: faker.helpers.slugify(name).toLowerCase(),
        description: faker.commerce.productDescription(),
    }

    // await prisma.categories.deleteMany();

    const categories = await prisma.categories.create({
        data: data
    })

    return categories;
}

// category_id String? @db.Uuid
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
async function createProducts(categories: string[]) {
    let title = faker.commerce.productName();

    const data = {
        title: title,
        slug: faker.helpers.slugify(title).toLowerCase(),
        summary: faker.commerce.productDescription(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int({ min: 0, max: 100 }),
        is_active: faker.datatype.boolean(),
        image: faker.image.url(),
        category_id: faker.helpers.arrayElement(categories),
    }

    const products = await prisma.products.create({
        data: data
    })

    return products;
}

async function runSeed() {
    // await prisma.categories.deleteMany();
    // for(let i = 0; i < 10; i++) {
    //     const categories = await createCategories();
    //     console.log(categories)
    // }

    // const categories = await prisma.categories.findMany();
    // const categoriesIds = categories.map((category) => category.id);

    // for(let i = 0; i < 10; i++) {
    //     const products = await createProducts(categoriesIds);
    //     console.log(products)
    // }

}

export default runSeed;
