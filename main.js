// Cria as configurações para Phaser.Game
const gameDimensions = {
    width: 750,
    height: 1334,
}
const config = {
    type: Phaser.AUTO, // Ajusta o renderizador automaticamente (WebGL e Canvas)
    backgroundColor:0x444444,
    width: gameDimensions.width,  // Ajusta a largura para 1334 pixels (temporário)
    height: gameDimensions.height, // Ajusta a altura
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT // Ajusta a tela para mobile
    },
    scene: [
        MenuPrincipal, CenaJogo
    ],
    
}; 

// Cria o jogo passando a variável config como atributos
const game = new Phaser.Game(config);


