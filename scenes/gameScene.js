class CenaJogo extends Phaser.Scene {
    constructor() {
      super({
        key: "Jogo",
      })
    } 
    preload() {
        this.load.image("platform", "assets/platform.png")
        this.load.image("gameBackground", "assets/gameBackgound.png") 
        this.load.image("tutorial", "assets/tutorial.png")
        this.load.spritesheet("coin", "assets/coin.png", { frameWidth: 66, frameHeight: 57 })
        this.load.audio("mainTheme", "assets/mainTheme.mp3")
    }
  
    create() {
        this.game.scale.on('orientationchange', function(orientation) {
            if (orientation === Phaser.Scale.LANDSCAPE) {
                this.scene.scale.orientation = Phaser.Scale.PORTRAIT
            }
        })


        // Elemento que garda algumas configurações de jogo
        this.gameOptions = {
            // Distância da primeira plataforma. 0 = parte de cima, 1 = parte de baixo
            firstPlatformPosition: 6 / 10,
            // Gravidade que afeta apenas a moeda
            gameGravity: 1200,
            // Velocidade da moeda, em pixels/segundo
            coinSpeed: 300,
            // Pontuação
            scorePoints: 0,
            // Velocidade das plataformas, em pixels/segundo
            platformSpeed: 190,
            // Distância das plataformas, em pixels
            platformLengthRange: [50, 150],
            // Distância horizontal das plataformas até o centro do cenário, em pixels
            platformHorizontalDistanceRange: [0, 250],
            // Distância vertical das plataformas, em pixels
            platformVerticalDistanceRange: [150, 300]
        }
        
        // Inicializa a física pausada
        this.physics.pause();

        // Adiciona a música
        this.mainTheme = this.sound.add("mainTheme", { volume: 0.4 });

        // Exibe a imagem do tutorial
        this.tutorial = this.add.image(0, 0, "tutorial").setOrigin(0,0).setDepth(1)

        // Evento que inicia o jogo com clique ou pressionado de uma tecla e começa a música
        this.input.on("pointerdown", () => this.startGame(), this.mainTheme.play(), this);
        this.input.keyboard.on("keydown", () => this.startGame(), this.mainTheme.play(), this);

        // Cria o fundo
        this.add.image(0, 0, "gameBackground").setOrigin(0,0)

        // Cria a física para o grupo de plataformas
        this.platformGroup = this.physics.add.group();

        // Define a posição da primeira plataforma
        let platform = this.platformGroup.create(game.config.width / 2, game.config.height * this.gameOptions.firstPlatformPosition, "platform");

        // Desabilita o deslocamento das plataformas por colisão
        platform.setImmovable(true);

        // Cria a lógica de 10 plataformas
        for(let i = 0; i < 10; i ++) {
            let platform = this.platformGroup.create(0, 0, "platform");
            platform.setImmovable(true);
            // Chama o método positionPlatform, para ajustar seus pontos spawns/aparecimento
            this.positionPlatform(platform)
        }

        // Adiciona nosso personagem, a Moeda
        this.coin = this.physics.add.sprite(game.config.width / 2, 0, "coin")

        // Cria a animação da moeda e inicializa ela
        this.anims.create({
            key: 'rotate',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.coin.anims.play('rotate');

        // Adiciona as setas de movimentação
        this.cursors = this.input.keyboard.createCursorKeys();

        // Define a gravidade para moeda
        this.coin.body.gravity.y = this.gameOptions.gameGravity;

        // Adiciona o input para mover pelo mouse
        this.input.on("pointerdown", this.movecoin, this);

        // Adiciona o input para mover pelo teclado
        this.input.keyboard.on('keydown-LEFT', this.movecoin, this);
        this.input.keyboard.on('keydown-RIGHT', this.movecoin, this);

        // Adiciona o input para parar a moeda
        this.input.on("pointerup", this.stopcoin, this);
        this.input.keyboard.on('keyup', this.stopcoin, this);

        // Booleano de verificação de início da movimentação
        this.firstMove = true;

        // Inicializa o texto do placar
        this.scoreText = this.add.text(15, 15, "Pontos: 0", { fontSize: '40px', fill: '#ffffff' });
    }
    update() {
        // Adiciona a colisão entre plataformas e moeda e chama o método que conta os pontos
        this.physics.world.collide(this.platformGroup, this.coin, this.scorePoints());

        // forEach é um for que passa por todos os elementos, no caso, plataformas
        this.platformGroup.getChildren().forEach(function(platform) {

            // Define alguns limites/bordas
            this.coinLowerBounds = this.coin.getBounds().bottom;
            this.platformBounds = platform.getBounds();
            // Se a parte de baixo da moeda estiver abaixo do topo da plataforma e a posição da plataforma for acima
            if (this.platformBounds.top < this.coinLowerBounds && platform.isHigher) {
 
                // Reseta o tamanho da plataforma
                platform.setBodySize(platform.displayWidth / platform.scaleX, platform.displayHeight, false); 
                 
                // Muda o valor de isHigher das plataformas 
                platform.isHigher = false;
            }
            
            // Se a plataforma sai pela parte de cima do cenário
            if(platform.getBounds().bottom < 0) {

                // Ela é reciclada e reposicionada
                this.positionPlatform(platform);
            }
        }, this);

        // Lógica para reposicionar a moeda de volta ao cenário caso saia pelos lados
        if(this.coin.x > game.config.width) {
            this.coin.x = 5
        } if (this.coin.x < 0) {
            this.coin.x = game.config.width + 5
        }


        // Evento de gameover/restart, se a moeda passar do fundo ou sair por cima
        if(this.coin.y > game.config.height || this.coin.y < 0) {

            // Reseta a cena
            this.scene.start("Jogo");
        }
    }

    startGame() { // Método para iniciar o game, criado para destruir tutorial e reativar a física
        // this.mainTheme.play()
        this.tutorial.destroy()
        this.physics.resume()
    }

    scorePoints() { // Método para contar os pontos e atualizar o placar
        this.points = Math.round((this.gameOptions.scorePoints += 1) / 10);
        this.scoreText.setText("Pontos: " + this.points);
        
    }

    randomValue(a) { // Método para randomizar um número entre um índice 0 e 1 de uma lista
        return Phaser.Math.Between(a[0], a[1]);
    }

    movecoin(e) { // Método de movimentação da moeda

        // Ajusta a velocidade da moeda horizontalmente (mouse)
        this.coin.setVelocityX(this.gameOptions.coinSpeed * ((e.x > game.config.width / 2) ? 1 : -1));
        
        //  Ajusta a velocidade da moeda horizontalmente (keyboard)
        if (this.cursors.left.isDown)
            this.coin.setVelocityX(this.gameOptions.coinSpeed * -1);
        else if (this.cursors.right.isDown)
            this.coin.setVelocityX(this.gameOptions.coinSpeed * 1);

        // Checa o valor de firstMove
        if(this.firstMove) {

            // Desabilita em caso verdadeiro
            this.firstMove = false;

            // Inicia a movimentação das plataformas
            this.platformGroup.setVelocityY(-this.gameOptions.platformSpeed);
        }
    }

    stopcoin() { // Método para parar a moeda
        this.coin.setVelocityX(0);
    }

    getLowestPlatform() { // Método para pegar a plataforma mais baixa e retornar sua posição, em pixels
        let lowestPlatform = 0;
        this.platformGroup.getChildren().forEach(function(platform) {
            lowestPlatform = Math.max(lowestPlatform, platform.y);
        });
        return lowestPlatform;
    }

    positionPlatform(platform) { // Método para posicionar as plataformas

        // Posição vertical
        platform.y = this.getLowestPlatform() + this.randomValue(this.gameOptions.platformVerticalDistanceRange);

        // Posição horizontal
        platform.x = game.config.width / 2 + this.randomValue(this.gameOptions.platformHorizontalDistanceRange) * Phaser.Math.RND.sign();

        // Largura
        platform.displayWidth = this.randomValue(this.gameOptions.platformLengthRange);

        // Ajusta a colisão das plataformas para evitar que a moeda passe por elas caso muito rápida
        platform.setBodySize(platform.displayWidth / platform.scaleX, 400, false);
 
        // Muda o valor de isHigher das plataformas para verdadeiro
        platform.isHigher = true;
    }
  }
  