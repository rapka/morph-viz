import React, { useState } from 'react';
import classNames from 'classnames';
import set from 'lodash/set';
import times from 'lodash/times';

import config from './config';

import './Background.css';

let currentImage = 0;
var canvas, ctx;

function Background(props) {
  // const [currentImage, setCurrentImage] = useState(0);
  const { background } = config;
  const { vertical, color, image, directory, css, bpm, numImages } = background;
  console.log('wwww', 1000 / (bpm / 60) );


  const bgStyles = {};
  const bgContainerStyles = {};

  let bgImageElems = [];
  let aImages = [];

  times(numImages, index => {
    const url = `/${directory}/${index + 1}.png`;
    bgImageElems.push(<img id={`image${index}`} src={url} />);
    var oImg = new Image();
    oImg.src = url;
    aImages.push(oImg);
  })

  if (css) {
    bgStyles.background = css;
  } else {
    set(bgStyles, 'backgroundColor', color, undefined);
    set(bgStyles, 'backgroundImage', `url('/${directory}/${currentImage}.png')`, '');
  }

  if (props.playing) {
    canvas = document.getElementById('slideshow');
    ctx = canvas.getContext('2d');
    setInterval(() => {
      ctx.drawImage(aImages[currentImage], 576,  (1920 - 1080) / 2, 3072, 1920, 0, 0, 1920, 1080);
      // console.log('imm', currentImage)
      // document.getElementById(`image${(currentImage + 1) % numImages}`).classList.add('visible');
      // document.getElementById(`image${(currentImage) % numImages}`).classList.remove('visible');
      currentImage = (currentImage + 1) % numImages;
      // setCurrentImage((currentImage + 1) % numImages);
    }, Math.round(250 / (bpm / 60)));
  }


  const bgClasses = classNames({
    bg: true,
    'bg-vertical': vertical
  })

  return (
    <div className="bg-container" id="bg" style={bgContainerStyles}>
      {/*<div className={bgClasses} style={bgStyles} />*/}
    <div className="slides">
      {bgImageElems}
    </div>
      <canvas id="slideshow" width="1920" height="1080"></canvas>
    </div>
  );
}

export default Background;
