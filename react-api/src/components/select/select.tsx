import * as React from 'react';

export interface SelectOption {
  value: string;
  text: string;
}

export interface SelectProps {
  value?: string;
  options: SelectOption[];
  'aria-label': string;
  onChange?: (newValue: string) => unknown;
}

export const Select: React.FC<SelectProps> = (props: SelectProps) => {
  return (
    <select
      className="form-select"
      aria-label={props['aria-label']}
      onChange={e => props.onChange?.(e.target.value)}
      value={props.value}
    >
      {props.options.map(o => {
        return (
          <option value={o.value} key={o.value}>
            {o.text}
          </option>
        );
      })}
      {props.value === undefined ? <option selected>Select</option> : undefined}
    </select>
  );
};
