//
// This file contains the Home Screen for 28 Keys Later.
//
// Copyright 2026 Alpha Zoo LLC.
// Written by Matthew Carlin
//

class HomeScreen extends Screen {
  // Set up the screen
  initialize(width, height) {
    var self = this;
    this.state = null;

    music_volume = 0.6;

    this.game_width = width;
    this.game_height = height;
    this.layers = {};
    let layers = this.layers;
    var self = this;

    layers["background"] = new PIXI.Container();
    this.addChild(layers["background"]);

    layers["buttons"] = new PIXI.Container();
    this.addChild(layers["buttons"]);

    layers["overlay"] = new PIXI.Container();
    this.addChild(layers["overlay"]);

    stopMusic();

    this.background = makeSprite("Art/title_screen.png", layers["background"], 0, 0, 0, 0);

    this.title_typing_button = makeSprite("Art/title_typing_button.png", layers["buttons"], 0, 0, 0, 0);

    this.title_math_button = makeSprite("Art/title_math_button.png", layers["background"], 0, 0, 0, 0);
    this.title_math_button.visible = false;

    this.titleFade = makeBlank(layers["overlay"], this.game_width, this.game_height, 0, 0, 0x000000)
    this.titleFade.alpha = 1

    this.selection = 0;

    this.mode = "selecting";

    new TWEEN.Tween(this.titleFade)
      .to({alpha: 0})
      .easing(TWEEN.Easing.Quartic.Out)
      .duration(2000)
      .start();
  }


  startGame(which_one_though) {
    soundEffect("positive");
    this.mode = "transitioning";
    game.createScreen(which_one_though);
    game.fadeScreens("home_screen", which_one_though, true, 500)
  }
  

  mouseDown(ev) {
    if (this.mode != "selecting") return;
    console.log(ev);
    if (ev.button === 0) {
      let x = ev.x;
      let y = ev.y;
      
      // click between x 160 and x 500, y -80 and y -200 for typing
      // click between x 700 and x 980, y -80 and y -200 for math
      if (x > 160 && x < 500 && y > 900-200 && y < 900-80) {
        this.title_typing_button.visible = true;
        this.title_math_button.visible = false;          
        this.startGame("typing_game")
      } else if (x > 700 && x < 980 && y > 900-200 && y < 900-80) {  
        this.title_typing_button.visible = false;
        this.title_math_button.visible = true; 
        this.startGame("math_game")
      }
    }

  }


  keyDown(ev) {
    var self = this;
    let key = ev.key;

    if (this.mode != "selecting") return;

    if (key === "ArrowRight" || key === "ArrowLeft") {
      if (this.selection == 0) {
        this.selection = 1;
        this.title_typing_button.visible = false;
        this.title_math_button.visible = true;
        soundEffect("pop");
      } else {
        this.selection = 0;
        this.title_typing_button.visible = true;
        this.title_math_button.visible = false;
        soundEffect("tick");
      }
    }

    if (key === "Enter") {
      if (this.selection == 0) {
        this.startGame("typing_game")
      } else {
        this.startGame("math_game")
      }
    }
  }


  // Regular update method
  update(diff) {
  }
}

