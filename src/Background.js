import React, { useState } from 'react';
import classNames from 'classnames';
import set from 'lodash/set';
import times from 'lodash/times';

import config from './config/config';

import './Background.css';

let currentImage = 0;
let canvas, ctx, noiseCtx;

const NUM_NOISE_FRAMES = 5;
const BPM = 160;

function noise(ctx) {

  const w = ctx.canvas.width,
        h = ctx.canvas.height,
        iData = ctx.createImageData(w, h),
        buffer32 = new Uint32Array(iData.data.buffer),
        len = buffer32.length
    let i = 0

    for (; i < len;i++) {
      if (Math.random() < 0.5) {
        buffer32[i] = 0xFF000000;
      }
    }

    ctx.putImageData(iData, 0, 0);
}

function Background(props) {
  const { background } = config;
  const { vertical, color, image, directory, css, bpm, numImages } = background;

  const bgStyles = {};
  const bgContainerStyles = {};

  const INTERVAL = Math.round(1000 / ((BPM * 4) / 60));

  if (css) {
    bgStyles.background = css;
  } else {
    set(bgStyles, 'backgroundColor', color, undefined);
  }

  if (config.noise) {
      if (props.playing) {
        canvas = document.getElementById('noiseCanvas');
        ctx = canvas.getContext('2d');
        noiseCtx =
        setInterval(() => {
          ctx.clearRect(0, 0, 1920, 1080);
          noise(ctx);
          currentImage = (currentImage + 1) % NUM_NOISE_FRAMES;
        }, INTERVAL);
      }
  }

  const bgClasses = classNames({
    bg: true,
    'bg-vertical': vertical,
  });



  return (
    <div className="bg-container" id="bg" style={bgContainerStyles}>
      <div className={bgClasses} style={bgStyles} />
      <canvas id="noiseCanvas" className={config.invert ? 'invert' : ''} width="1920" height="1080"></canvas>
    </div>
  );
}

export default Background;
