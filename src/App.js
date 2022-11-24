import React, { useState, useCallback, useEffect } from 'react';
import set from 'lodash/set';

import Cover from './Cover';
import Scope from './Scope';
import TextOverlay from './TextOverlay';
import Background from './Background';

import config from './config';

import './App.css';

function App() {
  const [playing, setPlaying] = useState(false);

  const playFunction = useCallback((event) => {
    if(event.keyCode === 32) {
      event.preventDefault();
      setPlaying(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", playFunction, false);

    return () => {
      document.removeEventListener("keydown", playFunction, false);
    };
  }, [playFunction]);

  const { artist, title, art, scopes, album } = config;

  return (
    <div className="App">
      <div id="blurOverlay" />
      <Scope playing={playing} audioSrc={config.track} {...scopes} />
      <Background playing={playing} />
      <Cover
        playing={playing}
        backwards={art.backwards}
        rotationDuration={art.rotationDuration}
        coverUrl={art.file}
      />
      <TextOverlay
        artist={artist}
        title={title}
        album={album}
      />
    </div>
  );
}

export default App;
