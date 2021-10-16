const ballSize = 60;

class Renderer {
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    // 小球的数据列表
    this._ballList = this._createBallList();
    this._timestamp = Date.now();
    this._mountain = {
      type: 'circle',
      top: canvas.height - this._ratioPx(80),
      left: canvas.width / 2 - this._ratioPx(200) / 2,
      width: this._ratioPx(200),
      height: this._ratioPx(200),
      fillStyle: '#1d6dad'
    };
    // 重点位置信息
    this._endPosition = {
      top: canvas.height,
      left: canvas.width / 2 - this._ratioPx(ballSize),
    }
    
    this._onEvent();
  }

  start() {
    this._animate();
  }

  _render() {
    const ctx = this._ctx;
    const canvas = this._canvas;
    // 每一帧清除画布，重新绘画
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    this._ballList.forEach((item) => {
      // 只绘制浮动小球
      this._renderBall(item);
    });
    this._renderCircle(this._mountain);
  }

  _renderBall(data) {
    if (data.status === 'collected') {
      return;
    }
    const ctx = this._ctx;
    const r = data.width / 2;
    // 画底色
    ctx.beginPath();
    ctx.arc(data.left + r, data.top + r + data.floatDistance, r, 0, 360, false);
    ctx.fillStyle = data.fillStyle; 
    ctx.fill();
    // 画边框
    ctx.strokeStyle = data.strokeStyle; 
    ctx.lineWidth = data.lineWidth
    ctx.stroke(); 
    ctx.closePath();

    // 画文案
    const fontSize = 54
    ctx.font = `${fontSize}px bold sans-serif`;
    ctx.textBaseline = 'top';
    const size = ctx.measureText(data.text);
    ctx.fillStyle = '#2196f399'
    ctx.fillText(
      data.text,
      data.left + (data.width - size.width) / 2,
      data.top + data.floatDistance + (data.height - fontSize) / 2,
    )
  }

  _renderCircle(data) {
    const ctx = this._ctx;
    const r = data.width / 2;
    ctx.beginPath();
    ctx.arc(data.left + r, data.top + r, r, 0, 360, false);
    ctx.fillStyle = data.fillStyle; 
    ctx.fill(); 
    ctx.closePath();
  }

  _createBallList() {
    return [
      { left: 10, top: 240, text: 100 },
      { left: 60, top: 160, text: 50 },
      { left: 120, top: 110, text: 5 },
      { left: 190, top: 170, text: 20 },
      { left: 240, top: 220, text: 20 },
      { left: 280, top: 140, text: 20 },
    ].map((item) => {
      return {
        text: item.text,
        left: this._ratioPx(item.left),
        top: this._ratioPx(item.top),
        width: this._ratioPx(ballSize),
        height: this._ratioPx(ballSize),
        lineWidth: this._ratioPx(1),
        strokeStyle: '#34a8dc',
        fillStyle: '#ffffffa3',
        floatDistance: 0,
        floatDirection: true,
        speedY: Math.max(Math.random(), 0.6) * 1.6,
        speedX: 0,
        status: 'float' // float, collecting, collected
      }
    })
  }

  _ratioPx(px) {
    return px * 2;
  }

  _animate() {
    const animate = () => {
      this._calcBallMove();
      this._render();
      this._timestamp = Date.now();
      window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
  }

  _calcBallMove() {
    // 每一帧都遍历小球列表，状态改变执行相应动画
    for(let i = 0; i < this._ballList.length; i++) {
      const ball = this._ballList[i];
      if (ball.status === 'float') {
        // 计算小球上下移动
        this._floatBall(ball);
      } else if (ball.status === 'collecting') {
        // 计算收集小球坐标
        this._collectBall(ball);
      }
    }
  }

  _floatBall(ball) {
    if (ball.status !== 'float') {
      return;
    }
    const maxDistance = this._ratioPx(30);
    let floatTop = ball.floatDistance;
    if (floatTop >= maxDistance) {
      ball.floatDirection = false;
    } else if(floatTop <= 0) {
      ball.floatDirection = true;
    }
    if (ball.floatDirection) {
      floatTop += ball.speedY;
    } else {
      floatTop -= ball.speedY;
    }
    ball.floatDistance = floatTop;
  }
  
  _collectBall(ball) {
    if (ball.status !== 'collecting') {
      return;
    };
    const interval = Date.now() - this._timestamp;
    const end = this._endPosition;
    if (ball.top - end.top > 1 && ball.left - end.left > 1) {
      ball.status = 'collected';
    } else {
      ball.top += (ball.speedY * interval);
      ball.left += (ball.speedX * interval);
    }
  }

  _onEvent() {
    const canvas = this._canvas;
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      // 点击相对画图位置
      const x = e.clientX - rect.x;
      const y = e.clientY - rect.y;
      // 计算点击的是哪个小球
      const index = this._getPointInWhichBall(x, y);
      // 计算小球部分数据
      this._doCollectBall(index);
    });
  }

  _getPointInWhichBall(x, y) {
    const _x = this._ratioPx(x);
    const _y = this._ratioPx(y);
    const ctx = this._ctx;
    let index = null;
    for (let i = 0; i < this._ballList.length; i++) {
      const ball = this._ballList[i];
      // 叠加绘制每个小球，为了获取单个小球上下文环境
      const r = ball.width / 2;
      ctx.beginPath();
      ctx.arc(ball.left + r, ball.top + r + ball.floatDistance, r, 0, 360, false);
      ctx.stroke(); 
      ctx.closePath();

      if (ctx.isPointInPath(_x, _y)) {
        index = i;
        break;
      }
    }
    return index;
  }

  _doCollectBall(index) {
    const ball = this._ballList[index];
    if (!ball) {
      return;
    }
    const time = 800;
    ball.status = 'collecting';
    ball.speedY = (this._endPosition.top - ball.top) / time;
    ball.speedX = (this._endPosition.left - ball.left) / time;
  }
}


export default Renderer;