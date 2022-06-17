import { File } from '../orm/file';

export class FileResolver {
  static async create(name: string, file: string) {
    console.log(file);
    const f = File.create({ name, file });
    await File.save(f);
    return f;
  }

  static async readAll() {
    return 'FILE';
  }
}
