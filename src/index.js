import React, { useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import isFunction from 'lodash/isFunction';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';
import endpoint from './endpoint.js';

import './styles.scss';

const reducer = (state, action) => {
  if (action.type === 'LOADING') {
    return {
      characters: [],
      loading: true,
      error: null,
    };
  }

  if (action.type === 'RESPONSE_COMPLETE') {
    return {
      characters: action.payload.characters,
      loading: false,
      error: null,
    };
  }

  if (action.type === 'ERROR') {
    return {
      characters: [],
      loading: false,
      error: action.payload.error,
    };
  }

  return state;
};

const fetchCharacters = (dispatch) => {
  console.log(5);
  dispatch({ type: 'LOADING' });
  fetch(endpoint + '/characters')
    .then((response) => response.json())
    .then((response) =>
      dispatch({
        type: 'RESPONSE_COMPLETE',
        payload: { characters: response.characters },
      }),
    )
    .catch((error) => dispatch({ type: 'ERROR', payload: { error } }));
};

const initialState = {
  error: null,
  loading: false,
  characters: [],
};

const useThunkReducer = (reducer, initialState) => {
  console.log(3);
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch = React.useCallback(
    (action) => {
      console.log(4);
      // console.log(action);

      if (isFunction(action)) {
        action(dispatch);
      } else {
        dispatch(action);
      }
    },
    [dispatch],
  );

  return [state, enhancedDispatch];
};

const Application = () => {
  console.log(1);
  const [state, dispatch] = useThunkReducer(reducer, initialState);
  console.log(2);
  const { loading, error, characters } = state;

  console.log(loading, error, characters);

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          <button onClick={() => dispatch(fetchCharacters)}>
            Fetch Characters
          </button>
          <CharacterList characters={characters} />
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
