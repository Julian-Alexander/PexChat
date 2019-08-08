import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './components/Auth/Login.component';
import Register from './components/Auth/Register.component';
import * as serviceWorker from './serviceWorker';
import firebase from './firebase';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers/index.reducer';
import Progress from './Progress.component';
import { setUser, clearUser } from './actions/index.action';
import reduxThunk from 'redux-thunk';

const middleware = [
    reduxThunk,
];

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push('/');
      } else {
        this.props.history.push('login');
        this.props.clearUser();
      }
    });
  }
  render() {
    return this.props.isLoading ? (
      <Progress />
    ) : (
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </Switch>
    );
  }
}

const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(
  connect(
    mapStateFromProps,
    { setUser, clearUser }
  )(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById('root')
);
serviceWorker.unregister();