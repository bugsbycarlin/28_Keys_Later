//
// This file contains the root "game" class for Follow Through. This is the starting point.
//
// Copyright 2023 Alpha Zoo LLC.
// Written by Matthew Carlin
//

'use strict';

var log_performance = true;
var performance_result = null;

var first_screen = "typing_game";

var subgames = ["typing_game"];

var pixi = null;
var game = null;

function initialize() {
  game = new Game();  
}

class Game {
  constructor() {
    this.tracking = {};

    this.basicInit();

    this.keymap = {};

    this.freefalling = [];

    // Useful place to load config, such as the map
    //this.content_config_length = Object.keys(content_config).length;

    document.addEventListener("keydown", (ev) => {this.handleKeyDown(ev)}, false);
    document.addEventListener("keyup", (ev) => {this.handleKeyUp(ev)}, false);
    document.addEventListener("mousemove", (ev) => {this.handleMouseMove(ev)}, false);
    document.addEventListener("mousedown", (ev) => {this.handleMouseDown(ev)}, false);
    document.addEventListener("mouseup", (ev) => {this.handleMouseUp(ev)}, false);

    window.onfocus = (ev) => {
      if (this.keymap != null) {
        this.keymap["ArrowDown"] = null;
        this.keymap["ArrowUp"] = null;
        this.keymap["ArrowLeft"] = null;
        this.keymap["ArrowRight"] = null;
      }
    };
    window.onblur = (ev) => {
      if (this.keymap != null) {
        this.keymap["ArrowDown"] = null;
        this.keymap["ArrowUp"] = null;
        this.keymap["ArrowLeft"] = null;
        this.keymap["ArrowRight"] = null;
      }
    };
  }


  basicInit() {
    this.width = 1400;
    this.height = 900;

    // Create the pixi application
    pixi = new PIXI.Application(this.width, this.height, {antialias: true});
    const initPromise = pixi.init({ background: '#EEEEEE', resizeTo: window });
    
    initPromise.then((thing) => {
      document.body.appendChild(pixi.canvas);

      // document.getElementById("mainDiv").appendChild(pixi.view);
      this.renderer = pixi.renderer;
      pixi.renderer.backgroundColor = 0xFFFFFF;
      pixi.renderer.resize(this.width,this.height);
      pixi.renderer.backgroundColor = 0xFFFFFF;

      // Set up rendering and tweening loop
      let ticker = PIXI.Ticker.shared;
      ticker.autoStart = false;
      ticker.stop();

      let fps_counter = 0;
      let last_frame = 0;
      let last_performance_update = 0;

      let animate = now => {
        
        fps_counter += 1;
        let diff = now - last_frame;
        last_frame = now

        if (!this.paused == true) {
          this.trackStart("tween");
          TWEEN.update(now);
          this.trackStop("tween");

          this.trackStart("update");
          this.update(diff);
          this.trackStop("update");

          this.trackStart("animate");
          ticker.update(now);
          pixi.renderer.render(pixi.stage);
          this.trackStop("animate");

          if (now - last_performance_update > 3000 && log_performance) {
            //There were 3000 milliseconds, so divide fps_counter by 3
            // console.log("FPS: " + fps_counter / 3);
            // this.trackPrint(["update", "tween", "animate"]);
            fps_counter = 0;
            last_performance_update = now;
          }
        }
        requestAnimationFrame(animate);
      }
      animate(0);

      this.preloadAnimations(() => {
        this.initializeScreens();
      });
    })

    
  }


  //
  // Tracking functions, useful for testing the timing of things.
  //
  trackStart(label) {
    if (!(label in this.tracking)) {
      this.tracking[label] = {
        start: 0,
        total: 0
      }
    }
    this.tracking[label].start = Date.now();
  }


  trackStop(label) {
    if (this.tracking[label].start == -1) {
      console.log("ERROR! Tracking for " + label + " stopped without having started.")
    }
    this.tracking[label].total += Date.now() - this.tracking[label].start;
    this.tracking[label].start = -1
  }


  trackPrint(labels) {
    var sum_of_totals = 0;
    for (var label of labels) {
      sum_of_totals += this.tracking[label].total;
    }
    for (var label of labels) {
      var fraction = this.tracking[label].total / sum_of_totals;
      console.log(label + ": " + Math.round(fraction * 100).toFixed(2) + "%");
    }
  }


  preloadAnimations(and_then) {
    let Assets = PIXI.Assets;

    Assets.add({ alias: "Wonderbar.otf", src:"Wonderbar.otf", data: { scaleMode: PIXI.SCALE_MODES.NEAREST }});
    Assets.add({ alias: "Komika_Axis.ttf", src:"Komika_Axis.ttf", data: { scaleMode: PIXI.SCALE_MODES.NEAREST }}); 
    Assets.add({ alias: "3", src: "Art/3.png" });
    Assets.add({ alias: "2", src: "Art/2.png" });
    Assets.add({ alias: "1", src: "Art/1.png" });
    Assets.add({ alias: "go", src: "Art/go.png" });
    Assets.add({ alias: "hammer", src: "Art/hammer.png" });
    Assets.add({ alias: "sword", src: "Art/sword.png" });
    Assets.add({ alias: "baseball_bat", src: "Art/baseball_bat.png" });
    Assets.add({ alias: "cricket_bat", src: "Art/cricket_bat.png" });
    Assets.add({ alias: "typing_panel_left", src: "Art/typing_panel_left.png" });
    Assets.add({ alias: "typing_panel_right", src: "Art/typing_panel_right.png" });
    Assets.add({ alias: "typing_panel_middle", src: "Art/typing_panel_middle.png" });
    Assets.add({ alias: "live_heart", src: "Art/live_heart.png" });
    Assets.add({ alias: "dead_heart", src: "Art/dead_heart.png" });
    Assets.add({ alias: "zombie_glyph", src: "Art/zombie_glyph.png" });
    Assets.add({ alias: "success", src: "Art/success.png" });
    Assets.add({ alias: "gameover", src: "Art/gameover.png" });
    Assets.add({ alias: "splash", src: "Art/splash.json" });
    Assets.add({ alias: "level_1_background", src: "Art/level_1_background.png" });
    Assets.add({ alias: "level_2_background", src: "Art/level_2_background.png" });
    Assets.add({ alias: "level_3_background", src: "Art/level_3_background.png" });
    Assets.add({ alias: "level_4_background", src: "Art/level_4_background.png" });
    Assets.add({ alias: "level_5_background", src: "Art/level_5_background.png" });
    Assets.add({ alias: "level_6_background", src: "Art/level_6_background.png" });
    Assets.add({ alias: "level_6_overlay", src: "Art/level_6_overlay.png" });
    Assets.add({ alias: "dotted_line", src: "Art/dotted_line.png" });
    Assets.add({ alias: "zombie_01", src: "Art/Zombies/zombie_01.json" });
    Assets.add({ alias: "zombie_02", src: "Art/Zombies/zombie_02.json" });
    Assets.add({ alias: "zombie_03", src: "Art/Zombies/zombie_03.json" });
    Assets.add({ alias: "zombie_04", src: "Art/Zombies/zombie_04.json" });
    Assets.add({ alias: "zombie_05", src: "Art/Zombies/zombie_05.json" });
    Assets.add({ alias: "zombie_06", src: "Art/Zombies/zombie_06.json" });
    Assets.add({ alias: "zombie_07", src: "Art/Zombies/zombie_07.json" });
    Assets.add({ alias: "zombie_08", src: "Art/Zombies/zombie_08.json" });
    Assets.add({ alias: "zombie_09", src: "Art/Zombies/zombie_09.json" });
    Assets.add({ alias: "zombie_10", src: "Art/Zombies/zombie_10.json" });
    Assets.add({ alias: "zombie_11", src: "Art/Zombies/zombie_11.json" });
    Assets.add({ alias: "zombie_12", src: "Art/Zombies/zombie_12.json" });
    Assets.add({ alias: "zombie_13", src: "Art/Zombies/zombie_13.json" });
    Assets.add({ alias: "zombie_14", src: "Art/Zombies/zombie_14.json" });
    Assets.add({ alias: "zombie_15", src: "Art/Zombies/zombie_15.json" });
    Assets.add({ alias: "zombie_16", src: "Art/Zombies/zombie_16.json" });
    Assets.add({ alias: "zombie_17", src: "Art/Zombies/zombie_17.json" });
    Assets.add({ alias: "zombie_approach", src: "Art/zombie_approach.mp4" });
    Assets.add({ alias: "zombie_dance", src: "Art/zombie_dance.mp4" });

    const assetsPromise = Assets.load(
      ["3","2","1","go",
      "hammer","sword","cricket_bat","baseball_bat",
      "typing_panel_left","typing_panel_right","typing_panel_middle",
      "live_heart","dead_heart","zombie_glyph", "splash",
      "success","gameover",
      "Wonderbar.otf",
      "Komika_Axis.ttf", // this might have been why it wasn't working on the other computer
      "level_1_background",
      "level_2_background",
      "level_3_background",
      "level_4_background",
      "level_5_background",
      "level_6_background",
      "level_6_overlay",
      "dotted_line",
      "zombie_01","zombie_02","zombie_03","zombie_04","zombie_05",
      "zombie_06","zombie_07","zombie_08","zombie_09","zombie_10",
      "zombie_11","zombie_12","zombie_13","zombie_14","zombie_15",
      "zombie_16","zombie_17",
      "zombie_approach", "zombie_dance"
      ],
    );
    assetsPromise.then((assets) => {
      console.log("the assets");
      console.log(assets);
      and_then();
    });
  }


  handleMouseMove(ev) {
    if (this.screens != null
      && this.current_screen != null
      && this.screens[this.current_screen].mouseMove != null) {
      this.screens[this.current_screen].mouseMove(ev);
    }
  }


  handleMouseDown(ev) {
    if (this.screens != null
      && this.current_screen != null
      && this.screens[this.current_screen].mouseDown != null) {
      this.screens[this.current_screen].mouseDown(ev);
    }
  }


  handleMouseUp(ev) {
    console.log("le clicks")
    if (this.screens != null
      && this.current_screen != null
      && this.screens[this.current_screen].mouseUp != null) {
      this.screens[this.current_screen].mouseUp(ev);
    }
  }


  handleKeyUp(ev) {
    ev.preventDefault();

    this.keymap[ev.key] = null;

    if (this.screens != null
      && this.current_screen != null
      && this.screens[this.current_screen].keyUp != null) {
      this.screens[this.current_screen].keyUp(ev);
    }
  }


  handleKeyDown(ev) {
    if (ev.key === "Tab") {
      ev.preventDefault();
    }

    this.keymap[ev.key] = true;

    if (this.screens != null
      && this.current_screen != null
      && this.screens[this.current_screen].keyDown != null) {
      this.screens[this.current_screen].keyDown(ev);
    }
  }


  update(diff) {
    if (this.screens != null && this.current_screen != null) {
      this.screens[this.current_screen].update(diff);
    }
  }
}
