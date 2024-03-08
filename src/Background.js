import React, { useState } from 'react';
import classNames from 'classnames';
import set from 'lodash/set';
import times from 'lodash/times';

import config from './config';

import './Background.css';

let currentImage = 0;
let canvas, ctx, noiseCtx;

const NUM_NOISE_FRAMES = 6;
const BPM = 160;


function noise(ctx) {

  const w = ctx.canvas.width,
        h = ctx.canvas.height,
        iData = ctx.createImageData(w, h),
        buffer32 = new Uint32Array(iData.data.buffer),
        len = buffer32.length
    let i = 0

  for(; i < len;i++)

    if (Math.random() < 0.5) buffer32[i] = 0xFF000000;

    ctx.putImageData(iData, 0, 0);
}

function Background(props) {
  const { background } = config;
  const { vertical, color, image, directory, css, bpm, numImages } = background;

  const bgStyles = {};
  const bgContainerStyles = {};

  let bgImageElems = [];
  let noiseImageElems = [];
  let aImages = [];
  let noiseImages = [];

  // times(numImages, index => {
  //   const url = `/${directory}/${index + 1}.png`;
  //   bgImageElems.push(<img key={`slide${index}`} id={`image${index}`} src={url} />);
  //   var oImg = new Image();
  //   oImg.src = url;
  //   aImages.push(oImg);
  // })

  // times(NUM_NOISE_FRAMES, index => {
  //   const url = `/noise/noise${index}.png`;
  //   noiseImageElems.push(<img key={`noise${index}`} id={`noise${index}`} src={url} />);
  //   var oImg = new Image();
  //   oImg.src = url;
  //   noiseImages.push(oImg);
  // });

  const INTERVAL = Math.round(1000 / ((BPM * 4) / 60));

  if (css) {
    bgStyles.background = css;
  } else {
    set(bgStyles, 'backgroundColor', color, undefined);
    set(bgStyles, 'backgroundImage', `url('/${directory}/${currentImage}.png')`, '');
  }

  // setTimeout(() => {
  // // if (props.playing) {
  //   canvas = document.getElementById('slideshow');
  //   ctx = canvas.getContext('2d');
  //   noiseCtx =
  //   setInterval(() => {
  //     ctx.clearRect(0, 0, 1920, 1080);
  //     // ctx.drawImage(aImages[currentImage], 576, (1920 - 1080) / 2, 3072, 1920, 0, 0, 1920, 1080);
  //     // ctx.drawImage(noiseImages[currentImage], 0, 0, 1920, 1080, 0, 0, 1920, 1080);
  //     noise(ctx);
  //     // currentImage = (currentImage + 1) % NUM_NOISE_FRAMES;
  //     // console.log('rr', currentImage);
  //     // setCurrentImage((currentImage + 1) % numImages);
  //   }, INTERVAL);
  // // }
  // }, INTERVAL * 4);

  const bgClasses = classNames({
    bg: true,
    'bg-vertical': vertical,
  })

  return (
    <div className="bg-container" id="bg" style={bgContainerStyles}>
      {/*<div className={bgClasses} style={bgStyles} />*/}
{/*    <div className="slides">
      {bgImageElems}
    </div>*/}
    <div className="noise">
      {noiseImageElems}
    </div>
      <canvas id="slideshow" width="1920" height="1080"></canvas>
    </div>
  );
}

export default Background;
