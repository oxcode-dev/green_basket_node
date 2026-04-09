import range from "lodash/range";
import { faker } from "@faker-js/faker";
import Seeder from "./seeder.ts";


class UserSeed extends Seeder {
    constructor(count: number = 10) {
        super(count);
        this.count = count;
        this.createData();
    }

    createData() {
        range(this.count).forEach(() => {
            this._data.push({
                name: faker.person.firstName(),
                slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
                description: faker.commerce.productDescription(),
            });
        });
    }
}

export default UserSeed;