import * as React from 'react';

export const SpinnerBorder: React.FC = () => {
  return (
    <div className="spinner-border text-light" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};
