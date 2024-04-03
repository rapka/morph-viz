import React from 'react';
import PropTypes from 'prop-types';
import config from './config/config';

import './TextOverlay.css';

const TextOverlay = (props) => {
  const defaultTextColor = config.invert ? '#000000' : '#FFFFFF';
  const defaultShadowColor = config.invert ? '#FFFFFF' : '#000000';
  const artistColor = config.artistTextColor || defaultTextColor;
  const artistShadowColor = config.artistTextShadowColor || defaultShadowColor;
  const titleColor = config.titleTextColor || defaultTextColor;
  const titleShadowColor = config.titleTextShadowColor || defaultShadowColor;


  const ART_SIZE = 858;
  const minsText = config.album || "34 MINUTES OF";
  const mixText = config.mix || "INSTRUMENTAL MIX";
  const mixText1 = mixText.slice(0, Math.ceil(mixText.length / 2));
  const mixText2 = mixText.slice(Math.ceil(mixText.length / 2));

  const LETTER_WIDTH = 51.3;
  const LETTER_HEIGHT = 70;
  const titleSpacing = ((ART_SIZE + 6) - LETTER_WIDTH * props.title.length) / (props.title.length - 1);
  const minSpacing = ((ART_SIZE + 14) - LETTER_WIDTH * minsText.length) / (minsText.length - 1);
  const mix1Spacing = ((ART_SIZE + 14) - LETTER_HEIGHT * mixText1.length) / (mixText1.length - 1);
  const mix2Spacing = ((ART_SIZE + 14) - LETTER_HEIGHT * mixText2.length) / (mixText2.length - 1);

  let instrumentalText;

  if (config.invert) {
    instrumentalText = (
      <div className="instrumental-text-container">
        <div className="intrume" style={{letterSpacing: mix1Spacing}}>{mixText1}</div>
        <br />
        <div className="ntalmix" style={{letterSpacing: mix2Spacing}}>{mixText2}</div>
      </div>
    );
  }

  return (
    <div className="text-container" id="text-overlay" style={{ color: artistColor }}>
      <div className="artist artist1 mins" id="artist" style={{ letterSpacing: minSpacing }}>
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
