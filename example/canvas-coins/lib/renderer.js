const coinSize = 30;

class Renderer {
  constructor(canvas, params) {
    this._canvas = canvas;
    this._params = params;
    this._ctx = canvas.getContext('2d');
    this._coinList = this._createCoinList();
    this._timestamp = Date.now();
    this._imageMap = new Map();
  }

  start() {
    const { coinImageUrl } = this._params || {};
    return new Promise((resolve, reject) => {
      this._loadImage(coinImageUrl).then((img) => {
        this._imageMap.set(coinImageUrl, img);
        this._animate();
        resolve();
      }).catch(reject)
    })
  }

  _loadImage(src) {
    const img = new window.Image();
    return new Promise((resolve, reject) => {
      img.addEventListener('load', () => {
        resolve(img);
      });
      img.addEventListener('error', (err) => {
        reject(err)
      })
      img.src = src;
    })
  }

  _render() {
    const ctx = this._ctx;
    const canvas = this._canvas;
    // 清理画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 计算硬币位置
    this._calculateFallCoin();
    this._renderBg();
    this._coinList.forEach((item) => {
      this._renderCoin(item);
    });
  }

  _renderBg() {
    const ctx = this._ctx;
    const canvas = this._canvas;

    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#05375f'; 
    ctx.fill(); 
    ctx.closePath();
  }

  _renderCoin(data) {
    const ctx = this._ctx;
    const { coinImageUrl } = this._params || {};
    const img = this._imageMap.get(coinImageUrl);
    ctx.drawImage(img, data.left, data.top, data.width, data.height);
  }

  _calculateFallCoin() {
    const canvas = this._canvas;
    const height = canvas.height;
    const interval = Date.now() - this._timestamp;
    this._coinList.forEach((coin) => {
      coin.top += (interval * coin.speedY);
      if (coin.top > height) {
        coin.top = (0 - coinSize) * (1 + Math.random());
      }
    });
  }

  _createCoinList() {
    const canvas = this._canvas;
    const height = canvas.height;
    return [
      { left: 10, top: (0 - coinSize) * (1 + Math.random()) },
      { left: 60, top: (0 - coinSize) * (1 + Math.random()), },
      { left: 100, top: (0 - coinSize) * (1 + Math.random()), },
      { left: 120, top: (0 - coinSize) * (1 + Math.random()), },
      { left: 160, top: (0 - coinSize) * (1 + Math.random()), },
      { left: 300, top: (0 - coinSize) * (1 + Math.random()), },
    ].map((item) => {
      return {
        left: this._ratioPx(item.left),
        top: this._ratioPx(item.top),
        width: this._ratioPx(coinSize),
        height: this._ratioPx(coinSize),
        speedY: Math.max(Math.random(), 0.5) * (height / 1000), // 每毫秒的速度
      }
    })
  }

  _ratioPx(px) {
    return px * 2;
  }

  _animate() {
    const animate = () => {
      this._render();
      this._timestamp = Date.now();
      window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
  }
}


export default Renderer;