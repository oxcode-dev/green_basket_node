abstract class Seeder {
  protected count: number; // decides how much data to generate
  protected _data: any = []; // seed data

  constructor(count: number) {
    this.count = count;
  }

  protected abstract createData(): void; // function to generate the data

  get data(): [] {
    return this._data;
  }
}

export default Seeder;