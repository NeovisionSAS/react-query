import form from '../../../../scss/form.module.scss';
import { CRUDObject } from '../../CRUD';
import { FormBase, FormUpdateOptions } from '../../CRUDAuto';
import { FunctionComponent, PropsWithChildren } from 'react';

interface DeleteFormBase extends FormBase<FormUpdateOptions<any>> {
  className?: string;
}

interface DeleteFormParams extends DeleteFormBase {
  handleDelete: CRUDObject<any>['handleDelete'];
  data: any;
  pkName: string;
  value: any;
}

type DeleteFormProps = DeleteFormBase & PropsWithChildren;

export const getDeleteForm = ({
  data,
  handleDelete,
  className: classNameParam,
  pkName,
  value,
  ...params
}: DeleteFormParams): FunctionComponent<DeleteFormProps> => {
  return ({ className: classNameProp, children, ...props }) => {
    const { attributes, options = {} } = Object.merge(params, props);
    const { deletable = <button type="submit">Delete</button> } = options;

    return (
      <form
        {...attributes}
        className={`${form.silent} ${attributes?.className}`}
        onSubmit={(e) => {
          attributes?.onSubmit?.(e);
          handleDelete?.(e, { name: pkName });
        }}
      >
        <input
          id={pkName}
          name={pkName}
          defaultValue={value}
          style={{ display: 'none' }}
        />
        <>
          {children ||
            ((typeof deletable != 'boolean' || deletable) && deletable)}
        </>
      </form>
    );
  };
};
