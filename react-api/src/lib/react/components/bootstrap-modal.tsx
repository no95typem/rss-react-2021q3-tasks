import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface BootstrapModalProps {
  id: string;
  ariaLabel: string;
  onClose: () => unknown;
  title: string;
  body: string;
  btnText: string;
  onOk: () => unknown;
}

export const BootstrapModal: React.FC<BootstrapModalProps> = (
  props: BootstrapModalProps,
) => {
  const target = document.body;
  const anchor = document.createElement('div');

  React.useEffect(() => {
    target.append(anchor);
    return () => anchor.remove();
  }, []);

  return ReactDOM.createPortal(
    <div
      className="modal fade show"
      id={props.id}
      tabIndex={-1}
      aria-labelledby={props.ariaLabel}
      style={{ display: 'block' }}
      // onClick={() => props.onClose()}
      onClick={() => props.onClose()}
      // aria-hidden="true"
    >
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{props.title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => props.onClose()}
            ></button>
          </div>
          <div className="modal-body">{props.body}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => props.onClose()}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => props.onOk()}
            >
              {props.btnText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    anchor,
  );
};

export const showBootstrapModal = (elem: JSX.Element) => {
  ReactDOM.createPortal(elem, document.body);
};
