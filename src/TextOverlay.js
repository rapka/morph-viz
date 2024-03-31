import React from 'react';
import PropTypes from 'prop-types';
import config from './config/config';

import './TextOverlay.css';

const TextOverlay = (props) => {
  const artistColor = config.artistTextColor || '#FFFFFF';
  const artistShadowColor = config.artistTextShadowColor || '#000000';
  const titleColor = config.titleTextColor || '#FFFFFF';
  const titleShadowColor = config.titleTextShadowColor || '#000000';


  const ART_SIZE = 858;
  const minsText = config.album || "34 MINUTES OF";

  const LETTER_WIDTH = 51.3;
  const titleSpacing = ((ART_SIZE + 6) - LETTER_WIDTH * props.title.length) / (props.title.length - 1);
  const minSpacing = ((ART_SIZE + 14) - LETTER_WIDTH * minsText.length) / (minsText.length - 1);

  const styles = {
    color: artistColor,
    letterSpacing: minSpacing,
  };

  let instrumentalText;

  if (config.invert) {
    instrumentalText = (
      <div className="instrumental-text-container">
        <div className="intrume">INSTRUME</div>
        <br />
        <div className="ntalmix">NTAL MIX</div>
      </div>
    );
  }

  return (
    <div className="text-container" id="text-overlay" >
      <div className="artist artist1 mins" id="artist" style={styles}>
        {minsText}
      </div>
        <br />
        <div className="fury">FURY</div>
        <div className="title" style={{letterSpacing: titleSpacing}}>{props.title}</div>
        <br />
        {instrumentalText}
    </div>
  );
}

TextOverlay.propTypes = {
  artist: PropTypes.string,
  title: PropTypes.string,
  album: PropTypes.string,
};

TextOverlay.defaultProps = {
  artist: '',
  title: '',
  album: '',
}

export default TextOverlay;
