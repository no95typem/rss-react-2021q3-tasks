import * as React from 'react';
import {
  BrowserRouter,
  NavLink,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { About } from '../about/about';
import { NotFoundPage } from '../404/404';
import { DetailsPageReduxed } from '../details/details';

import styles from './app.scss';
import { SpinnerBorder } from '../spinner-border/spinner-border';

const GalleryReduxed = React.lazy(() => import('../gallery/gallery'));

const CSS_TRANSITION_CLASSNAMES = {
  enter: styles.route_enter,
  enterActive: styles['route_enter-active'],
  exit: styles.route_exit,
  exitActive: styles['route_exit-active'],
};

const Routes: React.FC = () => {
  const location = useLocation();

  return (
    <SwitchTransition>
      <CSSTransition
        key={location.pathname}
        addEndListener={(node, done) =>
          node.addEventListener('transitionend', done, false)
        }
        classNames={CSS_TRANSITION_CLASSNAMES}
      >
        <Switch location={location}>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact strict path="/">
            <GalleryReduxed />
          </Route>
          <Route path="/details/:id">
            <DetailsPageReduxed />
          </Route>
          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>
      </CSSTransition>
    </SwitchTransition>
  );
};

export const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <React.Suspense
        fallback={
          <div>
            <SpinnerBorder />
          </div>
        }
      >
        <header className="container-fluid">
          <nav>
            <ul className="nav nav-pills">
              <li className="nav-item">
                <NavLink exact strict className="nav-link" to="/">
                  Search
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact className="nav-link" to="/about">
                  About
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <Routes />
      </React.Suspense>
    </div>
  );
};
