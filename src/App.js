import React, { useState, useCallback, useEffect } from 'react';
import set from 'lodash/set';

import VideoViz from './VideoViz';
import TextOverlay from './TextOverlay';
import Background from './Background';

import config from './config/config';

import './App.css';

function App() {
  const [playing, setPlaying] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const playFunction = useCallback((event) => {
    if(event.keyCode === 32) {
      event.preventDefault();
      setPlaying(true);

      if (config.delay && config.delay !== 0) {
        setTimeout(() => {
        setVideoPlaying(true);
        }, config.delay);
      } else {
        setVideoPlaying(true);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", playFunction, false);

    return () => {
      document.removeEventListener("keydown", playFunction, false);
    };
  }, [playFunction]);

  const { artist, title, art, album } = config;

  return (
    <div className={`App ${config.invert ? 'invert' : ''}`}>
      <VideoViz
        playing={playing}
        videoPlaying={videoPlaying}
        audioSrc={config.track}
      />
      <Background playing={playing} />
      <TextOverlay
        artist={artist}
        title={title}
        album={album}
      />
    </div>
  );
}

export default App;
