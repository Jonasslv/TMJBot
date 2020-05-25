
//TO-DO : comentar melhor o código

const chalk = require('chalk');
console.log(chalk.yellow('------------------------------------------------------'));
console.log(chalk.red('Carregou a lib chalk.'));

const { Client } = require('discord.js');
console.log(chalk.red('Carregou a lib discord.js.'));

const { request } = require('https');
console.log(chalk.red('Carregou a lib https.'));

const sqlite3 = require('sqlite3').verbose();
console.log(chalk.red('Carregou a lib sqlite3.'));

const { readFileSync, writeFile, exists, readdir } = require('fs');
console.log(chalk.red('Carregou a lib fs.'));

const { keys } = require('./src/keys');
console.log(chalk.green('Carregou as chaves de aplicação.'));

const { greet, cumprimentos, dictionary, emojis } = require('./src/resources');
console.log(chalk.green('Carregou os recursos.'));

const objects = require('./src/objects');
console.log(chalk.green('Carregou as classes personalizadas.'));

const functions = require('./src/functions');
console.log(chalk.green('Carregou as funções.'));

const comandos = require('./src/comandos');
console.log(chalk.green('Carregou os comandos.'));
console.log(chalk.yellow('------------------------------------------------------'));
console.log(chalk.yellow('Debug: \n'));

const client = new Client();

//Posições dos arrays de chaves.
const keyGoogle = 0;
const keyContext = 1;
const keyBot = 2;

//Posições dos arrays de dicionário.
const tabajara = 0;
const normie = 1;
const blacklist = 2;
const ver = 3;
const guildjena = 4
const senpiid = 5;
const fon = 6;
const host = 7;
const path = 8;
const idBotJogos = 9;
const jenasID = 10;
const lixo = 11;

//Variáveis Globais
var pasta = new objects.copypasta();

//Liga o DB
var db = new sqlite3.Database('./dbjogos.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the dbjogos database.');
});

//Evento de quando o bot estiver lançado
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(" !t-help para comandos.");
});


//Evento quando alguém sai de uma guild
client.on("guildMemberRemove", (member) => {
  if (member.guild.id == dictionary[fon]) {
    if (member.id == dictionary[senpiid]) {
      functions.fnQuitaSenpi(dictionary[senpiid], db);
    }
  }
});

//Evento ao Receber Reações
client.on('messageReactionAdd', (msgReact, user) => {
  if (!user.bot && (msgReact.emoji == '◀' || msgReact.emoji == '▶' || msgReact.emoji == '⏹')) {
    functions.fnChecaReactIMG(db, msgReact, user);
  }
});

//onde a magia acontece, evento ao receber uma mensagem
client.on('message', msg => {
  //se a mensagem não for por PM ou o autor da mensagem não for bot ele dá continuidade no comando
  if (msg.channel.type == "dm" || msg.author.bot) {
    if (msg.author.id == dictionary[jenasID]) {
      comandos.fnCapturarCopypasta(pasta, msg);
    }
    if (msg.author.id == dictionary[idBotJogos]) {
      comandos.fnRinhaDeBot(msg, client);
    }
  } else {
    //variaveis da mensagem recebida
    var dadosMsg = msg.content; //dados da mensagem separado para tratamento
    var today = new Date(); //Data atual em formato DD/MM/YYYY
    var dia = new Date(); //Data atual em formato universal
    var dd = String(today.getDate()).padStart(2, '0'); //Extrai dia atual
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //Extrai mês atual (janeiro é 0)
    var yyyy = today.getFullYear(); //Extrai ano atual
    var diahoje = today.getDay(); //Extrai Dia da semana 0 é domingo
    var horaagora = today.getHours(); //Extrai horário atual

    today = dd + '/' + mm + '/' + yyyy;

    if (dadosMsg.startsWith(':') && dadosMsg.endsWith(':')) {
      comandos.fnEnviaEmojiAnimado(msg, dadosMsg);
    }

    //se for segunda quarta quinta ou sexta apartir das 9 da manhã envia um meus bacanos
    if (((diahoje == 3 || diahoje == 4 || diahoje == 1) && horaagora >= 9) || (diahoje == 5 && horaagora >= 21)) {
        comandos.fnMeusBacanos(msg.guild.id, diahoje, today, msg.channel, db);
    }

    //se a mensagem conter normie manda tu parar de ser normie
    if (dadosMsg.toUpperCase().includes('NORMIE')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'NORMIE', dia, msg.channel)) {
        comandos.fnParaDeSerNormie(msg);
      };
    }

    if (dadosMsg == '!t-ping') {
      if (functions.fnBuscaCooldown(msg.guild.id, 'PING', dia, msg.channel)) {
        comandos.fnFakePing(msg);
      }
    }

    if (dadosMsg.startsWith('!tp ')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'PASTA', dia, msg.channel)) {
        comandos.fnEnviaCopypastaEscolhida(msg);
      }
    }
    if (dadosMsg == '!tp-random') {
      if (functions.fnBuscaCooldown(msg.guild.id, 'PASTA', dia, msg.channel)) {
        comandos.fnCopypastaRandom(msg);
      }
    }

    if (dadosMsg == '!tp-lista') {
      if (functions.fnBuscaCooldown(msg.guild.id, 'PASTALISTA', dia, msg.channel)) {
        comandos.fnListaCopypastas(msg);
      }
    }

    if (dadosMsg == ('!senpi')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'SENPI', dia, msg.channel)) {
        comandos.fnSenpi(msg, db);
      }
    }

    if (dadosMsg == ('!roulette')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'ROLETA', dia, msg.channel)) {
        comandos.fnRoulette(msg, client, db);
      }
    }

    if (dadosMsg.toUpperCase().includes('ADOLESCENTE')) {
      msg.channel.send("Adolescente é merda");
    }

    if (dadosMsg == ('!r-top')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'ROLETA_TOP', dia, msg.channel)) {
        comandos.fnRoletaTop(msg, client, db);
      }
    }


    if (dadosMsg == ('!tabajara')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'TABAJARA', dia, msg.channel)) {
        comandos.fnTabajara(msg);
      }
    }

    if (dadosMsg.startsWith('!t-img ')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'IMG', dia, msg.channel)) {
        comandos.fnBuscaImg(msg, db);
      }
    }

    if (dadosMsg == ('!pistolette')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'PISTOLETTE', dia, msg.channel)) {
        comandos.fnPistolette(msg, client);
      }
    }


    //Alternativas para o help
    if (dadosMsg == '!t' || (dadosMsg == '<@!' + client.user.id + '>')) {
      dadosMsg = '!t-help'
    }

    //mensagem de help
    if (dadosMsg.startsWith('!t-help')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'HELP', dia, msg.channel)) {
        comandos.fnHelp(msg);
      }
    };

    //mensagem de versão
    if (dadosMsg == ('!t-ver')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'VER', dia, msg.channel)) {
        comandos.fnVer(msg);
      }
    };

    //mensagem que retorna os top jogos do server
    if (dadosMsg == ('!t-top')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'TOP', dia, msg.channel)) {
        comandos.fnTopJogos(msg, db);
      }
    }
    //mensagem que retorna os usuarios de determinado jogo
    if (dadosMsg.startsWith('!t ')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'GAME', dia, msg.channel)) {
        comandos.fnBuscaJogos(msg, db, client);
      }
    }
    //se o comando for de usuarios verifica Menção > uername > nickname
    if (dadosMsg.startsWith('!t-user')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'USER', dia, msg.channel)) {
        comandos.fnBuscaJogosUser(msg, dadosMsg, db, client);
      }
    } else {
      if (dadosMsg == '!t-img') {
        msg.reply('insira um parâmetro de busca! (Exemplo: !t-img batata)');
      }
    }

    //se for a minha guilda ele duplica emojis, pra evitar spam em outras guildas
    if (msg.guild.id == dictionary[guildjena]) {
      comandos.fnCopyEmojiJenas(msg,dadosMsg);
    }
    
    //busca se tem alguma string de cumprimento na mensagem
    for (var i = 0; i < cumprimentos.length; i++) {
      for (var i2 = 0; i2 < cumprimentos[i].length; i2++) {
        if (dadosMsg.toUpperCase() == (cumprimentos[i][i2])) {
          if (functions.fnBuscaCooldown(msg.guild.id, 'GREETINGS', dia, msg.channel)) {
            comandos.fnEnviaMsgCumprimento(msg,i,horaagora,client);
          }
        }
      }
    }


  }
});

client.on('presenceUpdate', (oldMember, newMember) => {
  //Verifica se o usuário começou a jogar/não é bot/não é spotify
  if (!(newMember.user.bot) && functions.fnChecaJogoValido(newMember.presence.game)){
    functions.fnBuscaId(newMember.user.id, newMember.presence.game.toString(), newMember, newMember.guild.id, db);
  }

});

client.login(keys[keyBot]);
