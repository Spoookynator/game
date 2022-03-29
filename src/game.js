function game() {
  let playArea = { x: 600, y: 600 };
  let player = { y: 200, x: 270, size: 30, speed: 2.0 };
  let keypressed = { up: false, down: false, left: false, right: false };

  let gametime = 0;
  let id = null;

  let gamestate = {death: false, score: 0};

  let enemy1Array = [];

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
        //playerCollision(player, enemy1Array, gamestate);
    
        updatePlayer(player, playArea, keypressed, playerElement);

        updateScore(gametime, gamestate, enemy1Array, player, playArea)
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
  if (gametime % 2000 == 0 || gametime == 1) {
    enemy1Array.push(new Enemy(0, 0, 40, 0.5));

    let i = enemy1Array.length - 1;

    enemy1Array[i].x = randomInt(playArea.x - enemy1Array[i].size + 10) - 5;
    enemy1Array[i].y = randomInt(playArea.y - enemy1Array[i].size + 10) - 5;
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

function randomInt(max) {
  return Math.floor(Math.random() * max);
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
        if (i.x + i.size >= self.x && i.x + i.size <= self.x + self.size) {
          if (
            i.y + i.size >= self.y &&
            i.y + i.size <= self.y + self.size &&
            i.y <= self.y + self.size &&
            i.y + i.size >= self.size
          ) {
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

function playerCollision(player, enemy1Array, gamestate, playArea) {
        for (let i of enemy1Array) {
          if (i.hitCooldown == 0) {
            if (i.x + i.size >= player.x && i.x + i.size <= player.x + player.size) {
              if (
                i.y + i.size >= player.y &&
                i.y + i.size <= player.y + player.size &&
                i.y <= player.y + player.size &&
                i.y + i.size >= player.size
              ) {
                  console.log("hit");
                  gamestate.death = true;
                  console.log(gamestate.death);
              }
            }
          }
      }
}

function updateScore(gametime, gamestate, enemy1Array, player) {
    if (gametime % 10 == 0) {
        let newScore = Math.round((gametime / (gametime * .95)) * enemy1Array[0].speed * enemy1Array.length);


        if (player.x > 250 && player.x < 350 && player.y > 250 && player.y < 350) {
            newScore *= 4;
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