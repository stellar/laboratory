import {connect} from 'react-redux';
import React from 'react';
import url from 'url';
import {updateLocation} from '../actions/routing';

export const routerMiddleware = store => next => action => {
  return next(action);
}

class RouterHashListener extends React.Component {
    componentWillMount() {
    window.addEventListener('hashchange', this.hashChangeHandler.bind(this), false);
  }
  componentWillUnmount() {
    // Just doing our duty of cleanup though it's really not necessary
    window.removeEventListener('hashchange', this.hashChangeHandler.bind(this), false);
  }
  hashChangeHandler(e) {
    let oldUrlHash = url.parse(e.oldURL).hash || '';
    let newUrlHash = url.parse(e.newURL).hash || '';

    // The "real" url is inside the hash;
    let oldUrl = url.parse(oldUrlHash.substr(1));
    let newUrl = url.parse(newUrlHash.substr(1));

    if (oldUrl.pathname !== newUrl.pathname) {
      this.props.dispatch(updateLocation(newUrl.pathname));
    }
  }
  render() {
    return null;
  }
}

export let RouterListener = connect(chooseState, dispatch => ({ dispatch }))((RouterHashListener));
function chooseState(state) {
  return {
    routing: state.routing
  };
}
