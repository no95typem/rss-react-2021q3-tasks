import * as React from 'react';

export interface TagSelectOption {
  value: string;
  text: string;
}

export interface TagSelectProps {
  value: string[];
  options: TagSelectOption[];
  'aria-label': string;
  onChange?: (newValue: string[]) => unknown;
}

export const TagSelect: React.FC<TagSelectProps> = (props: TagSelectProps) => {
  return (
    <div className="btn-group" role="group" aria-label={props['aria-label']}>
      {props.options.map(option => {
        const id = `${props['aria-label']}_${option.value}`;
        const checked = props.value.includes(option.value);
        return (
          <React.Fragment key={option.value}>
            <input
              type="checkbox"
              className="btn-check"
              id={id}
              autoComplete="off"
              checked={checked}
              onChange={() =>
                checked
                  ? props.onChange?.(
                      props.value.filter(v => v !== option.value),
                    )
                  : props.onChange?.([...props.value, option.value])
              }
            ></input>
            <label className="btn btn-outline-primary" htmlFor={id}>
              {option.text}
            </label>
          </React.Fragment>
        );
      })}
    </div>
  );
};
