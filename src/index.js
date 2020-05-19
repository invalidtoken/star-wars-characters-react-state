import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';
import endpoint from './endpoint';
import dummyData from './dummy-data';

import './styles.scss';

const useFetch = (url) => {
  console.log(2);
  const [loading, setLoading] = useState('true');
  const [error, setError] = useState(null);
  const [data, setData] = useState(undefined);

  const setToLoading = () => {
    setLoading(true);
    setError(null);
    setData(undefined);
  };

  const setToError = (error) => {
    setLoading(false);
    setError(error);
    setData(undefined);
  };

  const setToData = (data) => {
    setLoading(false);
    setError(data);
    setData(undefined);
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

  return { loading, error, data };
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
