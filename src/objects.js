module.exports = { 
    //objeto da tabela jpu 
    jpu: class {
        constructor(ID_USUARIO, NOME_JOGO, DATA) {
            this.ID_USUARIO = ID_USUARIO,
                this.NOME_JOGO = NOME_JOGO,
                this.DATA = DATA,
                this.GUILDA = GUILDA;
        }
    },

    copypasta: class {
        constructor(NOME_PASTA, TEXTO) {
            this.NOME_PASTA = NOME_PASTA,
                this.TEXTO = TEXTO;
        }
    },

    //objeto do sql personalizado para exibição do top jogos
    jputop: class {
        constructor(NOME_JOGO, QTDE) {
            this.QTDE = QTDE,
                this.NOME_JOGO = NOME_JOGO;
        }
    },

    //objeto da tabela aliases
    aliases: class {
        constructor(alias, NOME_JOGO) {
            this.alias = alias,
                this.NOME_JOGO = NOME_JOGO;
        }
    },

    //objeto da tabela greetings
    greetings: class {
        constructor(GUILDA, DATA, TIPO) {
            this.GUILDA = GUILDA,
                this.TIPO = TIPO,
                this.DATA = DATA;
        }
    },

    //objeto da tabela senpi
    senpi: class {
        constructor(QUITADAS) {
            this.QUITADAS = QUITADAS;
        }
    },

    //objeto da tabela cooldown
    cooldown: class {
        constructor(GUILDA, DATA, COMANDO) {
            this.GUILDA = GUILDA,
                this.DATA = DATA,
                this.COMANDO = COMANDO;
        }
    },

    //objeto da tabela img
    img: class {
        constructor(ID_MSG, ID_USER, ID_GUILD, NOME_PESQ, NRO_ATUAL, NRO_MAX) {
            this.ID_MSG = ID_MSG,
                this.ID_USER = ID_USER,
                this.ID_GUILD = ID_GUILD,
                this.NOME_PESQ = NOME_PESQ,
                this.NRO_ATUAL = NRO_ATUAL,
                this.NRO_MAX = NRO_MAX;
        }
    },

    //objeto do numero de mortes
    morte: class {
        constructor(id_user, num_morte, num_tentativas, guilda) {
            this.id_user = id_user;
            this.num_morte = num_morte;
            this.num_tentativas = num_tentativas;
            this.guilda = guilda;
        }
    }
}