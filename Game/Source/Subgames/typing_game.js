//
// This file contains the one and only screen for the application.
// This is the meat of the program.
//
// Copyright 2024 Alpha Zoo LLC.
// Written by Matthew Carlin
//

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

    layers["damage_flash"] = new PIXI.Container();
    this.addChild(layers["damage_flash"]);

    layers["success_or_gameover"] = new PIXI.Container();
    this.addChild(layers["success_or_gameover"]);

    this.loadLevel(starting_level);
  }

  loadLevel(level_number) {
    var self = this;

    stopMusic();
    this.level = level_number

    let layers = this.layers;

    layers["background"].removeChildren();
    layers["zombies"].removeChildren();
    layers["overlay"].removeChildren();
    layers["success_or_gameover"].removeChildren();
    
    let overlay = layers["overlay"];

    this.background = makeSprite("Art/level_" + Math.ceil(this.level/2) + "_background.png", layers["background"], this.game_width / 2, this.game_height / 2, 0.5, 0.5);
    this.dotted_line = makeSprite("Art/dotted_line.png", layers["background"], this.game_width / 2, this.game_height / 2, 0.5, 0.5);

    if (this.level == 7 || this.level == 8) {
      this.dotted_line.tint = 0xCCCCCC;
    }


    if (this.level == 11) {
      this.background.y -= 40;
      this.background_overlay =  makeSprite("Art/level_6_overlay.png", layers["overlay"], this.game_width / 2, this.game_height / 2+10, 0.5, 0.5)
      this.background_overlay.scale.set(1.1,1.1)
    }

    this.damage_flash = makeBlank(layers["damage_flash"], this.game_width, this.game_height, 0, 0, 0xFF0000)
    this.damage_flash.alpha = 0

    // this.highlight_color = 0x33CC33;

    this.black_font = {fontFamily: "Komika Axis", fontSize: 144, fontWeight: 200, fill: 0x000000, letterSpacing: 10, align: "right"};    
    this.red_font = {fontFamily: "Komika Axis", fontSize: 144, fontWeight: 200, fill: 0xDD3333, letterSpacing: 10, align: "right"}; 
    this.blue_font = {fontFamily: "Komika Axis", fontSize: 144, fontWeight: 200, fill: 0x3E6294, letterSpacing: 10, align: "right"};    
    this.white_font = {fontFamily: "Komika Axis", fontSize: 144, fontWeight: 200, fill: 0xFFFFFF, letterSpacing: 10, align: "right"};    
    this.yellow_font = {fontFamily: "Komika Axis", fontSize: 144, fontWeight: 200, fill: 0xDBCC79, letterSpacing: 10, align: "right"}; 
    this.small_white_font = {fontFamily: "Komika Axis", fontSize: 54, fontWeight: 200, fill: 0xFFFFFF, letterSpacing: 10, align: "right"};    
    
    //old blue 0x3333DD

    let word = pick(word_lists[this.level - 1]);
    this.panel = makeContainer(layers["overlay"], this.game_width / 2 - 10, 10);
    let panel_left = makeSprite("Art/typing_panel_left.png", this.panel, 0 - 192 - 48 * word.length, 0, 0);
    let panel_right = makeSprite("Art/typing_panel_right.png", this.panel, 48 * word.length, 0, 0);
    for (let i = 0; i < word.length; i++) {
      let panel_middle = makeSprite("Art/typing_panel_middle.png", this.panel, -48 * word.length + 96 * i, 0, 0);
      panel_middle.scale.set(0.75,1);
    }

    this.letterTextBacking = makeText("K", this.black_font, overlay, this.game_width / 2 + 24 - 8 - 48 * word.length, 190, 0, 1);
    this.letterText = makeText("K", this.white_font, overlay, this.game_width / 2 + 24 - 48 * word.length, 190, 0, 1);
    this.letterText.tint = 0x3E6294;
    this.panel.visible = false;
    this.letterTextBacking.visible = false;
    this.letterText.visible = false;

    this.successBackground = makeSprite("Art/success.png", layers["success_or_gameover"], this.game_width / 2, this.game_height / 2 - 30, 0.5, 0.5);
    this.successBackground.scale.set(0.62,0.62);
    this.successBackground.visible = false;

    this.successTextBacking = makeText("SUCCESS!", this.black_font, layers["success_or_gameover"], this.game_width / 2, this.game_height / 2 - 200, 0.5, 0.5);
    this.successText = makeText("SUCCESS!", this.blue_font, layers["success_or_gameover"], this.game_width / 2 + 8, this.game_height / 2 - 200, 0.5, 0.5);
    this.successTextBacking.visible = false;
    this.successText.visible = false;

    this.gameoverBackground = makeSprite("Art/gameover.png", layers["success_or_gameover"], this.game_width / 2, this.game_height / 2 - 30, 0.5, 0.5);
    this.gameoverBackground.scale.set(0.62,0.62);
    this.gameoverBackground.visible = false;

    this.gameoverTextBacking = makeText("GAME OVER!", this.black_font, layers["success_or_gameover"], this.game_width / 2, this.game_height / 2 - 200, 0.5, 0.5);
    this.gameoverText = makeText("GAME OVER!", this.red_font, layers["success_or_gameover"], this.game_width / 2 + 8, this.game_height / 2 - 200, 0.5, 0.5);
    this.gameoverTextBacking.visible = false;
    this.gameoverText.visible = false;

    this.weapon = makeSprite("Art/" + weapons[this.level-1] + ".png", layers["overlay"], this.game_width / 2 + 24 - 48 * (word.length+1), this.game_height / 2 - 300, 0.5, 0.5)
    this.weapon.scale.set(0.8,0.8);
    shakers.push(this.weapon);
    this.weapon.visible = false;


    this.zombies = [];

    this.wave_size = waves[this.level-1] + dice(6);
    this.remaining_zombies = this.wave_size + 1;

    this.zombieCountTextBacking = makeText(" " + this.remaining_zombies + " ", this.small_white_font, overlay, this.game_width - 94, 0, 0.5, 0);
    this.zombieCountTextBacking.tint = 0x000000;
    this.zombieCountText = makeText(" " + this.remaining_zombies + " ", this.small_white_font, overlay, this.game_width - 90, 0, 0.5, 0);
    this.zombieGlyphBacking = makeSprite("Art/zombie_glyph.png", overlay, this.game_width - 8, 5, 1, 0);
    this.zombieGlyphBacking.scale.set(0.25,0.25);
    this.zombieGlyphBacking.tint = 0x000000;
    this.zombieGlyph = makeSprite("Art/zombie_glyph.png", overlay, this.game_width - 4, 5, 1, 0);
    this.zombieGlyph.scale.set(0.25,0.25);

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
      self.enableWeapon();
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
      new_zombie.pre_dead = false;
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


  enableWeapon() {
    var self = this;

    if (this.mode != "game") return;

    // check for zombies across the line. if there aren't any,
    // don't ready the weapon, but do check again in a bit.
    let zombies_over_the_line = false;
    for (let i = 0; i < this.zombies.length; i++) {
      let zombie = this.zombies[i];
      if (zombie.pre_dead == false && zombie.status == "alive" && zombie.x < (1160 + 120 / 400 * (zombie.y - (this.game_height - 400)))) {
        zombies_over_the_line = true;
      }
    }
    if (!zombies_over_the_line) {
      this.disableWeapon();
      delay(function() {
        self.enableWeapon();
      }, 250);
      return;
    }

    this.weapon.visible = true;
    this.weapon.status = "ready";
    this.weapon.word = pick(word_lists[this.level - 1]);
    this.weapon.letter_count = 0;

    this.letterText.text = " " + this.weapon.word.substring(0, this.weapon.letter_count) + " ";
    this.letterTextBacking.text = " " + this.weapon.word + " ";

    this.panel.visible = true;
    this.letterTextBacking.visible = true;
    this.letterText.visible = true;
  }


  disableWeapon() {
    this.weapon.status = "not ready";
    this.weapon.visible = false;
    this.panel.visible = false;
    this.letterTextBacking.visible = false;
    this.letterText.visible = false;
  }

  killZombie() {
    var self = this;
    let layers = this.layers;

    if (this.weapon.status != "ready") {
      return;
    }
    
    let closest_zombie = null;
    for (let i = 0; i < this.zombies.length; i++) {
      if (this.zombies[i].status == "alive" && this.zombies[i].pre_dead == false) {
        if (closest_zombie == null || (this.zombies[i].x < closest_zombie.x)) {
          closest_zombie = this.zombies[i];
        }
      }
    }

    if (closest_zombie != null) {
      this.weapon.status = "not ready";
      soundEffect("positive");
      flicker(this.letterText, 100, 0x3E6294, 0xA1D99E)
      delay(function() {
        self.enableWeapon();
        self.letterText.tint = 0x3E6294;
      }, 100)

      closest_zombie.pre_dead = true;

      let new_weapon = makeSprite("Art/" + weapons[this.level-1] + ".png", layers["overlay"], closest_zombie.x - 100, closest_zombie.y - 150, 0.5, 0.5)
      shakers.push(new_weapon);

      new_weapon.angle = 0;

      new TWEEN.Tween(new_weapon)
          .to({angle: -90})
          .easing(TWEEN.Easing.Quartic.Out)
          .duration(400)
          .start();

      delay(function() {
        new TWEEN.Tween(new_weapon)
          .to({angle: 120})
          .easing(TWEEN.Easing.Quartic.Out)
          .duration(200)
          .start();
      }, 400)

      delay(function() {
        closest_zombie.status = "dying";
        self.dropCount();
        freefalling.push(closest_zombie);
        closest_zombie.vy = -15;
        new_weapon.shake = markTime();
        punchSound()
      }, 500)

      delay(function() {
        layers["overlay"].removeChild(new_weapon);
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
        this.winLevel();
      }
    }
  }


  winLevel() {
    var self = this;

    if (this.mode =- "finished") return;

    stopMusic();

    this.weapon.visible = false;
    this.panel.visible = false;
    this.letterTextBacking.visible = false;
    this.letterText.visible = false;

    this.successTextBacking.visible = true;
    this.successText.visible = true;
    this.successBackground.visible = true;
    soundEffect("success");

    this.mode = "finished";

    if (this.level < 10) {
      delay(function() {
        self.loadLevel(self.level + 1)
      }, 4000)
    } else {
      this.successText.text = "YOU SURVIVED!\nTHE END"
      this.successTextBacking.text = "YOU SURVIVED!\nTHE END"
    }
  }


  loseLevel() {
    var self = this;

    if (this.mode == "finished") return;

    stopMusic();

    this.weapon.visible = false;
    this.panel.visible = false;
    this.letterTextBacking.visible = false;
    this.letterText.visible = false;

    this.gameoverTextBacking.visible = true;
    this.gameoverText.visible = true;
    this.gameoverBackground.visible = true;
    soundEffect("gameover");

    this.mode = "finished";

    if (this.level < 10) {
      delay(function() {
        self.loadLevel(self.level)
      }, 6000)
    };
  }


  hurtPlayer() {
    var self = this;
    let layers = this.layers;

    if (this.hp <= 1) {
      this.loseLevel();
      return;
    }

    soundEffect("hurt");

    this.damage_flash.alpha = 1
    new TWEEN.Tween(this.damage_flash)
          .to({alpha: 0})
          .easing(TWEEN.Easing.Quartic.Out)
          .duration(200)
          .start();

    this.hp -= 1;
    layers["overlay"].removeChild(this.hearts[this.hp][0]);
  }

  dropCount() {
    this.remaining_zombies -= 1;
    this.zombieCountTextBacking.text = " " + this.remaining_zombies + " ";
    this.zombieCountText.text = " " + this.remaining_zombies + " ";
  }


  keyDown(ev) {
    var self = this;

    let key = ev.key;

    if (this.mode == "game") {
      console.log(this.weapon.word[0]);

      if (this.weapon.letter_count < this.weapon.word.length) {
        console.log("hey");
        let next_letter = this.weapon.word[this.weapon.letter_count]
        console.log(key.toLowerCase());
        console.log(next_letter);
        if (key.toLowerCase() == next_letter.toLowerCase()) {
          console.log("oh");
          this.weapon.letter_count += 1;
          this.letterText.text = " " + this.weapon.word.substring(0, this.weapon.letter_count) + " ";
        
          if (this.weapon.letter_count == this.weapon.word.length) {
            this.killZombie();
          }
        }
      }

      // if (key.toLowerCase() === this.weapon.word[0]) {
      //   this.killZombie();
      // }

      // if (key === "Backspace" || key === "Delete") {
      //   this.loadLevel(this.level + 1);
      // }
    }
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

        // if the zombie gets across the screen, kill the zombie and hurt the player
        if (zombie.x < -60) {
          zombie.status = "dying";
          this.dropCount();
          freefalling.push(zombie);
          makeSplash(this.layers["overlay"], zombie.x + 60, zombie.y, 1, 1)
          zombie.x = -300;
          zombie.vy = -15;
          this.hurtPlayer();
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

