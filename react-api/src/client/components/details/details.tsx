import * as React from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';

import { State } from '../../store/state';
import { fetchById } from '../../store/actions/details-page/fetchById';
import { resetDetailsPageState } from '../../store/actions/details-page/reset';

import {
  BsObjTable,
  BsObjTableProps,
} from '../../lib/react/components/tables/bs-obj-table';
import { SpinnerBorder } from '../spinner-border/spinner-border';
import { SpinnerGrowing } from '../spinner-growing/spinner-growing';

import styles from './details.scss';

export type DetailsPageProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export const DetailsPage: React.FC<DetailsPageProps> = (
  props: DetailsPageProps,
) => {
  const { flags, data } = props.detailsPageState;
  const params = useParams<{ id: string }>();
  const history = useHistory();

  React.useEffect(() => {
    props.fetchById(params.id);
    return () => {
      props.resetDetailsPageState();
    };
  }, [params.id]);

  let content: JSX.Element | undefined;

  if (flags.dataLoaded === undefined) content = <SpinnerBorder />;
  else if (flags.dataLoaded === false || flags.imgPreloaded === false)
    content = (
      <div className="alert alert-error" role="alert">
        Failed to load image
      </div>
    );
  else if (flags.imgPreloaded) content = <img src={data?.path} />;
  else content = <SpinnerGrowing />;

  const bsObjTableProps: BsObjTableProps = {
    obj: (data as unknown as Record<string, unknown>) || {},
    header: 'INFO',
  };

  return (
    <section className={styles.root}>
      <aside className={`${styles.root__aside} table-responsive table-sm`}>
        <BsObjTable {...bsObjTableProps} />
      </aside>
      <div className={styles.root__content}>
        {content}
        <button
          className={`${styles['root__btn-backward']} btn btn-secondary`}
          onClick={() => history.goBack()}
        >
          Back to search
        </button>
      </div>
    </section>
  );
};

const mapStateToProps = (store: State) => {
  return {
    detailsPageState: store.detailsPageState,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchById,
      resetDetailsPageState,
    },
    dispatch,
  );

export const DetailsPageReduxed = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailsPage);

export default DetailsPageReduxed;
