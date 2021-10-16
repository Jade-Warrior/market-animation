import Renderer from './lib/renderer.js';

const canvas = document.querySelector('#canvas');

const renderer = new Renderer(canvas, {
  coinImageUrl: './../images/coin.png'
});

renderer.start().then(() => {
  console.log('start!')
}).catch(console.log);