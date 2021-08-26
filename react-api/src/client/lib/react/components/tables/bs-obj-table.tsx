import * as React from 'react';

export interface BsObjTableProps {
  obj: Record<string, unknown>;
  header: string;
}

export const BsObjTable: React.FC<BsObjTableProps> = (
  props: BsObjTableProps,
): JSX.Element => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th colSpan={9999}>{props.header}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(props.obj).map(entry => {
          const [key, val] = entry;

          if (typeof val === 'object' && val !== null) {
            const newProps: BsObjTableProps = {
              obj: val as Record<string, unknown>,
              header: key,
            };
            return (
              <tr key={key}>
                <td colSpan={9999}>{BsObjTable(newProps)}</td>
              </tr>
            );
          }
          return (
            <tr key={key}>
              <th scope="col">{key}</th>
              <th scope="col">{val as string}</th>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
