import { File as FileInterface } from '../../../../../interfaces/file';
import { useRequest } from '../../../../utils/QueryOptionsProvider';
import { FormEvent, FunctionComponent, useState } from 'react';

export const File: FunctionComponent = () => {
  const [loading, setLoading] = useState<number>(0);

  const request = useRequest();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    request<FileInterface>('file', {
      method: 'POST',
      data: e,
      progress: ({ upload: { percentage } }) => {
        setLoading(percentage);
      },
    }).then((f) => {
      console.log('Sent file', f);
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} id="formmm">
        <div>
          <label htmlFor="file">File* :</label>
          <input name="file" id="file" type={'file'} multiple />
        </div>
        <button type="submit">Submit</button>
      </form>
      {loading != 0 && <div>Upload progress : {loading} / 100 %</div>}
    </>
  );
};
