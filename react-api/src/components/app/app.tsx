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
import { LOADERS_CONTEXT, SECRET_CONTEXT } from './contexts';
import { ThreejsTestPage } from '../threejs-test/details';
import { ImgFetcher } from '../../services/img-fetcher/img-fetcher';

const gallery = <Gallery />;

const WALLHAVEN_WINDOW = 60000;
const WALLHAVEN_REQ_PER_WINDOW = 700; // ! in fact 45 req per min for API, for images I don't know...

const { loadImg } = new ImgFetcher(WALLHAVEN_REQ_PER_WINDOW, WALLHAVEN_WINDOW);

const Routes: React.FC = () => {
  const location = useLocation();
  const about = <About />;
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
            {about}
          </Route>
          <Route exact strict path="/">
            {gallery}
          </Route>
          <Route path="/details/:id">
            <DetailsPage />
          </Route>
          <Route path="/three">
            <ThreejsTestPage />
          </Route>
          <Route path="*" render={() => <NotFoundPage />}></Route>
        </Switch>
      </CSSTransition>
    </SwitchTransition>
  );
};

export const App: React.FC = () => {
  const [apiKey, setApiKey] = React.useState<string | undefined>(undefined);

  return (
    <SECRET_CONTEXT.Provider value={{ apiKey, updateApiKey: setApiKey }}>
      <LOADERS_CONTEXT.Provider value={{ loadImg }}>
        <div className={styles.app}>
          <BrowserRouter>
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
          </BrowserRouter>
        </div>
      </LOADERS_CONTEXT.Provider>
    </SECRET_CONTEXT.Provider>
  );
};
