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
  0.5, 0.7, 0.9
  ]

let waves = [
  5, 7,
  9, 11,
  13, 15,
  17, 19,
  21, 23, 75
  ]

let hp = [
  8, 8,
  7, 7,
  6, 6,
  5, 5,
  4, 4, 4
]

let zombie_delays = [
  2500,2300,
  2100,1900,
  1700,1500,
  1300,1100,
  900,700,200
  ]

let music_for = [
  "Level1","Level1",
  "Level2","Level2",
  "Level3","Level3",
  "Level4","Level4",
  "Level5","Level5","Level5"
]

class TypingGame extends Screen {
  // Set up the screen
  initialize(width, height) {
    var self = this;
    this.state = null;

    music_volume = 0.6;

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

    this.loadLevel(11);
  }

  loadLevel(level_number) {
    var self = this;

    stopMusic();
    this.level = level_number

    let layers = this.layers;

    layers["background"].removeChildren();
    layers["zombies"].removeChildren();
    layers["overlay"].removeChildren();
    
    let overlay = layers["overlay"];

    this.background = makeSprite("Art/level_" + Math.ceil(Math.min(this.level,10)/2) + "_background.png", layers["background"], this.game_width / 2, this.game_height / 2, 0.5, 0.5),

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
    this.weapon.visible = false;

    this.zombies = [];

    this.wave_size = waves[this.level-1] + dice(6);

    this.hp = hp[this.level-1];
    this.hearts = [];
    for (let i = 0; i < this.hp; i++) {
      console.log(i);
      let dead_heart = makeSprite("Art/dead_heart.png", overlay, 5 + 100 * (i % 4), -12 + 84*Math.floor(i/4), 0, 0);
      let live_heart = makeSprite("Art/live_heart.png", overlay, 5 + 100 * (i % 4), -12 + 84*Math.floor(i/4), 0, 0);
      this.hearts.push([live_heart,dead_heart]);
    }

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

    this.last_zombie = markTime();
    this.next_zombie = 500;
    this.start_time = markTime()
    
    // setMusic(pick(["Level1","Level2","Level3","Level4","Level5"]));
    setMusic(music_for[this.level-1])

    this.countDownThenStart();
    this.mode = "game";
    delay(function() {
      self.readyWeapon();
    }, 3500);
  }


  countDownThenStart() {
    var self = this;

    // soundEffect("countdown")
    this.mode = "countdown";
    delay(function() {
      self.pre_game_art[0].visible = true;
    }, 500)

    delay(function() {
      self.pre_game_art[0].visible = false;
      self.pre_game_art[1].visible = true;
    }, 1500)

    delay(function() {
      self.pre_game_art[1].visible = false;
      self.pre_game_art[2].visible = true;
    }, 2500)

    delay(function() {
      self.mode = "game";
      self.pre_game_art[2].visible = false;
      self.pre_game_art[3].visible = true;

      self.start_time = markTime()

      self.makeZombie();
    }, 3500)

    delay(function() {
      self.pre_game_art[3].visible = false;
    }, 4500)
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
    if (this.mode != "game") return;

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
        let some_alive = false;
        for (let i = 0; i < self.zombies.length; i++) {
          let zombie = self.zombies[i];
          if (zombie.status == "alive") {
            some_alive = true;
          }
        }
        if (self.wave_size > 0 || some_alive) self.readyWeapon();
      }, 700)
    }
  }



  checkLevelEnd() {
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

  endLevel() {
    var self = this;
    this.weapon.visible = false;
    this.panel.visible = false;
    this.letterTextBacking.visible = false;
    this.letterText.visible = false;

    this.successTextBacking.visible = true;
    this.successText.visible = true;
    soundEffect("success");

    this.mode = "finished";

    if (this.level < 10) {
      delay(function() {
        self.loadLevel(self.level + 1)
      }, 3000)
    };
  }


  keyDown(ev) {
    var self = this;

    let key = ev.key;

    if (this.mode == "game") {
      if (key.toUpperCase() === this.weapon.letter) {
        this.killZombie();
      }

      if (key === "Backspace" || key === "Delete") {
        this.loadLevel(this.level + 1);
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

      this.checkLevelEnd();
    }

    shakeDamage();
    freeeeeFreeeeeFalling(fractional);
  }
}

