import { User } from '../orm/user';

export class UserResolver {
  static async create(name: string, age: number, nationality?: string) {
    const user = User.create({ name, age, nationality });
    await User.save(user);
    return user;
  }

  static async readAll() {
    const user = await User.find();
    return user;
  }

  static async read(id: number) {
    const user = await User.findOne({ where: { id } });

    if (!user) throw new Error(`No user found with id ${id}`);

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
    nationality: string
  ) {
    User.update(id, { age, name, nationality });
  }
}
