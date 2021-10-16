const content = document.querySelector('#content');

content.addEventListener('click', (e) => {
  const ball = getBallTarget(e);
  if (!ball) {
    return;
  }
  ball.classList.remove('ball-float');
  animate(ball, {
    start: 0,
    during: 1000,
  }, () => {
    console.log('----------- end -----------')
  })
}, false);



function getBallTarget(e) {
  const path = e.path;
  const target = path[0];
  const parent = path[1];
  if (target.nodeName === 'DIV' && target.classList.contains('ball')) {
    return target;
  } else if (target.nodeName === 'SPAN' && target.classList.contains('ball-text')) {
    return parent;
  }
  return null;
}



function linear(interval, start, begin, end, during) {
  return begin + ((end - begin) /  (during - start)) * interval
  // (end - begin)剩余总长度，(during - start)剩余总时长
  // (end - begin) /  (during - start)算出速度
  // 速度*interval=此帧运行的距离
}

function animate(ball, params, callback) {
  let { start, during } = params;
  let lastTime = Date.now();

  function _action() {
    const now = Date.now();
    const inerval = now - lastTime;// 每帧间隔时间
    start += inerval;// 0-1000ms每帧开始的时间
    lastTime = now;

    // 小球目前的位置（变化）
    const begin = getContentChildPosition(ball);
    // 终点位置（不变）
    const end = getBallEndPosition();
    // 每帧变化的位置
    const endTop = linear(inerval, start, begin.top, end.top, during);
    const endLeft = linear(inerval, start, begin.left, end.left, during);
    if (start > during || Math.abs(endTop - end.top) < 1 || Math.abs(endLeft - end.left) < 1) {
      callback();
    } else {
      ball.style.top = `${endTop}px`;
      ball.style.left = `${endLeft}px`;
      window.requestAnimationFrame(_action);
    }
  }
  _action();
};


function getBallEndPosition() {
  const center = content.querySelector('.center-circle');
  const childRect = center.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();
  return {
    left: childRect.left - contentRect.left + childRect.width / 2,
    top: childRect.top - contentRect.top + childRect.height,
  }
}

function getContentChildPosition(child) {
  const childRect = child.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();
  return {
    left: childRect.left - contentRect.left,
    top: childRect.top - contentRect.top,
  }
}
