import React from 'react';
import PropTypes from 'prop-types';
import config from './config';

import './TextOverlay.css';

const TextOverlay = (props) => {
  const artistColor = config.artistTextColor || '#FFFFFF';
  const artistShadowColor = config.artistTextShadowColor || '#000000';
  const titleColor = config.titleTextColor || '#FFFFFF';
  const titleShadowColor = config.titleTextShadowColor || '#000000';

  return (
    <div className="text-container" id="text-overlay" >
      <div className="artist" id="artist" style={{
        color: artistColor,
        }}
      >
        {props.artist}
      </div>
      <div className="title" id="title" style={{
        color: titleColor,
      }}>
        {props.title}
      </div>
      <div className="album" id="album" style={{
        color: titleColor,
      }}>
        {props.album}
      </div>

    </div>
  );
}

TextOverlay.propTypes = {
  artist: PropTypes.string,
  title: PropTypes.string,
  album: PropTypes.string,
};

TextOverlay.defaultProps = {
  artist: 'Morphologist',
  title: '',
  album: '',
}

export default TextOverlay;
