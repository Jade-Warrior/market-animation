export default class Coating {
  constructor(canvas, params) {
    this._canvas = canvas;
    this._params = params || {};
    this._ctx = canvas.getContext('2d');
    this._hasEmitTouchStart = false
    this._init();
  }

  render() {
    const canvas = this._canvas;
    const ctx = this._ctx;
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#a0a0a0'; 
    ctx.fill(); 
    ctx.closePath();
    ctx.globalCompositeOperation = 'destination-out';
  }

  _init() {
    const canvas = this._canvas;
    let isTouch = false;
    const rect = canvas.getBoundingClientRect();
    canvas.addEventListener('mousedown', () => {
      this._emitTouchStart();
      isTouch = true;
    }, true);
    canvas.addEventListener('mousemove', (e) => {
      if (!isTouch) return;
      e.preventDefault();
      const x = e.clientX - rect.x;
      const y = e.clientY - rect.y;
      this._clearMask(x, y);
    }, true);
    canvas.addEventListener('mouseup', () => {
      isTouch = false;
    }, true);


    canvas.addEventListener('touchstart', () => {
      this._emitTouchStart();
      isTouch = true;
    }, true);
    canvas.addEventListener('touchmove', (e) => {
      if (!isTouch) return;
      e.preventDefault();
      const x = e.touches[0].clientX - rect.x;
      const y = e.touches[0].clientY - rect.y;
      this._clearMask(x, y);
    }, true);
    canvas.addEventListener('touchend', () => {
      isTouch = false;
    }, true);
  }

  _emitTouchStart() {
    if (this._hasEmitTouchStart === true) {
      return;
    }
    this._hasEmitTouchStart = true;
    if (typeof this._params.onFirstTouchStart === 'function') {
      this._params.onFirstTouchStart();
    }
  }

  _clearMask(x, y) {
    const ctx = this._ctx;
    const size = 40;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI, true);
    ctx.fill(); 
    ctx.closePath();
  }

}