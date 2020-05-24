import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';
import endpoint from './endpoint';
import dummyData from './dummy-data';

import './styles.scss';

const initialState = {
  loading: true,
  error: null,
  data: undefined,
};

const Reducer = (state, action) => {
  console.log(3);
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        error: null,
        data: undefined,
      };

    case 'RESPONSE_COMPLETE':
      return {
        loading: false,
        error: null,
        data: action.payload.data,
      };
    case 'ERROR':
      return {
        loading: false,
        error: action.payload.error,
        data: undefined,
      };
  }
  return state;
};

const useFetch = (url) => {
  console.log(2);
  const [values, dispatch] = useReducer(Reducer, initialState);
  console.log(4);

  useEffect(() => {
    console.log(5.1);
    dispatch({ type: 'LOADING' });

    fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then((data) => {
        if (data && data.characters) {
          console.log(5.2);
          dispatch({ type: 'RESPONSE_COMPLETE', payload: { data } });
        }
      })
      .catch((error) => {
        dispatch({ type: 'ERROR', payload: { error } });
      });
    console.log(5.3);
  }, [url]);
  return values;
};

const Application = () => {
  console.log(1);
  let { loading, error, data } = useFetch(endpoint + '/characters');
  console.log(6);

  console.log(loading, error, data);

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          <CharacterList characters={[]} />
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
