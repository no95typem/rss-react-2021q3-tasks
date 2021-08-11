import * as React from 'react';
import {
  BrowserRouter,
  NavLink,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import Gallery from '../gallery/gallery';
import { About } from '../about/about';
import { NotFoundPage } from '../404/404';

import styles from './app.scss';
import { DetailsPage } from '../details/details';

const Routes: React.FC = () => {
  const location = useLocation();
  console.log(location);
  return (
    <SwitchTransition>
      <CSSTransition
        key={location.pathname}
        //
        addEndListener={(node, done) =>
          node.addEventListener('transitionend', done, false)
        }
        classNames={{
          enter: styles.route_enter,
          enterActive: styles['route_enter-active'],
          exit: styles.route_exit,
          exitActive: styles['route_exit-active'],
        }}
      >
        <Switch location={location}>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact strict path="/">
            <Gallery />
          </Route>
          {/* <Route path="/details/:id"> */}
          <Route path="/details">
            <DetailsPage />
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
      <BrowserRouter>
        <nav>
          <ul>
            <NavLink to="/">Search</NavLink>
            <NavLink to="/about">About</NavLink>
          </ul>
        </nav>
        <Routes />
      </BrowserRouter>
    </div>
  );
};
