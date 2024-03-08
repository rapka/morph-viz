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
    this.state = { videoIndex: 0 };
    this.player = React.createRef();
    this.video0 = React.createRef();
    this.video1 = React.createRef();
    this.video2 = React.createRef();
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.videoSrc = `${this.state.videoIndex}.mp4`;
  }

  componentDidUpdate(prevProps) {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    if (!prevProps.playing && this.props.playing) {
      this.audioCtx.resume().then(() => {
        this.player.current.play();
      });
    }

    if (!prevProps.videoPlaying && this.props.videoPlaying) {
      this.video0.current.play();
      // this.video1.current.play();
      // this.video2.current.play();
    }
  }

  componentDidMount() {
    // setInterval(() => {
    //   // const newIndex = (this.state.videoIndex + 1) % 2;
    //   // this.setState({ videoIndex: newIndex });
    //   // this.videoSrc = `${newIndex}.mp4`;
    // }, 375 * 4);

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    const audioElement = this.player.current;
    let audioCtx = this.audioCtx;

    var analyser = audioCtx.createAnalyser();

    const canvas = document.getElementById('canvas');
    const canvasCtx = canvas.getContext('2d');
    const videoCtx0 = document.getElementById('video0');
    const videoCtx1 = document.getElementById('video1');
    const videoCtx2 = document.getElementById('video2');

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

      let bassValue = (bassArray[0] + bassArray[1] + bassArray[2] + bassArray[3] + bassArray[4]) / 5;
      bassValue = Math.max(0, 10 * (Math.exp(bassValue * 0.02) - 2));
      const bassNormalized = Math.min(bassValue / 1500, 1) / 2;

      // let highValue = sum(bassArray.slice(768)) / 256;
      let highValue = sum(bassArray.slice(768));
      highValue = Math.max(0, 10 * (Math.exp(highValue * 0.02) - 2));
      let midValue = sum(bassArray.slice(128)) / 896;
      // let midValue = sum(bassArray.slice(128));
      // midValue = Math.max(0, 10 * (Math.exp(midValue * 0.02) - 2));

      window.bassNormalized = bassNormalized;
      videoCtx0.style.transform = `scale(${1 + bassValue * 0.0004})`;
      videoCtx1.style.transform = `scale(${1 + bassValue * 0.0004})`;
      videoCtx2.style.transform = `scale(${1 + bassValue * 0.0004})`;
      // bgElem.style.filter = `blur(${bassValue * 0.004}px)`;
      // overlayElem.style.filter = `blur(${bassValue * 0.002}px)`;
      // overlayElem.style.transform = `translateY(${midValue * .15}px)`;

      let greyscale = Math.max(50 - midValue * 4, 0);
      // let filterString = `grayscale(${greyscale}%)`;
      let blurValue = bassValue * bassValue * 0.00001 * 0.25;
      // blurValue = Math.min(bassValue, 5);
      blurValue = bassValue / 256;
      let filterString = `blur(${blurValue}px)`;
      videoCtx0.style.filter = filterString;
      videoCtx1.style.filter = filterString;
      videoCtx2.style.filter = filterString;
      // console.log('greyscale', greyscale, midValue, highValue);
      // videoCtx.style.filter = `grayscale(${Math.max(70 - bassValue * 0.15, 0)}%)`;
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
        <video
          src="output6.mp4"
          ref={this.video0}
          id="video0"
          loop={true}
          muted={true}
          style={{ zIndex: this.state.videoIndex === 1 ? 100 : 100}}
        />
        <video
          src="1.mp4"
          ref={this.video1}
          id="video1"
          loop={true}
          muted={true}
          style={{ zIndex: this.state.videoIndex === 1 ? 100 : 2}}
        />
        <video
          src="2.mp4"
          ref={this.video2}
          id="video2"
          loop={true}
          muted={true}
          style={{ zIndex: this.state.videoIndex === 2 ? 100 : 3}}
        />
        <canvas id="canvas"></canvas>
        <audio
          ref={this.player}
          src={this.props.audioSrc}
          type="audio/mpeg"
          preload="auto"
        />
        <div id="cover-container"></div>
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
