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

export const Select: React.FC<SelectProps> = React.memo(
  (props: SelectProps) => {
    return (
      <select
        className="form-select"
        aria-label={props['aria-label']}
        onChange={e => props.onChange?.(e.target.value)}
        value={props.value}
        data-id={Date.now()}
      >
        {props.options.map(o => {
          return (
            <option value={o.value} key={o.value}>
              {o.text}
            </option>
          );
        })}
        {props.value === undefined ? (
          <option selected>Select</option>
        ) : undefined}
      </select>
    );
  },
  (prev, next) => {
    const t = prev.value === next.value;
    return t;
  },
);

Select.displayName = `Memoizied Select`;
