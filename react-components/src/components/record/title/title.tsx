import * as React from 'react';
import { Validable } from '../../../defs';

import styles from '../record.scss';

export interface DataRecordTitleProps {
  labelText: string;
  placeholderText: string;
  inputClassName?: string;
  val: string;
  onChange: (e: React.ChangeEvent) => void;
}

const TEXT_CONTENT_ENG = {
  MIN_LENGTH_ERROR: 'Input length should be more then',
};

// eslint-disable-next-line react/display-name
export const DataRecordTitle = React.forwardRef(
  (props: DataRecordTitleProps, ref: React.Ref<Validable>) => {
    const TEXT_CONTENT = TEXT_CONTENT_ENG;

    const input = React.useRef<HTMLInputElement>(null);

    const showValidationMessage = (text: string): void => {
      if (input.current) {
        input.current.setCustomValidity(text);
        input.current.reportValidity();
      }
    };

    const validate = (show: boolean): boolean => {
      if (!input.current) return false;
      const valid = input.current.value.length > 0;
      if (show) {
        if (valid) input.current.setCustomValidity('');
        else showValidationMessage(`${TEXT_CONTENT.MIN_LENGTH_ERROR} 0`);
      }

      return valid;
    };

    React.useImperativeHandle(ref, () => ({
      validate,
    }));

    return (
      <label className={styles.root__label}>
        {props.labelText}
        <input
          className={props.inputClassName}
          type="text"
          placeholder={props.placeholderText}
          value={props.val}
          onChange={e => {
            validate(true);
            props.onChange(e);
          }}
          ref={input}
        />
      </label>
    );
  },
);
