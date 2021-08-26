import * as React from 'react';
import { genUniqId } from '../../lib/generators/generators';
import {
  DEFAULT_WH_PER_PAGE_VALUE,
  WHPerPageValues,
} from '../../../shared/wallheaven-types/pagination';
import { Select } from '../select/select';

export interface PaginationProps {
  disabled?: boolean;
  current?: number;
  total?: number;
  perPage?: number;
  onChange?: (newPage: number) => unknown;
  onPerPageChange?: (newPerPage: number) => unknown;
  maxBtns: number;
}

const createPaginatorItem = (
  val: string | number,
  active?: boolean,
  disabled?: boolean,
  changeHandler?: React.MouseEventHandler<HTMLLIElement>,
  key?: string,
): JSX.Element => {
  const classList = `page-item
    ${active ? 'active' : ''}
    ${disabled ? 'disabled' : ''}`;
  const onChange = disabled ? undefined : changeHandler;
  return (
    <li className={classList} onClick={onChange} key={key}>
      <a
        className="page-link"
        href="#"
        role={typeof val === 'number' ? 'radio' : 'button'}
      >
        {val}
      </a>
    </li>
  );
};

export const Pagination: React.FC<PaginationProps> = (
  props: PaginationProps,
) => {
  const [specPos, setSpecPos] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    setSpecPos(undefined);
  }, [props.current]);

  if (!props.current) return <></>;

  const pages = Math.ceil((props.total ?? 999999) / (props.perPage ?? 1));

  const pos = specPos || props.current;

  let itemsLeft = props.maxBtns;

  const atFirst = props.current === 1;
  const atLast = props.current === pages;

  const first = createPaginatorItem(1, atFirst, props.disabled, () =>
    props.onChange?.(1),
  );
  itemsLeft--;

  const last = createPaginatorItem(pages, atLast, props.disabled, () =>
    props.onChange?.(pages),
  );
  itemsLeft--;

  const current =
    !atFirst && !atLast
      ? createPaginatorItem(pos, pos === props.current, props.disabled, () =>
          props.onChange?.(pos),
        )
      : undefined;
  if (current) itemsLeft--;

  const leftExpand =
    pos - 1 > itemsLeft / 2
      ? createPaginatorItem('...', false, props.disabled, () =>
          setSpecPos(Math.round(pos / 2)),
        )
      : undefined;
  const rightExpand =
    pages - (pos + 1) > itemsLeft / 2
      ? createPaginatorItem('...', false, props.disabled, () =>
          setSpecPos(Math.round((pages - pos) / 2 + pos)),
        )
      : undefined;

  if (leftExpand) itemsLeft--;
  if (rightExpand) itemsLeft--;

  let leftNeighboursCount = 0;
  let rightNeighboursCount = 0;
  let leftBorderFound = false;
  let rightBorderFound = false;

  while ((!leftBorderFound || !rightBorderFound) && itemsLeft > 0) {
    if (pos + rightNeighboursCount + 1 < pages) {
      rightNeighboursCount++;
      itemsLeft--;
    } else leftBorderFound = true;
    if (!itemsLeft) break;
    if (pos - leftNeighboursCount - 1 > 1) {
      leftNeighboursCount++;
      itemsLeft--;
    } else rightBorderFound = true;
  }

  return (
    <nav
      aria-label="Page navigation"
      style={{
        display: 'grid',
        width: '100%',
        alignItems: 'center',
        gridTemplateColumns: '1fr auto 1fr',
      }}
    >
      <div></div>
      <ul className="pagination">
        {createPaginatorItem('<', false, props.disabled || atFirst, () =>
          props.onChange?.(
            props.current && props.current > 1 ? props.current - 1 : 1,
          ),
        )}
        {first}
        {leftExpand}
        {Array(leftNeighboursCount)
          .fill(null)
          .map((v, i) => {
            const p = pos - leftNeighboursCount + i;
            return createPaginatorItem(
              p,
              p === props.current,
              props.disabled,
              () => props.onChange?.(p),
              genUniqId(),
            );
          })}
        {current}
        {Array(rightNeighboursCount)
          .fill(null)
          .map((v, i) => {
            const p = pos + 1 + i;
            return createPaginatorItem(
              p,
              p === props.current,
              props.disabled,
              () => props.onChange?.(p),
              genUniqId(),
            );
          })}
        {rightExpand}
        {last}
        {createPaginatorItem('>', false, props.disabled || atLast, () =>
          props.onChange?.(
            props.current && props.current < pages ? props.current + 1 : pages,
          ),
        )}
      </ul>
      <div style={{ width: 'fit-content', justifySelf: 'end' }}>
        <Select
          value={`${props.perPage}` || DEFAULT_WH_PER_PAGE_VALUE}
          ariaLabel="Set items per page"
          options={Object.keys(WHPerPageValues).map(v => {
            return { value: v, text: v };
          })}
          onChange={v => props.onPerPageChange?.(Number.parseInt(v, 10))}
        />
      </div>
    </nav>
  );
};
