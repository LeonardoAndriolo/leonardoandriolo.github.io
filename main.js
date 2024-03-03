// Cria as configurações para Phaser.Game
const gameDimensions = {
    width: 750, // Define largura
    height: 1334, // Define altura
}
const config = {
    type: Phaser.AUTO, // Ajusta o renderizador automaticamente (WebGL e Canvas)
    backgroundColor:0x444444,
    width: gameDimensions.width,
    height: gameDimensions.height, 
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


