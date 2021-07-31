import * as React from 'react';
import { Star } from './subcomps/star/star';

export class StarSwitcher extends React.Component<{
  rootClassName: string;
  rating?: number;
  onChange: (e: React.ChangeEvent) => void;
}> {
  value?: number;

  render(): JSX.Element {
    return (
      <div className={this.props.rootClassName}>
        {Array(10)
          .fill(null)
          .map((i, index) => {
            const active =
              this.props.rating !== undefined && this.props.rating >= index + 1;
            return (
              <Star
                key={index + 1}
                active={active}
                onClick={() => this.handleStarSwitcherChange(index + 1)}
              />
            );
          })}
      </div>
    );
  }

  handleStarSwitcherChange = (i: number): void => {
    const e = {
      target: this,
    };
    e.target.value = this.props.rating === i ? undefined : i;
    this.props.onChange(e as unknown as React.ChangeEvent);
  };
}
