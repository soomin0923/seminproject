const fontSize = 60, scaleRate = 6, message = '21', inpactRange = 150;
let canvas;
let textData = [];
let dotsCordinate = [];
let img = [];
let imgs = [];

function preload() {
  for (var i = 1; i<5; i++) {
    img[i-1] = loadImage('https://github.com/soomin0923/seminproject/tree/main/img/mi' + i + '.png');
  }
}





class IMG {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.r = random(20,80);
    this.originalX = x;
    this.originalY= y;
    this.color = Math.floor(Math.random()*360);
    this.density = Math.random()*30;
  }
  draw() {
    fill(this.color, 100, 50);
    const randomValue = img[Math.floor(Math.random() * img.length)];
    image(randomValue, this.x, this.y, this.r, this.r);
  }

  update() {
    let distanceFromMouse = Math.sqrt((Math.pow(this.x-mouseX, 2)) + Math.pow(this.y-mouseY, 2));
    let distanceToOrigin = Math.sqrt((Math.pow(this.originalX-this.x, 2)) + Math.pow(this.originalY-this.y, 2));


    if (distanceFromMouse < inpactRange) {
      let repulsionAngle = Math.atan2(this.y - mouseY, this.x - mouseX);
      let repulsionForce = (inpactRange - distanceFromMouse) / inpactRange * this.density; // < 1
      this.x += Math.cos(repulsionAngle) * repulsionForce;
      this.y += Math.sin(repulsionAngle) * repulsionForce;
      // this.x -= Math.cos(repulsionAngle) * repulsionForce;
      // this.y -= Math.sin(repulsionAngle) * repulsionForce;
    } else {
      let attractionAngle = Math.atan2(this.originalY - this.y, this.originalX - this.x);
      let attractionForce = Math.abs(distanceToOrigin) / this.density;
      this.x += Math.cos(attractionAngle) * attractionForce;
      this.y += Math.sin(attractionAngle) * attractionForce;
    }
  }
}



function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  setup();
  draw();
}



function setup() {
  frameRate(5);
  colorMode(HSL)
    canvas = createCanvas(600, 600); // 이거 색 아예 검은색으로 
    var x = (windowWidth - width) / 5 * 4;
    var y = (windowHeight - height) / 5 * 4;
    canvas.position(x,y);
  noStroke();
  background(50);
  fill('#000');
  textSize(fontSize);
  textAlign(LEFT, TOP);
  textData = getTextData(message);
  dotCordinate = getCordinates();
  imgs = createParticles(scaleRate, 0, 0);
  

}


function draw() {
  background(0);
  updating();
  drawParticles();

}



function mouseDragged() {
}

function getTextData(message) {
  const data = [];
  text(message, 0, 0);    // draw once and get data
  for (let y = 0; y < textAscent(message); y++) {
    let row = [];
    for (let x = 0; x < textWidth(message); x++) {
      row.push(canvas.get(x, y))    // get data, [r, g, b, a]
    }
    data.push(row);
  }
  return data;
}

function getCordinates() {
  const cordinate = []
    for (let y = 0; y < textData.length; y++) {
    let row = []
      for (let x = 0; x < textData[0].length; x++) {
      let red = textData[y][x][0];    // the data equals [0, 0, 0, 255] or [255, 255,255, 255]. So pick up red value and judge
      if (red < 128) {    // if < 128, regard the pixel as 'black'(1);
        row.push(1);
      } else {
        row.push(0);
      }
    }
    dotsCordinate.push(row);
  }
  return cordinate
}

function createParticles(scaleRate, marginX, marginY) {
  const imgs = [];
  for (let y = 0; y < dotsCordinate.length; y+=5) {
    for (let x = 0; x < dotsCordinate[0].length; x+=5) {
      if (dotsCordinate[y][x] === 1) {
        let img = new IMG(x * scaleRate + marginX, y * scaleRate + marginY);
        imgs.push(img)
      }
    }
  }
  return imgs
}

function drawParticles() {
  imgs.forEach(p => {
    p.draw()
  }
  )
}

function updating() {
  imgs.forEach(p => {
    p.update();
  }
  )
}
