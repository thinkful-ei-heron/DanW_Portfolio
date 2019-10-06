'use strict';

//
//Create a splatter/spray paint effect between two user defined points.
//
//We optimize by only drawing half circle after first frame. If a reasonable
//number of frames are not provied by user for distance between two points
//we will not get the desired effect, but as this will also cause the animation
//to be janky I do not see this being an issue for users.  Ideally frames are
//provied as seconds animation should last divided by 60.
//
//xl, l, m, s represent size of splatter, and should be set relative to radius,
//though i have provided defaults which should work well unless you want a
//small or very large radius for the effect.
//
//Future plans: -optimize splatter effect around edge of primary circle
//              -Process splatter() with web worker
class Spray {
  constructor(
    ctx,
    radius,
    color,
    x,
    y,
    endX,
    endY,
    frames,
    splatterStrength = 150,
    xl = 13,
    l = 9,
    m = 6,
    s = 3
  ) {
    this.ctx = ctx;
    this.radius = radius;
    this.color = color;
    this.x = x;
    this.y = y;
    this.endX = endX;
    this.endY = endY;
    this.radius = radius;
    this.splatterStrength = splatterStrength;
    this.xl = xl;
    this.l = l;
    this.m = m;
    this.s = s;
    this.frames = frames;
    this.firstFrame = frames;
    this.stepDist;
    this.maxAngle;
    this.minAngle;
    this.splatX;
    this.splatY;
    this.rad;
    this.angle;
    this.halved;
    this.setup();
  }

  //find the angle between beginning and end points
  //and get dist to be traveled along the line
  //connecting these points on each frame
  setup() {
    let adj = this.x - this.endX;
    let opp = this.y - this.endY;
    let dist = Math.sqrt(adj * adj + opp * opp);
    this.stepDist = dist / this.frames;
    this.angle = Math.atan(Math.abs(opp) / Math.abs(adj));

    let topLeftAngle = this.angle - 90;
    let bottomLeftAngle = this.angle + 90;
    this.maxAngle = Math.max(topLeftAngle, bottomLeftAngle);
    this.minAngle = Math.min(topLeftAngle, bottomLeftAngle);
  }

  //find the center point for the next frame drawing
  getNewCoords() {
    this.x += Math.cos(this.angle) * this.stepDist;
    this.y -= Math.sin(this.angle) * this.stepDist;
  }

  //Get info needed to draw splatter effect.  It is set up to have heavy splatter
  //around the radius of the main circle to get an uneven efect for the circle
  //edge. This can (and will) be optimized in the futureby drawing a new circle every
  //10 deg instead of drawing a large number of random splatters.
  //
  //It is optimized to only draw 360deg of splatter on first few frames.  After this
  //we only need 180deg of splatter.
  //
  //The splatter effect becomes less likely, and furthermore the splatters are less likely
  //to be large, the further out we get from the primary circles edge.  This makes the code
  //more complicated but delivers the desired effect.  The most likely splatter effects should
  //always be evaluated first.
  //
  //Future plans: -optimize splatter effect around edge of primary circle
  //              -Process with web worker
  splatter(i) {
    let splatDistance;
    let splatMinDistance;
    let splatMaxDistance;
    let random;
    let randomDist;
    let splatAngle;

    if (this.firstFrame - this.frames >= 5 && this.frames > 5) {
      splatAngle = Math.floor(Math.random() * (this.maxAngle - this.minAngle) + this.minAngle);
      if (i === 0 && this.halved === false) {
        this.splatterStrength /= 2;
        this.halved = true;
      }
    } else splatAngle = Math.floor(Math.random() * 360);

    splatMinDistance = Math.floor(this.radius - this.radius * 0.05);
    random = Math.random();
    randomDist = Math.random();

    //60%
    if (randomDist > 0.4) {
      splatMaxDistance = this.radius;
      if (random > 0.6) this.rad = Math.floor(Math.random() * (this.m + 4 - 1) + 1);
      else if (random > 0.2) this.rad = Math.floor(Math.random() * (this.l + 4 - 1) + 1);
      else this.rad = Math.floor(Math.random() * (this.xl + 4 - 1) + 1);
    }
    //20%
    else if (randomDist > 0.2) {
      splatMaxDistance = Math.floor(this.radius + this.radius * 0.35);

      if (random > 0.1) this.rad = Math.floor(Math.random() * (this.s - 1) + 1);
      else if (random > 0.04) this.rad = Math.floor(Math.random() * (this.m - 1) + 1);
      else if (random > 0.01) this.rad = Math.floor(Math.random() * (this.l - 1) + 1);
      else this.rad = Math.floor(Math.random() * (this.xl - 1) + 1);
    }
    //15%
    else if (randomDist > 0.05) {
      splatMaxDistance = Math.floor(this.radius + this.radius);
      if (random > 0.1) this.rad = Math.floor(Math.random() * (this.s - 1) + 1);
      else if (random > 0.05) this.rad = Math.floor(Math.random() * (this.m - 1) + 1);
      else this.rad = Math.floor(Math.random() * (this.l - 1) + 1);
    }
    //5%
    else {
      splatMaxDistance = Math.floor(this.radius + this.radius * 0.5);
      if (random > 0.3) this.rad = Math.floor(Math.random() * (this.s - 1) + 1);
      else if (random > 0.2) this.rad = Math.floor(Math.random() * (this.m - 1) + 1);
      else this.rad = Math.floor(Math.random() * (this.l - 1) + 1);
    }

    splatDistance = Math.floor(Math.random() * (splatMaxDistance - splatMinDistance) + splatMinDistance);
    this.splatX = this.x + Math.cos((splatAngle * Math.PI) / 180) * splatDistance;
    this.splatY = this.y + Math.sin((splatAngle * Math.PI) / 180) * splatDistance;
  }

  draw() {
    let _this = this;

    //draw splatter effect
    for (let i = 0; i < this.splatterStrength; i++) {
      this.splatter(i);
      this.ctx.fillStyle = `${this.color}`;
      this.ctx.beginPath();
      this.ctx.arc(this.splatX, this.splatY, this.rad, 0, Math.PI * 2, false);
      this.ctx.fill();
      this.ctx.closePath();
    }

    //draw primary circle
    this.ctx.fillStyle = `${this.color}`;
    this.ctx.beginPath();
    //only draw half the circle after first frame
    if (this.firstFrame != this.frames) {
      this.ctx.arc(
        this.x,
        this.y,
        this.radius,
        (this.minAngle * Math.PI) / 180,
        (this.maxAngle * Math.PI) / 180,
        false
      );
    } else {
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    }
    this.ctx.fill();
    this.ctx.closePath();

    this.getNewCoords();

    this.frames--;

    if (this.frames <= 0) {
      //It's awkward but we have to reset splatterStrength here as we
      //will half it in splatter() as an optimization after the frist
      //5 frames.
      if (this.halved === true) {
        this.splatterStrength * 2;
        this.halved = false;
      }

      return;
    } else window.requestAnimationFrame(() => _this.draw());
  }
}

//
// implementation specific setup
//
function init() {
  let ctx = document.querySelector('canvas').getContext('2d');
  let radius = 80;
  let color = '#FF5DA8';
  let setup = getSprayCoords();
  let resizeID;

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  let spray = new Spray(ctx, radius, color, setup.x, setup.y, setup.endX, setup.endY, setup.frames);

  setTimeout(() => spray.draw(), 1000);

  window.addEventListener('resize', resize, false);

  function resize() {
    clearTimeout(resizeID);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    resizeID = setTimeout(resizeCanvas, 1000);
  }

  function resizeCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    setup = getSprayCoords();
    let spray = new Spray(ctx, radius, color, setup.x, setup.y, setup.endX, setup.endY, setup.frames);
    spray.draw();
  }
}

function offset(el) {
  let rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft, right: rect.left + rect.width };
}

function getSprayCoords() {
  let rect = offset(document.querySelector('#heroMiddle'));
  let w = Math.max(document.documentElement.clientWidth, window.innerWidth);
  let x;
  let y;
  let endX;
  let endY;
  let frames;
  if (w <= 550) {
    x = rect.left - 140;
    y = rect.top - 15;
    endX = rect.right + 20;
    endY = y;
    frames = 4000 / 60;
  } else if (w <= 1024) {
    x = rect.left - 140;
    y = rect.top;
    endX = rect.right + 140;
    endY = y;
    frames = 5000 / 60;
  } else {
    x = rect.left - 200;
    y = rect.top - 15;
    endX = rect.right + 200;
    endY = y;
    frames = 6000 / 60;
  }

  return {
    x: x,
    y: y,
    endX: endX,
    endY: endY,
    frames: frames
  };
}

init();
