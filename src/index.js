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

  const setToLoading = () => {
    dispatch({ type: 'LOADING' });
  };

  const setToError = (error) => {
    dispatch({ type: 'RESPONSE_COMPLETE', payload: { error } });
  };

  const setToData = (data) => {
    dispatch({ type: 'RESPONSE_COMPLETE', payload: { data } });
  };

  useEffect(() => {
    console.log(3);
    setToLoading();

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
          setToData(data);
        }
      })
      .catch((error) => {
        setToError(error);
      });
  }, [url]);

  return values;
};

const Application = () => {
  console.log(1);
  let { loading, error, data } = useFetch(endpoint + '/characters');
  console.log(4);

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
