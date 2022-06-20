import { File as FileInterface } from '../../../../../interfaces/file';
import { useRequest } from '../../../../../module';
import { FormEvent, FunctionComponent, useState } from 'react';

export const File: FunctionComponent = () => {
  const [name, setName] = useState('');

  const request = useRequest();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', (e.target as any).name.value);
    formData.append('file', (e.target as any).file.files[0]);

    request<FileInterface>('file', {
      method: 'POST',
      data: formData,
    }).then((f) => {
      console.log('Sent file', f);
    });
  };

  return (
    <form onSubmit={handleSubmit} id="formmm">
      <div>
        <label htmlFor="name">Name* :</label>
        <input
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="file">File* :</label>
        <input name="file" id="file" type={'file'} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
