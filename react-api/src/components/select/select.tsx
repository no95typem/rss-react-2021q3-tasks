import * as React from 'react';

export interface SelectOption {
  value: string;
  text: string;
}

export interface SelectProps {
  value?: string;
  options: SelectOption[];
  ariaLabel: string;
  onChange?: (newValue: string) => unknown;
}

export const SELECT_DEFAULT_VAL = 'SELECT_DEFAULT_VAL';

export const Select: React.FC<SelectProps> = React.memo(
  (props: SelectProps) => {
    return (
      <select
        className="form-select"
        aria-label={props.ariaLabel}
        onChange={e => props.onChange?.(e.target.value)}
        value={props.value || SELECT_DEFAULT_VAL}
        data-id={Date.now()}
        role="listbox"
      >
        {props.options.map(o => {
          return (
            <option value={o.value} key={o.value}>
              {o.text}
            </option>
          );
        })}
        {props.value === undefined ? (
          <option value={SELECT_DEFAULT_VAL}>Select</option>
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
