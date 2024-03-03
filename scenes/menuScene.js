class MenuPrincipal extends Phaser.Scene {
  constructor() {
    super({
      key: "Menu",
    })
  }
  preload() {
    this.load.image("background", "assets/fundoMenu.png") // Fundo da cena do Main Menu
    this.load.image("botaoJogar", "assets/startButton.png") // Botão da cena do Main Menu

  }

  create() {
    // Carrega os elementos da cena Main Menu
    this.background = this.add.image(0, 0, "background").setScale(1).setOrigin(0,0)
    this.botaoJogar = this.add.sprite(350, 650, "botaoJogar").setInteractive().setScale(1)
    
    // Ajuste visual da imagem do mouse para fornecer feedback que o botão jogar é interativo
    this.botaoJogar.on("pointerover", () => {
      // Evento de passar o mouse sobre o botaoJogar
      this.input.setDefaultCursor("pointer") // Cursor vira mãozinha
    })
    this.botaoJogar.on("pointerout", () => {
      // Evento de retirar o mouse do botaoJogar
      this.input.setDefaultCursor("default") // Cursor vira setinha
    })

    // Evento disparado ao clicar no botão
    this.botaoJogar.on("pointerdown", () => { // Evento de click do mouse
      this.scene.start("Jogo")
      this.scene.stop('Menu')
      this.input.setDefaultCursor("default") // Retorno do cursor do mouse para setinha
      // this.openFullScreen() // Essa linha pode ser ativada ou não
      // Deixei ela off para não incomodar o usuário ao tentar acessar o gameww
    })
  }

  update() {}
  openFullScreen() { // Cria toda a lógica de fullscreen (ver acima)
    const page = document.documentElement //Pega o documento inteiro
    if (page.requestFullscreen){ //Se o navegador suportar o Fullscreen
        page.requestFullscreen() //Ativa o Fullscreen
    } else if (page.mozRequestFullScreen){ //Se o navegador suportar o Fullscreen do Mozila
        page.mozRequestFullScreen() //Ativa o Fullscreen
    } else if (page.webkitRequestFullscreen){ //Se o navegador suportar o Fullscreen do Webkit
        page.webkitRequestFullscreen() //Ativa o wFullscreen
    } else if (page.msRequestFullscreen){ //Se o navegador suportar o Fullscreen do Microsoft
        page.msRequestFullscreen() //Ativa o Fullscreen
    }
  }
}
