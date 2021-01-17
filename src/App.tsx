import { Component, h } from 'preact';
import { Route, Router } from 'preact-router';
import styles from './App.module.scss';
import AddEditBuilding from './app/add-edit-building/AddEditBuilding';
import Home from './app/home/Home';
import Footer from './app/layout/footer/Footer';
import Header from './app/layout/header/Header';
import Login from './app/login/Login';
import MyBuildings from './app/my-buildings/MyBuildings';
import NotFound from './app/not-found/NotFound';
import View from './app/view/View';

export interface IAppProps {

}

export interface IAppState {

}

export default class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps, state: IAppState) {
    super(props, state);
  }

  render() {
    return <div className={styles.wrapper}>
      <Header></Header>
      <div className={styles.content}>
        <Router>
          <Route component={Home} path="/"></Route>
          <Route component={Login} path="/login"></Route>

          <Route component={MyBuildings} path="/my-buildings"></Route>
          <Route component={AddEditBuilding} path="/edit-building/:id"></Route>
          <Route component={AddEditBuilding} path="/add-building"></Route>
          <Route component={View} path="/view/:id"></Route>

          <Route default component={NotFound}></Route>
        </Router>
      </div>
      <Footer></Footer>
    </div>;
  }
}