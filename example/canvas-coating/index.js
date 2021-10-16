import Coating from './lib/coating.js';

const content = document.querySelector('#content');
const canvas = document.querySelector('#canvas');
canvas.width = 400;
canvas.height = 300;

const coating = new Coating(canvas, {
  onFirstTouchStart() {
    content.classList.add('content-has-data');
    getData().then((data) => {
      content.innerHTML = `<span>${data}</span>`;
    }).catch(console.log);
  }
});

coating.render();


function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('谢谢参与！');
    }, 800);
  })
}


