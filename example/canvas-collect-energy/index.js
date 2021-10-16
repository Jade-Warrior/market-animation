import Renderer from './lib/renderer.js';

const canvas = document.querySelector('#canvas');

const renderer = new Renderer(canvas);

renderer.start();