import form from '../../../../scss/form.module.scss';
import { createFormObject, FormType } from '../../../../utils/form';
import { CRUDObject } from '../../CRUD';
import { FormBase, FormBaseOptions } from '../../CRUDAuto';
import { FunctionComponent, PropsWithChildren } from 'react';

interface UpdateFormBase extends FormBase<FormBaseOptions<any>> {
  className?: string;
  edit?: boolean;
}

interface UpdateFormParams extends UpdateFormBase {
  handleUpdate: CRUDObject<any>['handleDelete'];
  data: any;
  type: FormType<any>;
}

type UpdateFormProps = UpdateFormBase & PropsWithChildren;

export const getUpdateForm = ({
  data,
  handleUpdate,
  className: classNameParam,
  type,
  ...params
}: UpdateFormParams): FunctionComponent<UpdateFormProps> => {
  return ({ className: classNameProp, children, edit = true, ...props }) => {
    const { attributes, options = {} } = Object.merge(params, props);

    const { className } = options;

    return (
      <div className={`${classNameParam} ${classNameProp} ${className}`}>
        <form
          {...attributes}
          className={`${form.form} ${attributes?.className}`}
          onSubmit={(e) => {
            attributes?.onSubmit?.(e);
            handleUpdate(e);
          }}
        >
          <>
            {edit
              ? createFormObject(
                  type,
                  {
                    method: 'update',
                    formOptions: options,
                  },
                  [data]
                )
              : createFormObject(
                  type,
                  {
                    method: 'read',
                    formOptions: options,
                  },
                  [data]
                )}
            {children}
          </>
        </form>
      </div>
    );
  };
};
