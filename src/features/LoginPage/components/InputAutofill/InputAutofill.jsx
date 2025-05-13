import { useState } from 'react';
import { Input } from '@ozen-ui/kit/Input';
import { useControlled } from '@ozen-ui/kit/useControlled';
import s from './InputAutofill.module.css';

export const InputAutofill = () => {
  const [filled, setFilled] = useState(false);
  const [focus, setFocus] = useState(false);

  const [value, setValue] = useControlled({
    defaultValue: '',
    name: 'InputAutofill',
  });

  const shrink = filled || focus || !!value || value === 0;

  const handleChange = (e) => {
    setValue(e.currentTarget.value);
  };

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const handleAnimationStart = (e) => {
    setFilled(e.animationName.includes('autofill-start'));
  };

  return (
      <Input
          value={value || ''}
          onChange={handleChange}
          labelProps={{ shrink }}
          inputProps={{
            className: s.input,
            onBlur: handleBlur,
            onFocus: handleFocus,
            onAnimationStart: handleAnimationStart,
          }}
      />
  );
};
