import React from 'react';
import PropTypes from 'prop-types';
import hexRgb from 'hex-rgb';
import hsvToRgb from './util/hsvToRgb';
import times from 'lodash/times';
import sum from 'lodash/sum';

import './Scope.css';

let WIDTH = 1920 / 2;
let HEIGHT = 1080;
let H = 0;

class Scope extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.player = React.createRef();
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  componentDidUpdate(prevProps) {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    if (!prevProps.playing && this.props.playing) {
      this.audioCtx.resume().then(() => {
        this.player.current.play();
      });
    }
  }

  componentDidMount() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    const audioElement = this.player.current;
    let audioCtx = this.audioCtx;

    var analyser = audioCtx.createAnalyser();

    const canvas = document.getElementById('canvas');
    const canvasCtx = canvas.getContext('2d');
    const slideCtx = document.getElementById('slideshow').getContext('2d');

    let source = audioCtx.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 2048;
    analyser.minDecibels = -80;

    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    const bassArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    const artistElem = document.getElementById('artist');
    const albumElem = document.getElementById('album');
    const bgElem = document.getElementById('bg');
    const overlayElem = document.getElementById('text-overlay');
    const coverElem = document.getElementById('cover-container');

    const draw = () => {
      HEIGHT = window.innerHeight;
      WIDTH = window.innerWidth;

      canvasCtx.canvas.width = WIDTH;
      canvasCtx.canvas.height = HEIGHT;
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);
      analyser.getByteFrequencyData(bassArray);

      let bassValue = (bassArray[0] + bassArray[1] + bassArray[2] + bassArray[3]) / 4;
      bassValue = Math.max(0, 10 * (Math.exp(bassValue * 0.02) - 2));
      const bassNormalized = Math.min(bassValue / 1500, 1) / 2;

      let highValue = sum(bassArray.slice(768)) / 256;
      let midValue = sum(bassArray.slice(512)) / 512;

      window.bassNormalized = bassNormalized;
      // bgElem.style.transform = `scale(${1 + bassValue * 0.00005})`;
      // bgElem.style.filter = `blur(${bassValue * 0.004}px)`;
      // overlayElem.style.filter = `blur(${bassValue * 0.002}px)`;
      // overlayElem.style.transform = `translateY(${midValue * .15}px)`;

      coverElem.style.filter = `blur(${bassValue * 0.002}px)`;
      console.log('aaa', 100 - bassValue * 0.3);
      slideCtx.filter = `grayscale(${Math.max(100 - bassValue * 0.3, 0)}%)`;
      // slideCtx.filter = `blur(200px)`;

      canvasCtx.fillStyle = 'rgba(200, 200, 200, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = Math.max(bassValue / 100, 2);
    };

    draw();
  }

  render() {
    return (
      <div className="viz">
        <canvas id="canvas"></canvas>
        <audio
          ref={this.player}
          src={this.props.audioSrc}
          type="audio/mpeg"
          preload="auto"
        />
      </div>
    );
  }
}

Scope.propTypes = {
  rotationOffset: PropTypes.number, // hue offset between different scopes (in degrees)
  colors: PropTypes.arrayOf(PropTypes.string), // static color for each scope
  audioSrc: PropTypes.string.isRequired,
};

Scope.defaultProps = {
  rotationOffset: 0,
  colors: ['#FFFFFF', '#FFFFFF'],
}

export default Scope;
