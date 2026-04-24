import { faker } from '@faker-js/faker';
import { prisma } from './lib/prisma.ts';
import bcrypt from 'bcryptjs';

async function createCategories() {
    let name = faker.commerce.department()
    const data ={
        name: name,
        slug: faker.helpers.slugify(name).toLowerCase(),
        description: faker.commerce.productDescription(),
    }

    const categories = await prisma.categories.create({
        data: data
    })

    return categories;
}

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

async function createUsers(email: string = '', role: string = 'CUSTOMER') {
    const hashedPassword = await bcrypt.hash('password', 12);
    
    const user = await prisma.users.create({
        data: {
            email: email || faker.internet.email(),
            password: hashedPassword,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            role: role,
            phone: faker.phone.number(),
        }
    });

    return user;
}

async function runSeed() {
    await prisma.categories.deleteMany();
    await prisma.products.deleteMany();
    await prisma.users.deleteMany();

    for(let i = 0; i < 10; i++) {
        const categories = await createCategories();
        console.log(categories)
    }

    const categories = await prisma.categories.findMany();
    const categoriesIds = categories.map((category) => category.id);

    for(let i = 0; i < 10; i++) {
        const products = await createProducts(categoriesIds);
        console.log(products)
    }

    await createUsers('user@customer.com', 'CUSTOMER');
    await createUsers('user@admin.com', 'ADMIN');

}

export default runSeed;
