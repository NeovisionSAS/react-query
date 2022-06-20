import { File } from '../orm/file';
import { Context } from '../context';

export class FileResolver {
  static async create(name: string, file: string, { response }: Context) {
    const exists = await File.findOne({ where: { name } });
    if (exists) {
      response.status(409);
      throw new Error(`Entry with name ${name} already exists`);
    }

    const f = File.create({ name, file });
    await File.save(f).catch((e) => console.error(e));
    return f;
  }

  static async readAll() {
    return 'FILE';
  }
}
