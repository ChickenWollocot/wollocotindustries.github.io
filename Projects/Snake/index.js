const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const coordLeft = document.querySelector("#left-side-coords");
const foodCoord = document.querySelector("#food-coords");
const e = document.getElementById('epochs');
// const btn = document.getElementById('btn');
const eText = document.getElementById('epoches');
eText.innerHTML = `${e.value}`;
console.log(e.value);
const predictionText = document.querySelector("#prediction");
const distance = document.querySelector("#distance");
let points = 0
const textPoints = document.querySelector("#points");

class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
class Player{
    constructor(w, h){
        this.pos = new Vector;
        this.size = new Vector(w, h);
        this.vel = new Vector;

    }
    draw(x, y, w, h){
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, w, h);
    }
}
class Food extends Player{
    constructor(){
        super(10, 10);

    }
    Produce(x, y, w, h){
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, w, h);
    }
}


canvas.height = 400;
canvas.width = 400;

let player = new Player;
player.pos.x = 20;
player.pos.y = 20;
player.size.w = 20;
player.size.h = 20;
let food = new Food;
food.pos.x = 200;
food.pos.y = 150;

const model = tf.sequential();
model.add(tf.layers.dense({
    inputShape:[1],
    units:2,
    activation:'relu'
}))

model.add(tf.layers.dense({
    inputShape:[5],
    units:2,
    activation:'tanh'
}))
model.add(tf.layers.dense({
    // inputShap/e: [2],
    units:1,
    activation:'tanh'
}))

model.compile({loss:"meanSquaredError", optimizer:'adam'});
// player.pos.x -= 2;
let lastTime;
const callback = millis => {
    if (lastTime) {
      drawPlayer(((millis - lastTime) / 1000) * 2);
    }
  
    lastTime = millis;
  
      requestAnimationFrame(callback);
    
    
  };
  
let drewFood = false;
e.addEventListener('input', ee => {
    eText.innerHTML = `${e.value} epochs <br> Epochs - Number of iterations of training: Lower, the quicker the thinking but worse results, and the higher, the slower the thinking but more accurate results.`
})
function train(xs, ys, epochs, foodX, foodY){

    model.fit(xs, ys, {epochs:epochs}).then(() => {
        const res = model.predict(tf.tensor2d([player.pos.x - foodX], [1,1])).dataSync()[0];
        console.log(res);
        if(res < -0.5){
             player.pos.y += 1;
             predictionText.innerHTML = `Prediction: ${res} (Down)`
        }
        else if(res > -0.5 && res < 0.0000005 && res != 0){
            player.pos.x += 1;
            predictionText.innerHTML = `Prediction: ${res} (Right)`



        }
        else if(res < 0.5 && res > 0){
            player.pos.x -= 1;
            predictionText.innerHTML = `Prediction: ${res} (Left)`

        }
        else if(res >= 0.5){
            player.pos.y -= 1;
            predictionText.innerHTML = `Prediction: ${res} (Up)`


        }
        else if(res == 0 && food.pos.x - player.pos.x > 0){
            player.pos.x += 1;
            predictionText.innerHTML = `Prediction: ${res} (Right)`

        }
        else if(res == 0 && food.pos.x - player.pos.x < 0){
            player.pos.x -= 1;
            predictionText.innerHTML = `Prediction: ${res} (Left)`

        }
        coordLeft.innerHTML = `Player Coordinate: (${player.pos.x}, ${player.pos.y}) <br><br> Player's Right-Side X: ${player.pos.x + player.size.w}`
        console.log(`player's right: ${player.pos.x + player.size.w} ; food's left: ${foodX} / player's left: ${player.pos.x} ; food's right: ${foodX + food.size.w}`)
        foodCoord.innerHTML = `Food Coordinate: (${food.pos.x}, ${food.pos.y}) <br><br> Food's Right-Side X: ${food.pos.x + 20}`
        /* ?

        */
       distance.innerHTML = `Distance from Food's Position: ${Math.sqrt(food.pos.x - player.pos.x)^2 + (food.pos.y - player.pos.y)^2}`;
        if(player.pos.x == canvas.width){
            location.reload();
        }
        return res;
    });
}
function drawPlayer(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // player.pos.x += 1;
    let arr1 = [];
let arr2 = [];
    
    // player.size.w += 2
    player.draw(player.pos.x, player.pos.y, player.size.w, player.size.h);
    if(drewFood == false){
        drewFood = true;

        food.Produce(food.pos.x, food.pos.y, 20, 20);
        drewFood = false;
        arr1.push(player.pos.x - food.pos.x);
        arr2.push(player.pos.y - food.pos.y);
        // console.log(arr1)
        arr1 = tf.tensor2d([arr1]);
        arr2 = tf.tensor2d([arr2]);
        // btn.addEventListener('click', train(arr1, arr2, e.value, food.pos.x, food.pos));

        train(arr1, arr2, e.value, food.pos.x, food.pos.y);
        /* 
        
        ? 
        COLLISION STUFF:
        ?
        IF player's right (player.pos.x + player.size.w) is equal than the food's left
        ?
        If player's left is equal than food's right (food.pos.x + food.size.w)
        ? 
        if player's up is equal than food's down (food.pos.y + food.size.h)
        ?
        if player's down (player.pos.y + food.size.h) is equal than food's up (food.pos.y)
        
        */

        if(player.pos.x + player.size.w == food.pos.x || player.pos.x == food.pos.x + 20 || (player.pos.x == food.pos.x && player.pos.y == food.pos.y) || ((player.pos.y + 20 == food.pos.y || player.pos.y == food.pos.y + 20) && food.pos.x - player.pos.x == 0)){
            points = points + 1;
            textPoints.innerHTML = `Points: ${points}`;
            drewFood = false;
            food.pos.x = Math.floor(Math.random() * canvas.width );
            food.pos.y = Math.floor(Math.random() * canvas.height);
            food.Produce(food.pos.x, food.pos.y, 20, 20);
            train(arr1, arr2, e.value, food.pos.x, food.pos.y);

        }
        
    }

}
drawPlayer();
callback();