import { Context } from '../../context';
import { User } from '../../orm/user';

export class UserResolver {
  static async create(
    name: string,
    age: number,
    nationality?: string,
    book?: string,
    dateOfBirth?: string
  ) {
    const user = User.create({ name, age, nationality, book, dateOfBirth });
    await User.save(user);
    return user;
  }

  static async readAll() {
    const user = await User.find();
    return user;
  }

  static async read(id: number, { response }: Context) {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      response.status(404);
      throw new Error(`No user found with id ${id}`);
    }

    return user;
  }

  static async delete(id: number) {
    const res = await User.delete(id);

    if (res.affected == 0) throw new Error('Not deleted');

    return res;
  }

  static async update(
    id: number,
    name: string,
    age: number,
    nationality: string,
    book: string,
    dateOfBirth?: string
  ) {
    console.log(dateOfBirth);
    User.update(id, { age, name, nationality, book, dateOfBirth });
  }

  static async readUserBook(id: number) {
    return new Promise<string>((resolve) => {
      let s = '';
      while (s.length < 10000000) {
        s +=
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et turpis non sem dapibus faucibus at sed est. Donec ullamcorper, sem non tempus scelerisque, est enim efficitur dui, ac elementum mauris neque et nulla. Duis suscipit iaculis lacus, eget bibendum tellus dictum sit amet. Morbi odio quam, aliquam ac nunc sit amet, sollicitudin malesuada mi. Donec in vehicula neque. Donec sodales risus luctus est venenatis, ut tincidunt ante pharetra. Donec tristique condimentum diam. Praesent vestibulum posuere mattis. Sed rutrum eros dolor, vitae efficitur nisi dictum in. Donec aliquam varius arcu ut lobortis. Suspendisse ut libero elit. Sed ornare velit mauris. Etiam et augue convallis dui ornare blandit non nec libero. Phasellus varius efficitur placerat. Nunc porta dolor eu dolor tincidunt, a convallis orci ornare.';
      }
      resolve(s);
    });
  }
}
