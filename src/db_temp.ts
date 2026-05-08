import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { destroyAllCategories, fetchCategories, storeCategory } from './services/categoryServices.ts';
import { destroyAllProducts, storeProduct } from './services/productServices.ts';
import { destroyAllUsers, storeUser } from './services/usersServices.ts';

async function createCategories() {
    let name = faker.commerce.department()

    return await storeCategory(name, faker.commerce.productDescription());
}

async function createProducts(categories: string[]) {
    let title = faker.commerce.productName();

    return await storeProduct({
        title: title,
        slug: faker.helpers.slugify(title).toLowerCase(),
        summary: faker.commerce.productDescription(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int({ min: 0, max: 100 }),
        is_active: faker.datatype.boolean(),
        image: faker.image.url(),
        category_id: faker.helpers.arrayElement(categories),
    })
}

async function createUsers(email: string = '', role: 'ADMIN' | 'CUSTOMER' = 'CUSTOMER') {
    const hashedPassword = await bcrypt.hash('password', 12);
    
    const user = storeUser({
        email: email || faker.internet.email(),
        password: hashedPassword,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        role: role,
        phone: faker.phone.number(),
    });

    return user;
}

async function runSeed() {
    await destroyAllCategories();
    await destroyAllProducts();
    await destroyAllUsers();

    for(let i = 0; i < 10; i++) {
        const categories = await createCategories();
        // console.log(categories)
    }

    const categories = await fetchCategories();
    const categoriesIds = categories.map((category) => category.id);

    for(let i = 0; i < 10; i++) {
        const products = await createProducts(categoriesIds);
        // console.log(products)
    }

    await createUsers('user@customer.com', 'CUSTOMER');
    await createUsers('user@admin.com', 'ADMIN');

}

export default runSeed;
