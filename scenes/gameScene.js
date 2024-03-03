class CenaJogo extends Phaser.Scene {
    constructor() {
      super({
        key: "Jogo",
      });
      this.gameDimensions =  {
        width: 750,
        height: 1334,
      }
    } 
    preload() {
        this.load.image("hero", "assets/hero.png")
        this.load.image("platform", "assets/platform.png")
        this.load.spritesheet("coin", "assets/coin.png", { frameWidth: 66, frameHeight: 57 })
        this.load.image("gameBackground", "assets/gameBackgound.png") 
        this.load.image("tutorial", "assets/tutorial.png")
        this.load.audio("mainTheme", "assets/mainTheme.mp3")
        
    }
  
    create() {
        // global object where to store game options
        this.gameOptions = {
            // first platform vertical position. 0 = top of the screen, 1 = bottom of the screen
            firstPlatformPosition: 6 / 10,
            // game gravity, which only affects the hero
            gameGravity: 1200,
            // hero speed, in pixels per second
            heroSpeed: 300,
            // score points
            scorePoints: 0,
            // platform speed, in pixels per second
            platformSpeed: 190,
            // platform length range, in pixels
            platformLengthRange: [50, 150],
            // platform horizontal distance range from the center of the stage, in pixels
            platformHorizontalDistanceRange: [0, 250],
            // platform vertical distance range, in pixels
            platformVerticalDistanceRange: [150, 300]
        }
        
        // creation of background
        this.physics.pause();

        // add music to be called on startGame()
        this.mainTheme = this.sound.add("mainTheme", { volume: 0.4 });

        this.tutorial = this.add.image(0, 0, "tutorial").setOrigin(0,0).setDepth(1)

        this.input.on("pointerdown", () => this.startGame(), this.mainTheme.play(), this);
        this.input.keyboard.on("keydown", () => this.startGame(), this.mainTheme.play(), this);

        // creation of background
        this.add.image(0, 0, "gameBackground").setOrigin(0,0)

        // creation of the physics group which will contain all platforms
        this.platformGroup = this.physics.add.group();

        // create starting platform
        let platform = this.platformGroup.create(game.config.width / 2, game.config.height * this.gameOptions.firstPlatformPosition, "platform");

        // platform won't physically react to collisions
        platform.setImmovable(true);

        // we are going to create 10 more platforms which we'll reuse to save resources
        for(let i = 0; i < 10; i ++) {

            // platform creation, as a member of platformGroup physics group
            let platform = this.platformGroup.create(0, 0, "platform");

            // platform won't physically react to collisions
            platform.setImmovable(true);

            // position the platform
            this.positionPlatform(platform)
        }

        // add the hero
        this.hero = this.physics.add.sprite(game.config.width / 2, 0, "coin").setScale(1);

        // Cria a animação da moeda
        this.anims.create({
            key: 'rotate',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.hero.anims.play('rotate');

        // 
        this.cursors = this.input.keyboard.createCursorKeys();

        // set hero gravity
        this.hero.body.gravity.y = this.gameOptions.gameGravity;

        // input listener to move the hero
        this.input.on("pointerdown", this.moveHero, this);

        this.input.keyboard.on('keydown-LEFT', this.moveHero, this);
        this.input.keyboard.on('keydown-RIGHT', this.moveHero, this);

        // input listener to stop the hero
        this.input.on("pointerup", this.stopHero, this);

        this.input.keyboard.on('keyup', this.stopHero, this);

        // we are waiting for player first move
        this.firstMove = true;

         // 8) Mostra o placar
         this.scoreText = this.add.text(15, 15, "Pontos: 0", { fontSize: '40px', fill: '#ffffff' });
        //  this.highScoreText = this.add.text(0, 15, 'Máx pontos: ' + this.game.highScore, { fontSize: '20px', fill: '#000', align: 'right' });
        //  this.highScoreText.x = this.game.config.width - this.highScoreText.width - 15;
        //  this.gameControls.restartBt = this.add.image(this.game.config.width / 2 - 50, this.game.config.height / 4 * 3,
        //      'restart').setScale(.2).setOrigin(0, 0).setInteractive().setVisible(false);

    }
    update() {
        // handle collision between ball and platforms
        this.physics.world.collide(this.platformGroup, this.hero, this.scorePoints());

        // loop through all platforms
        this.platformGroup.getChildren().forEach(function(platform) {

            // if hero bottom side is below platform top side and platform size is higher...
            this.heroLowerBounds = this.hero.getBounds().bottom;
            this.platformBounds = platform.getBounds();

            if (this.platformBounds.top < this.heroLowerBounds && platform.isHigher) {
 
                // reset platform body size
                platform.setBodySize(platform.displayWidth / platform.scaleX, platform.displayHeight, false); 
                 
                // platform is no longer higher
                platform.isHigher = false;
            }
            
            // if a platform leaves the stage to the upper side...
            if(platform.getBounds().bottom < 0) {

                // ... recycle the platform
                this.positionPlatform(platform);
            }
        }, this);

        // if the hero gets out of bound side ways
        if(this.hero.x > game.config.width) {
            this.hero.x = 5
        } if (this.hero.x < 0) {
            this.hero.x = game.config.width + 5
        }


        // if the hero falls down or leaves the stage from the top...
        if(this.hero.y > game.config.height || this.hero.y < 0) {

            // restart the scene
            this.scene.start("Jogo");
        }
    }

    startGame() {
        // this.mainTheme.play()
        this.tutorial.destroy()
        this.physics.resume()
    }

    scorePoints() {
        this.points = Math.round((this.gameOptions.scorePoints += 1) / 10);
        this.scoreText.setText("Pontos: " + this.points);
        
    }

    // method to return a random value between index 0 and 1 of a giver array
    randomValue(a) {
        return Phaser.Math.Between(a[0], a[1]);
    }

    // method to move the hero
    moveHero(e) {

        // set hero velocity according to input horizontal coordinate (mouse)
        this.hero.setVelocityX(this.gameOptions.heroSpeed * ((e.x > game.config.width / 2) ? 1 : -1));
        
        //  set hero velocity according to input horizontal coordinate (keyboard)
        if (this.cursors.left.isDown)
            this.hero.setVelocityX(this.gameOptions.heroSpeed * -1);
        else if (this.cursors.right.isDown)
            this.hero.setVelocityX(this.gameOptions.heroSpeed * 1);

        // is it the first move?
        if(this.firstMove) {

            // it's no longer the first move
            this.firstMove = false;

            // move platform group
            this.platformGroup.setVelocityY(-this.gameOptions.platformSpeed);
        }
    }

    // method to stop the hero
    stopHero() {

        // ... just stop the hero :)
        this.hero.setVelocityX(0);
    }

    // method to get the lowest platform, returns the position of the lowest platform, in pixels
    getLowestPlatform() {
        let lowestPlatform = 0;
        this.platformGroup.getChildren().forEach(function(platform) {
            lowestPlatform = Math.max(lowestPlatform, platform.y);
        });
        return lowestPlatform;
    }

    // method to position a platform
    positionPlatform(platform) {

        // vertical position
        platform.y = this.getLowestPlatform() + this.randomValue(this.gameOptions.platformVerticalDistanceRange);

        // horizontal position
        platform.x = game.config.width / 2 + this.randomValue(this.gameOptions.platformHorizontalDistanceRange) * Phaser.Math.RND.sign();

        // platform width
        platform.displayWidth = this.randomValue(this.gameOptions.platformLengthRange);

        // set platform bounding box size to make it way taller than platform sprite
        platform.setBodySize(platform.displayWidth / platform.scaleX, 400, false);
 
        // the platform is higher
        platform.isHigher = true;
    }
  }
  