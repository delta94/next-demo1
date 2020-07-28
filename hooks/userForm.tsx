import React, {ReactChild, useCallback, useState} from 'react';
import {AxiosResponse} from 'axios';

interface Field<T> {
  label: string;
  key: keyof T;
  inputType: 'text' | 'textarea' | 'password';
}

interface UserFormOptions<T> {
  initFormData: T,
  fields: Field<T>[]; // keyof
  submitContent?: ReactChild;
  submit: (formData: T) => Promise<void>
}

const Errors: React.FC<{ errors: string[] }> = (props) => <div>{props.errors.join('，')}</div>;

export function userForm<T> (userFormOptions: UserFormOptions<T>) {
  const {initFormData, fields, submitContent, submit} = userFormOptions;
  const [formData, setFormData] = useState(initFormData);
  const [errors, setErrors] = useState(() => {
    const e: { [k in keyof T]?: string[] } = {};
    (Object.keys(initFormData) as [keyof T]).map((key) => (e[key] = []));
    return e;
  });
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    submit(formData).catch((err) => {
      const response: AxiosResponse = err.response
      if (response.status === 422) {
        setErrors(response.data);
      } else if (response.status === 401) {
        window.alert('请登录')
        window.location.href = `/sign_in?redirect=${encodeURIComponent(window.location.pathname)}`
      }
    });
  }, [formData]);
  const onChange = useCallback((e, type: keyof T) => {
    setFormData({...formData, [type]: e.target.value});
  }, [formData]);
  const form = (
    <form onSubmit={onSubmit}>
      {fields.map(field => (
        <div key={field.key.toString()}>
          <label>
            {field.label}：
            {field.inputType === 'textarea' ?
              <textarea value={formData[field.key].toString()} onChange={(e) => onChange(e, field.key)}/> :
              <input type={field.inputType} value={formData[field.key].toString()}
                     onChange={(e) => onChange(e, field.key)}/>
            }
          </label>
          <Errors errors={errors[field.key]}/>
        </div>
      ))}
      {submitContent || <input type="submit"/>}
    </form>
  );
  return {form};
}