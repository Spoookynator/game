function game() {
  let playArea = { x: 600, y: 600 };
  let player = { y: 200, x: 270, size: 30, speed: 2.0 };
  let keypressed = { up: false, down: false, left: false, right: false };

  let gametime = 0;
  let id = null;

  let gamestate = {death: false, score: 0};

  let enemy1Array = [];

  let fruitArray = [];

  const playerElement = document.getElementById("player");
  playerElement.style.width = player.size + "px";
  playerElement.style.height = player.size + "px";

  document.getElementById("container").style.width = playArea.x;
  document.getElementById("container").style.height = playArea.y;
  document.getElementById("container").style.backgroundColor = "black";

  addEvents(keypressed);

  clearInterval(id);
  id = setInterval(frame, 5);


    function frame() {
        if (gamestate.death === false)
        {
        gametime++;
        spawnEnemy(gametime, enemy1Array, playArea);
        updateEnemy(enemy1Array, playArea, gametime);
    
        enemyCollision(enemy1Array);
        playerCollision(player, enemy1Array, gamestate);
    
        updatePlayer(player, playArea, keypressed, playerElement);

        spawnFruits(gametime, fruitArray, playArea);
        updateScore(gametime, gamestate, enemy1Array, playArea, player, keypressed);
        fruitColletion(player, fruitArray, gamestate)
        }
    }


}

function addEvents(keypressed) {
  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key == "ArrowUp" || e.key == "w") {
        keypressed.up = true;
      }
      if (e.key == "ArrowDown" || e.key == "s") {
        keypressed.down = true;
      }
      if (e.key == "ArrowLeft" || e.key == "a") {
        keypressed.left = true;
      }
      if (e.key == "ArrowRight" || e.key == "d") {
        keypressed.right = true;
      }
    },
    false
  );

  document.addEventListener(
    "keyup",
    function (e) {
      if (e.key == "ArrowUp" || e.key == "w") {
        keypressed.up = false;
      } else if (e.key == "ArrowDown" || e.key == "s") {
        keypressed.down = false;
      } else if (e.key == "ArrowLeft" || e.key == "a") {
        keypressed.left = false;
      } else if (e.key == "ArrowRight" || e.key == "d") {
        keypressed.right = false;
      }
    },
    false
  );
}

function updatePlayer(player, playArea, keypressed, playerElement) {
  if (player.y <= 0) {
    keypressed.up = false;
  }
  if (player.y >= playArea.y - player.size) {
    keypressed.down = false;
  }
  if (player.x <= 0) {
    keypressed.left = false;
  }
  if (player.x >= playArea.x - player.size) {
    keypressed.right = false;
  }

  if (keypressed.up == true) {
    player.y -= player.speed;
  }
  if (keypressed.down == true) {
    player.y += player.speed;
  }
  if (keypressed.right == true) {
    player.x += player.speed;
  }
  if (keypressed.left == true) {
    player.x -= player.speed;
  }

  playerElement.style.top = player.y + "px";
  playerElement.style.left = player.x + "px";
}

function updateEnemy(enemy1Array, playArea, gametime) {
  for (let i of enemy1Array) {
    let enemyElement = document.getElementById(`enemy1_${i.id}`);

    if (gametime % 200 == 0) {
      newSpeed = i.speed;

      newSpeed = Math.pow(i.speed, 2) / Math.pow(10, 2) + i.speed;
      console.log("speed", newSpeed);

      i.speed = newSpeed;
    }

    if (i.spawnProtection <= 0) {
        enemyElement.classList.remove("enemy1_spawn");
        enemyElement.classList.add("enemy1");
    }

    if (i.y <= 0) {
      i.yMovement = getRandomArbitrary(i.speed * 0.9, i.speed * 1.2);
    }
    if (i.y >= playArea.y - i.size) {
      i.yMovement = -1 * getRandomArbitrary(i.speed * 0.9, i.speed * 1.2);
    }
    if (i.x <= 0) {
      i.xMovement = getRandomArbitrary(i.speed * 0.9, i.speed * 1.2);
    }
    if (i.x >= playArea.x - i.size) {
      i.xMovement =  -1 * getRandomArbitrary(i.speed * 0.9, i.speed * 1.2);
    }

    if (i.hitCooldown > 0) i.hitCooldown--;

    if (i.spawnProtection > 0) i.spawnProtection--;

    i.x += i.xMovement;
    i.y += i.yMovement;

    enemyElement.style.top = i.y + "px";
    enemyElement.style.left = i.x + "px";

    enemyElement.style.width = i.size + "px";
    enemyElement.style.height = i.size + "px";
  }
}

function spawnEnemy(gametime, enemy1Array, playArea) {
  if (gametime % 2800 == 0 || gametime == 1) {
    enemy1Array.push(new Enemy(0, 0, 40, 0.5));

    let i = enemy1Array.length - 1;

    enemy1Array[i].x = getRandomInt(enemy1Array[i].size, playArea.x - (enemy1Array[i].size + 10));
    enemy1Array[i].y = getRandomInt(enemy1Array[i].size, playArea.y - (enemy1Array[i].size + 10));
    enemy1Array[i].id = enemy1Array.length - 1;

    let para = document.createElement("div");
    para.classList.add("enemy1_spawn");
    para.setAttribute("id", "enemy1_" + (enemy1Array.length - 1));

    para.style.left = enemy1Array[i].x + "px";
    para.style.top = enemy1Array[i].y + "px";

    para.style.width = enemy1Array[i].size + "px";
    para.style.height = enemy1Array[i].size + "px";

    document.getElementById("container").appendChild(para);
    console.log("added: " + i);
  }
}

class Enemy {
  constructor(x, y, size, speed, id) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.xMovement = randomPosOrNeg() * speed;
    this.yMovement = randomPosOrNeg() * speed;
    this.id = id;
    this.hitCooldown = 200;
    this.spawnProtection = 400;
  }
}

class Fruit{
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function randomPosOrNeg() {
  let temp = Math.floor(Math.random() * 2);
  if (temp == 1) return 1;
  else return -1;
}

function enemyCollision(enemy1Array) {
  for (let self of enemy1Array) {
    for (let i of enemy1Array) {
      if (!(self.id == i.id) && self.hitCooldown == 0) {
        if (i.x + i.size >= self.x && i.x <= self.x + self.size) {
          if (
            i.y + i.size >= self.y && i.y <= self.y + self.size)
            {
            self.hitCooldown = 400;
            self.xMovement *= 1.1;
            self.yMovement *= 1.1;

            i.hitCooldown = 200;
            i.xMovement *= .8;
            i.yMovement *= .8;
          }
        }
      }
    }
  }
}

function playerCollision(player, enemy1Array, gamestate) {
        for (let i of enemy1Array) {
          if (i.hitCooldown == 0) {
            if (i.x + i.size >= player.x && i.x <= player.x + player.size) {
              if (
                i.y + i.size >= player.y && i.y <= player.y + player.size
              ) {
                  gamestate.death = true;
                  console.log(gamestate.death);
              }
            }
          }
      }
}

function updateScore(gametime, gamestate, enemy1Array, playArea, player, keypressed) {
    if (gametime % 10 == 0) {
        let newScore = Math.round((gametime / (gametime * .8)) * (enemy1Array[0].speed * 2) * enemy1Array.length);


        if (player.x > playArea.x/2.4 && player.x < playArea.x - (playArea.x/2.4) && player.y > playArea.y/2.4 && player.y < playArea.y - (playArea.y/2.4)) {
            newScore *= 4;
        }

        if ((keypressed.left == true && keypressed.right != true) || (keypressed.up == true && keypressed.down != true) || (keypressed.right == true && keypressed.left != true) || (keypressed.down == true && keypressed.up != true)) {
          newScore *= 10;
        }
        gamestate.score += newScore
    }


    let text = "Score: ";

    for (let i = 0; i < 10 - numDigits(gamestate.score); i++) {
        text += "0";
    }
    document.getElementById("score").innerHTML = text + gamestate.score;
}

function numDigits(x) {
    return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
  }

  function spawnFruits(gametime, fruitArray, playArea) {
    if (gametime % 1200 == 0 && fruitArray[0] === undefined) {
      console.log("spawned fruit");
  
      fruitArray.push(new Fruit(0, 0, 20));

      fruitArray[0].x = getRandomInt(fruitArray[0].size + 10, playArea.x - (fruitArray[0].size + 10));
      fruitArray[0].y = getRandomInt(fruitArray[0].size + 10, playArea.y - (fruitArray[0].size + 10));

      let para = document.createElement("div");
      para.classList.add("fruit");
      para.setAttribute("id", "fruit");

      para.style.left = fruitArray[0].x + "px";
      para.style.top = fruitArray[0].y + "px";

      para.style.width = fruitArray[0].size + "px";
      para.style.height = fruitArray[0].size + "px";

    document.getElementById("container").appendChild(para);
    }
  }

  function fruitColletion(player, fruitArray, gamestate) {
    for (let i of fruitArray) {
      if (i.x + i.size >= player.x && i.x <= player.x + player.size) {
        if (
          i.y + i.size >= player.y && i.y <= player.y + player.size
        ) {

            fruitArray.pop();
            let container = document.getElementById("container");
            let child = document.getElementById("fruit");

            container.removeChild(child);
            
            console.log("gone");

            gamestate.score =  Math.round(gamestate.score * 1.2);

          }
        }
  }
}