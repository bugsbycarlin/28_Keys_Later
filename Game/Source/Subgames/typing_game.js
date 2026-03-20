//
// This file contains the one and only screen for the application.
// This is the meat of the program.
//
// Copyright 2024 Alpha Zoo LLC.
// Written by Matthew Carlin
//

let zombies = [
  "zombie_01","zombie_08","zombie_11",
  "zombie_13","zombie_16","zombie_17"
  ];

let boy_zombies = [
  "zombie_01","zombie_08","zombie_11",
]

let girl_zombies = [
  "zombie_13","zombie_16","zombie_17"
]

let speeds = [
  0.3, 0.5,
  0.35, 0.55,
  0.4, 0.6,
  0.45, 0.65,
  0.5, 0.7,
  ]

let waves = [
  5, 7,
  9, 11,
  13, 15,
  17, 19,
  21, 23,
  ]

let zombie_delays = [
  2500,2300,
  2100,1900,
  1700,1500,
  1300,1100,
  900,700,
  ]

let music_for = [
  "Level1","Level1",
  "Level2","Level2",
  "Level3","Level3",
  "Level4","Level4",
  "Level5","Level5",
]

class TypingGame extends Screen {
  // Set up the screen
  initialize(width, height) {
    var self = this;
    this.state = null;

    music_volume = 0.6;

    this.level = 3;

    this.game_width = width;
    this.game_height = height;

    this.layers = {};
    let layers = this.layers;

    layers["background"] = new PIXI.Container();
    this.addChild(layers["background"]);

    layers["zombies"] = new PIXI.Container();
    this.addChild(layers["zombies"]);

    layers["overlay"] = new PIXI.Container();
    this.addChild(layers["overlay"]);
    let overlay = layers["overlay"];

    this.background = makeSprite("Art/level1_background.png", layers["background"], this.game_width / 2, this.game_height / 2, 0.5, 0.5),


    // for (let i = 0; i < 5; i++) {
    //   let new_zombie = makeAnimatedSprite("Art/Zombies/" + pick(zombies) + ".json", "zombie", overlay, this.game_width / 2 + 100 * i, this.game_height / 2 + 100 + dice(400), 0.5, 0.9);
    //   new_zombie.speed = speeds[this.level-1] * (dice(40) + 80) / 100.0
    //   new_zombie.animationSpeed = new_zombie.speed;
    //   new_zombie.play();
    //   this.zombies.push(new_zombie)
    // }



    // this.highlight_color = 0x33CC33;

    this.black_font = {fontFamily: "Arial", fontSize: 144, fontWeight: 200, fill: 0x000000, letterSpacing: 1, align: "right"};    
    // this.red_font = {fontFamily: "Arial", fontSize: 36, fontWeight: 200, fill: 0xDD3333, letterSpacing: 1, align: "right"};    
    this.blue_font = {fontFamily: "Arial", fontSize: 144, fontWeight: 200, fill: 0x3333DD, letterSpacing: 1, align: "right"};    
    this.yellow_font = {fontFamily: "Arial", fontSize: 144, fontWeight: 200, fill: 0xDBCC79, letterSpacing: 1, align: "right"}; 
    // this.highlight_font = {fontFamily: "Arial", fontSize: 36, fontWeight: 200, fill: this.highlight_color, letterSpacing: 1, align: "right"};    
    // this.small_gray_font = {fontFamily: "Arial", fontSize: 18, fontWeight: 200, fill: 0xcccccc, letterSpacing: 1, align: "right"};    

    this.panel = makeSprite("Art/typing_panel.png", layers["overlay"], this.game_width / 2 - 10, 10, 0.5, 0)
    this.letterTextBacking = makeText("K", this.black_font, overlay, this.game_width / 2 + 130 - 8, 190, 1, 1);
    this.letterText = makeText("K", this.blue_font, overlay, this.game_width / 2 + 130, 190, 1, 1);
    this.panel.visible = false;
    this.letterTextBacking.visible = false;
    this.letterText.visible = false;


    this.successTextBacking = makeText("SUCCESS!", this.black_font, overlay, this.game_width / 2, this.game_height / 2 - 200, 0.5, 0.5);
    this.successText = makeText("SUCCESS!", this.blue_font, overlay, this.game_width / 2 + 8, this.game_height / 2 - 200, 0.5, 0.5);
    this.successTextBacking.visible = false;
    this.successText.visible = false;


    this.weapon = makeSprite("Art/hammer.png", layers["overlay"], this.game_width / 2, this.game_height / 2, 0.5, 0.5)
    shakers.push(this.weapon);
    this.readyWeapon();

    this.zombies = [];

    this.wave_size = waves[this.level-1] + dice(6);



    // this.facts = [];

    // this.game_type = 0;

    // this.initializeFactSheet();
    // this.cursor = 0;
    // this.highlightAtCursor();

    this.pre_game_art = {
      0: makeSprite("Art/3.png", overlay, this.game_width / 2, this.game_height / 2 - 100, 0.5, 0.5),
      1: makeSprite("Art/2.png", overlay, this.game_width / 2, this.game_height / 2 - 100, 0.5, 0.5),
      2: makeSprite("Art/1.png", overlay, this.game_width / 2, this.game_height / 2 - 100, 0.5, 0.5),
      3: makeSprite("Art/go.png", overlay, this.game_width / 2, this.game_height / 2 - 100, 0.5, 0.5),
    };
    this.pre_game_art[0].visible = false;
    this.pre_game_art[1].visible = false;
    this.pre_game_art[2].visible = false;
    this.pre_game_art[3].visible = false;

    // this.timer = makeText("4:00", this.blue_font, overlay, this.game_width - 30, 30, 1, 0),
    // this.timer.visible = false;

    // this.score = makeText("", this.yellow_font, overlay, this.game_width - 30, this.game_height - 30, 1, 1);
    // this.score.visible = false;

    // this.bat = makeAnimatedSprite("Art/bat.json", "bat", overlay, this.game_width / 2, this.game_height / 2, 0.5, 0.5);
    // this.bat.scale.set(0.5,0.5);
    // this.bat.animationSpeed = 0.75;
    // this.bat.play();
    // this.bat.x = -400;
    // this.bat.target = null;

    this.last_zombie = markTime();
    this.next_zombie = 500;
    this.start_time = markTime()
    
    // setMusic(pick(["Level1","Level2","Level3","Level4","Level5"]));
    setMusic(music_for[this.level-1])


    // this.countDownThenStart();
    this.mode = "game";
    
  }


  countDownThenStart() {
    var self = this;

    soundEffect("countdown")
    this.mode = "countdown";
    delay(function() {
      self.pre_game_art[0].visible = true;
    }, 429)

    delay(function() {
      self.pre_game_art[0].visible = false;
      self.pre_game_art[1].visible = true;
    }, 1429)

    delay(function() {
      self.pre_game_art[1].visible = false;
      self.pre_game_art[2].visible = true;
    }, 2429)

    delay(function() {
      self.mode = "game";
      self.pre_game_art[2].visible = false;
      self.pre_game_art[3].visible = true;

      self.start_time = markTime()
      self.timer.visible = true;

      self.makeZombie();
    }, 3429)

    delay(function() {
      self.pre_game_art[3].visible = false;
    }, 4429)
  }


  makeZombie() {
    let layers = this.layers;

    if (this.wave_size >= 0) {
      let z_type = pick(zombies);
      let new_zombie = makeAnimatedSprite("Art/Zombies/" + z_type + ".json", "zombie", layers["zombies"], this.game_width + 100, this.game_height / 2 + 120 + dice(400), 0.5, 0.9);
      if (boy_zombies.includes(z_type)) {
        new_zombie.sound = pick(["boy_zombie_1","boy_zombie_2","boy_zombie_3","boy_zombie_4","boy_zombie_5","boy_zombie_6"])
      } else if (girl_zombies.includes(z_type)) {
        new_zombie.sound = pick(["girl_zombie_1","girl_zombie_2","girl_zombie_3","girl_zombie_4"])
      }
      soundEffect(new_zombie.sound);
      new_zombie.sound_delay = 6000 + dice(10000);
      new_zombie.last_sound = markTime();
      new_zombie.speed = speeds[this.level-1] * (dice(40) + 80) / 100.0
      new_zombie.animationSpeed = new_zombie.speed;
      new_zombie.vx = 0;
      new_zombie.vy = 0;
      new_zombie.play();
      new_zombie.status = "alive";
      this.zombies.push(new_zombie);
      this.wave_size -= 1;
      this.last_zombie = markTime();
      this.next_zombie = zombie_delays[this.level - 1] + dice(2000);

      this.sortZombies();
    }
  }


  sortZombies() {
    this.layers["zombies"].removeChildren();

    this.zombies.sort(function comp(a, b) {
      return (a.y > b.y) ? 1 : -1;
    })

    for (let i = 0; i < this.zombies.length; i++) {
      this.layers["zombies"].addChild(this.zombies[i]);
    }
  }


  readyWeapon() {
    this.weapon.visible = true;
    this.weapon.status = "ready";
    this.weapon.x = this.game_width / 2 - 80;
    this.weapon.y = 140;
    this.weapon.angle = 0;
    this.weapon.scale.set(0.8,0.8);
    this.weapon.letter = pick(letter_array);

    this.letterText.text = this.weapon.letter;
    this.letterTextBacking.text = this.weapon.letter;

    this.panel.visible = true;
    this.letterTextBacking.visible = true;
    this.letterText.visible = true;
  }


  springWeapon() {
    this.weapon.status = "active";
    this.weapon.visible = true;
    this.weapon.scale.set(1,1);
    this.weapon.angle = 0;

    this.panel.visible = false;
    this.letterTextBacking.visible = false;
    this.letterText.visible = false;
  }


  endLevel() {
    this.weapon.visible = false;
    this.panel.visible = false;
    this.letterTextBacking.visible = false;
    this.letterText.visible = false;

    this.successTextBacking.visible = true;
    this.successText.visible = true;
    soundEffect("success");

    this.mode = "finished";
  }


  killZombie() {
    var self = this;

    if (this.weapon.status != "ready") {
      return;
    }
    
    let closest_zombie = null;
    for (let i = 0; i < this.zombies.length; i++) {
      if (this.zombies[i].status == "alive") {
        if (closest_zombie == null || (this.zombies[i].x < closest_zombie.x)) {
          closest_zombie = this.zombies[i];
        }
      }
    }

    if (closest_zombie != null) {
      this.springWeapon();
      this.weapon.x = closest_zombie.x - 100;
      this.weapon.y = closest_zombie.y - 150;

      new TWEEN.Tween(this.weapon)
          .to({angle: -90})
          .easing(TWEEN.Easing.Quartic.Out)
          .duration(400)
          .start();

      delay(function() {
        new TWEEN.Tween(self.weapon)
          .to({angle: 120})
          .easing(TWEEN.Easing.Quartic.Out)
          .duration(200)
          .start();
      }, 400)

      delay(function() {
        closest_zombie.status = "dying";
        freefalling.push(closest_zombie);
        closest_zombie.vy = -15;
        self.weapon.shake = markTime();
        punchSound()
      }, 500)

      delay(function() {
        self.readyWeapon();
      }, 700)


      
      
      
    }
  }

  // initializeFactSheet() {
  //   let left_margin = 140;
  //   let top_margin = 60;
  //   let x_spacing = 120;
  //   let y_spacing = 160;
  //   let counter = 0;

  //   let fact_layer = this.layers["facts"];

  //   while(fact_layer.children[0]) {
  //     let x = fact_layer.removeChild(fact_layer.children[0]);
  //     x.destroy();
  //   }

  //   this.facts = [];

  //   console.log("Game type is " + this.game_type)
  //   let operator = operators[this.game_type];
  //   console.log(operator);

  //   if (operator=== "+") {
  //     this.allowed_time = 240;
  //   } else if (operator=== "-") {
  //     this.allowed_time = 300;
  //   } else if (operator=== "*") {
  //     this.allowed_time = 240;
  //   } else if (operator=== "/") {
  //     this.allowed_time = 360;
  //   } else if (operator === "mixed") {
  //     this.allowed_time = 300;
  //   }
    

  //   for (let j = 0; j < 10; j++) {      
  //     for (let i = 0; i < 10; i++) {

  //       let o = operator;
  //       if (o === "mixed") {
  //         o = pick(["+","-","*","/"]);
  //       }

  //       let a = 0;
  //       let b = 0;
  //       if (o === "+") {
  //         a = dice(10) - 1;
  //         b = dice(10) - 1;
  //       } else if (o === "-") {
  //         a = dice(20);
  //         b = dice(a);
  //       } else if (o === "*") {
  //         a = dice(10);
  //         b = dice(10);
  //       } else if (o === "/") {
  //         let f = dice(7);
  //         b = dice(7);
  //         a = b * f;
  //       } 
        
  //       let p = null;
  //       if (counter % 10 == 0) p = makeText(counter + 1 + ".", this.small_gray_font, fact_layer, left_margin + i * x_spacing - 60, top_margin + j * y_spacing, 1, 0)

  //       this.facts.push({
  //         terms: [a,b],
  //         operator: o,
  //         problem_number: p,
  //         textbox: makeText(a + "\n" + o + " " + b, this.game_font, fact_layer, left_margin + i * x_spacing, top_margin + j * y_spacing, 1, 0),
  //         line: makeBlank(fact_layer, 48, 4, left_margin - 55 + i * x_spacing + 4, top_margin + j * y_spacing + 80, 0x000000),
  //         answerbox: makeText("", this.game_font, fact_layer, left_margin + i * x_spacing, top_margin + j * y_spacing + 90, 1, 0),
  //       });

  //       counter += 1;
  //     }
  //   }
  // }


  // highlightAtCursor() {
  //   for (let i = 0; i < 100; i++) {
  //     if (this.mode == "game" && i == this.cursor) {
  //       this.facts[i].textbox.style = this.highlight_font;
  //       this.facts[i].answerbox.style = this.highlight_font;
  //       this.facts[i].line.tint = this.highlight_color;
  //     } else {
  //       this.facts[i].textbox.style = this.black_font;
  //       this.facts[i].answerbox.style = this.black_font;
  //       this.facts[i].line.tint = 0x000000;
  //     }
  //   }

  //   this.layers["facts"].y = -100 * Math.floor(this.cursor / 10);
  // }


  // checkFinished() {
  //   let finished = true;
  //   for (let i = 0; i < 100; i++) {
  //     if(this.facts[i].answerbox.text.length == 0) finished = false;
  //   }
  //   return finished;
  // }


  // endGame() {
  //   this.mode = "end_game";
  //   stopMusic();
  //   soundEffect("ding");
  //   delay(function() {
  //     soundEffect("ding");
  //   }, 200)
  //   delay(function() {
  //     soundEffect("ding");
  //   }, 400)

  //   let final_time_remaining = Math.ceil(this.allowed_time - timeSince(this.start_time) / 1000)
  //   let minutes_remaining = Math.floor(final_time_remaining / 60);
  //   let seconds_remaining = (final_time_remaining % 60)

  //   this.timer.text = minutes_remaining + ":" + (seconds_remaining < 10 ? "0" + seconds_remaining.toString() : seconds_remaining);
  
  //   // Compute right scores
  //   let correct = 0;
  //   for (let i = 0; i < 100; i++) {
  //     let correct_answer = 0;
  //     let o = this.facts[i].operator;
  //     if (o === "+") {
  //       correct_answer = this.facts[i].terms[0] + this.facts[i].terms[1];
  //     } else if (o === "-") {
  //       correct_answer = this.facts[i].terms[0] - this.facts[i].terms[1];
  //     } else if (o === "*") {
  //       correct_answer = this.facts[i].terms[0] * this.facts[i].terms[1];
  //     } else if (o === "/") {
  //       correct_answer = Math.floor(this.facts[i].terms[0] / this.facts[i].terms[1]);
  //     }
      
  //     let player_answer = parseInt(this.facts[i].answerbox.text);

  //     if (correct_answer == player_answer) correct += 1;

  //     this.score.visible = true;
  //     this.score.text = "Score:\n" + correct + "\n\n"
  //     if (correct < 50) {
  //       this.score.text += "Too Bad"
  //       this.score.style = this.red_font;
  //     } else if (correct < 75) {
  //       this.score.text += "Not Bad"
  //       this.score.style = this.yellow_font;
  //     } else if (correct < 90) {
  //       this.score.text += "Better!"
  //       this.score.style = this.yellow_font;
  //     } else if (correct < 100) {
  //       this.score.text += "Close!"
  //       this.score.style = this.highlight_font
  //     } else if (correct == 100) {
  //       this.score.text += "WINNER!"
  //       this.score.style = this.highlight_font
  //     }
  //   }


  // }



  keyDown(ev) {
    var self = this;

    let key = ev.key;

    if (this.mode == "game") {
      if (key.toUpperCase() === this.weapon.letter) {
        this.killZombie();
      }
    }

    // if (this.mode == "game") {
    //   for (let i = 0; i <= 9; i++) {
    //     if (key === i.toString()) {
    //       soundEffect("keyboard_click_" + dice(5));
    //       this.facts[this.cursor].answerbox.text += i.toString();
    //     }
    //   }

    //   if (key === "Backspace" || key === "Delete") {
    //     soundEffect("swipe");
    //     let t = this.facts[this.cursor].answerbox.text;
    //     this.facts[this.cursor].answerbox.text = t.substring(0,t.length - 1);
    //   }

    //   if (key === " " || key === "ArrowRight") {
    //     soundEffect("tick")
    //     this.cursor += 1;
    //     if (this.cursor > 99) this.cursor = 99;
    //     this.highlightAtCursor();
    //   }

    //   if (key === " ") {
    //     if (this.checkFinished()) {
    //       this.endGame();
    //     }
    //   }

    //   if (key === "Escape") {
    //     this.endGame();
    //   }

    //   if (key === "a" || key === "A") {
    //     console.log("i am here");
    //     if (music_volume > 0) {
    //       music_volume = 0;
    //       current_music.volume(0);
    //     } else {
    //       music_volume = 0.25;
    //       current_music.volume(0.25);
    //     }
    //   }

    //   if (key === "ArrowLeft") {
    //     soundEffect("tick")
    //     this.cursor -= 1;
    //     if (this.cursor < 0) this.cursor = 0;
    //     this.highlightAtCursor();
    //   }
    // } else if (this.mode == "pre_game") {
    //   if (key === "Enter") {
    //     soundEffect("countdown")
    //     this.mode = "countdown";


    //     delay(function() {
    //       self.pre_game_art[0].visible = true;
    //     }, 429)

    //     delay(function() {
    //       self.pre_game_art[0].visible = false;
    //       self.pre_game_art[1].visible = true;
    //     }, 1429)

    //     delay(function() {
    //       self.pre_game_art[1].visible = false;
    //       self.pre_game_art[2].visible = true;
    //     }, 2429)

    //     delay(function() {
    //       self.mode = "game";
    //       self.highlightAtCursor();
    //       setMusic("clockwork_clues");
    //       music_volume = 0;
    //       current_music.volume(0);
    //       self.pre_game_art[2].visible = false;
    //       self.pre_game_art[3].visible = true;

    //       self.start_time = markTime()
    //       self.timer.visible = true;
    //     }, 3429)

    //     delay(function() {
    //       self.pre_game_art[3].visible = false;
    //     }, 4429)


    //     delay(function() {
    //       self.launchBat();
    //     }, 40000 + dice(10000))
    //   } else if (key === "t" || key === "T") {
    //     this.game_type += 1;
    //     if (this.game_type == 5) this.game_type = 0;
    //     this.initializeFactSheet();
    //     this.cursor = 0;
    //     this.highlightAtCursor();
    //   }
    // }
  }


  // launchBat() {
  //   console.log("launching bat");
  //   this.bat.y = this.game_height / 2 - 400 + dice(400);
  //   let d = dice(2);
  //   if(d == 1) {
  //     this.bat.x = -400;
  //     this.bat.target = [this.game_width + 400, this.game_height / 2 - 400 + dice(400)];
  //   } else {
  //     this.bat.x = this.game_width + 400;
  //     this.bat.target = [-400, this.game_height / 2 - 400 + dice(400)];
  //   }
  // }


  // Regular update method
  update(diff) {
    let self = this;
    let fractional = diff / (1000/30.0) * 2;

    // Walk the zombies
    for (let i = 0; i < this.zombies.length; i++) {
      let zombie = this.zombies[i];
      if (zombie.status == "alive") {
        zombie.x -= zombie.speed * 2 * fractional;

        if(timeSince(zombie.last_sound) > zombie.sound_delay) {
          soundEffect(zombie.sound);
          zombie.last_sound = markTime();
        }

      } else if (zombie.status == "dying") {
        zombie.angle += 2;
      }
    }

    // Make new zombies if it's been a while
    if (this.mode == "game") {
      if (timeSince(this.last_zombie) > this.next_zombie) {
        this.makeZombie();
      }

      if (this.wave_size <= 0) {
        let alive_zombies = false;
        for (let i = 0; i < this.zombies.length; i++) {
          let zombie = this.zombies[i];
          if (zombie.status != "dead") {
            // console.log("still alive");
            alive_zombies = true;
          }
        }
        // console.log(alive_zombies);
        if (!alive_zombies) {
          // console.log("done!")
          this.endLevel();
        }
      }


    }

    shakeDamage();
    freeeeeFreeeeeFalling(fractional);


    // if (this.mode == "game") {
    //   if (this.bat.target != null) {
    //     this.bat.x = 0.98 * this.bat.x + 0.02 * this.bat.target[0];
    //     this.bat.y = 0.98 * this.bat.y + 0.02 * this.bat.target[1];
    //     if (distance(this.bat.x, this.bat.y, this.bat.target[0], this.bat.target[1]) < 20) {
    //       this.bat.target = null;
    //       delay(function() {
    //         self.launchBat();
    //       }, 5000 + dice(8000))
    //     }
    //   }
    // } else {
    //   this.bat.x = -400;
    // }


    // if (this.mode == "game") {
    //   this.timer.visible = true;

    //   let time_remaining = Math.ceil(this.allowed_time - timeSince(this.start_time) / 1000)
    //   let minutes_remaining = Math.floor(time_remaining / 60);
    //   let seconds_remaining = (time_remaining % 60)

    //   this.timer.text = minutes_remaining + ":" + (seconds_remaining < 10 ? "0" + seconds_remaining.toString() : seconds_remaining);
    
    //   if (time_remaining <= 0) {
    //     this.endGame();
    //   }
    // }
  }
}

