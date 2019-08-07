class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(w, h) {
    this.pos = new Vector();
    this.size = new Vector(w, h);
  }
}
class Ball extends Rect {
  constructor() {
    super(50, 50);
    this.velocity = new Vector(this.x, this.y);
  }
}
class Obstacle extends Rect {
  constructor() {
    super(50, 100);
    this.velocity = new Vector();
    this.instances = [];
    // this.instances.push(this.pos.x);
  }
  Instantiate(x, y, w, h) {
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "white";
  }
}

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const player = new Ball();
const obstacle = new Obstacle();
const gravity = 0.7;
player.velocity.y -= gravity;
player.pos.x = 15;
player.pos.y = 15;
let lastTime = 0;

const model = tf.sequential();
model.add(
  tf.layers.dense({
    units: 8,
    inputShape: [1],
    activation: "softmax"
  })
);
model.add(
  tf.layers.dense({
    units: 2,
    inputShape: [8],
    activation: "softmax"
  })
);
model.add(
  tf.layers.dense({
    units: 1,
    inputShape: [1],
    activation: "tanh"
  })
);
model.compile({ loss: "meanSquaredError", optimizer: "sgd" , metrics:['accuracy']});
const callback = millis => {
  if (lastTime) {
    update(((millis - lastTime) / 1000) * 2);
  }

  lastTime = millis;

    requestAnimationFrame(callback);
  
  
};

 
  


async function update(dt){


  player.pos.y -= player.velocity.y;
  player.pos.x += 1;
  var arr1 = [];
  var arr2 = [];
  // ctx.translate(player.pos.x - canvas.width / 2,player.pos.y - canvas.height / 2);
  if (player.pos.x == canvas.width) {
    location.reload();

    //   document.body.insertBefore(newDiv, currentDiv);
  }
  if(player.pos.y == canvas.height){
  
    player.pos.y = 40;
  
  //   document.body.insertBefore(newDiv, currentDiv); 

}
if(player.pos.y == obstacle.pos.y || player.pos.x == obstacle.pos.x){
  
  location.reload();

//   document.body.insertBefore(newDiv, currentDiv); 

}
  arr1 = arr1.concat(player.pos.y);

  arr2 = arr2.concat(obstacle.pos.y - player.pos.y);
  arr1 = tf.tensor2d([arr1]);
  arr2 = tf.tensor2d([arr2]);

      
        model.fit(arr1, arr2, {epochs:90}).then((history) => {
          const pred = model
            .predict(tf.tensor2d([player.pos.y], [1, 1]))
            .dataSync()[0];
          console.log(pred, history);
    
          if (pred < 0 ) {
            console.log("JUMP");
            mouseDown();
          } else {
            console.log("DONT JUMP");
            mouseUp();
          }
        });
      
      
  
     





  canvas.width = 800;
  canvas.height = 800;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillRect(player.pos.x, player.pos.y, 15, 15);

  obstacle.Instantiate(130, 100, 50, 250);
  obstacle.Instantiate(210, 100, 50, 250);
  obstacle.Instantiate(290, 100, 50, 250);
  obstacle.Instantiate(370, 100, 50, 250);
  // obstacle.Instantiate(460, 200, 50, 250);
  obstacle.Instantiate(550, 100, 50, 250);

  // console.log(obstacle.instances.push(obstacle.pos.x));
  // train(arr1, arr2)
};

callback();

var keyPressed = false;
// document.addEventListener('mousedown', mouseDown)
// document.addEventListener('mouseup', mouseUp)
function mouseDown() {
  keyPressed = true;
  player.velocity.y = 2;
  // setTimeout(() => {
  //     player.pos.y -= player.velocity.y;
  // }, 2000)
}

function mouseUp() {
  keyPressed = false;
  player.velocity.y = -2;
  player.velocity.y -= gravity;
}

function train() {}
