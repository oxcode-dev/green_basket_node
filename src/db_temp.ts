import { faker } from '@faker-js/faker';
import { prisma } from './lib/prisma.ts';

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

async function createProducts() {

}

async function runSeed() {
    // for(let i = 0; i < 10; i++) {
    //     const categories = await createCategories();
    //     console.log(categories)
    // }

    const categories = await prisma.categories.findMany();

    console.log(categories)
}

export default runSeed;
