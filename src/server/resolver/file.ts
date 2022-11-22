import { UploadedFile } from 'express-fileupload';
import { Context } from '../context';
import { File } from '../orm/file';

export class FileResolver {
  static async create(file: UploadedFile, { response }: Context) {
    const { name } = file;
    const exists = await File.findOne({ where: { name } });
    if (exists) {
      response.status(409);
      throw new Error(`Entry with name ${file.name} already exists`);
    }

    const f = File.create({ name, file: JSON.stringify(file) });
    await File.save(f).catch((e) => console.error(e));

    return { received: file.data.length };
  }

  static async readAllNames() {
    const files = await File.find();

    return files.map((f) => {
      const parsed: UploadedFile = JSON.parse(f.file);
      const { name, size } = parsed;

      return {
        name,
        size,
      };
    });
  }
}
