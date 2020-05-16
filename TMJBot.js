
//TO-DO : filtrar e transformar em funções os eventos para tornar mais fácil a leitura do código.
//TO-DO : prepared statement para os SQL's

const chalk = require('chalk');
console.log(chalk.yellow('------------------------------------------------------'));
console.log(chalk.red('Carregou a lib chalk.'));

const { Client, RichEmbed } = require('discord.js');
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

//Variáveis Globais
var searchTerm;
var attach;
var idemojo = String;
var esperandoPasta = false;
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
  client.user.setActivity(" CYBERPUNK 2077");
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
    db.all('SELECT * FROM IMG WHERE ID_MSG = "' + msgReact.message.id + '" and ID_GUILD = "' + msgReact.message.guild.id + '" and ID_USER = "' + user.id + '" ', (err, row) => {
      if (err) {
        throw err;
      }
      if (row != null && row.length > 0) {
        let listDadosPesq = new Array(objects.img);
        listDadosPesq = row;
        if (!(msgReact.emoji == '▶' && listDadosPesq[0].NRO_ATUAL == listDadosPesq[0].NRO_MAX) && !(msgReact.emoji == '◀' && listDadosPesq[0].NRO_ATUAL == 0)) {
          let rawdata = readFileSync('./img/' + msgReact.message.id);
          let imageResults = JSON.parse(rawdata);
          let actualImgResult;
          let nroatual;
          if (imageResults.items.length > 0 && (msgReact.emoji == '◀' || msgReact.emoji == '▶')) {
            let AdicionarSubtrair;
            if (msgReact.emoji == '◀') {
              AdicionarSubtrair = true;
            } else {
              AdicionarSubtrair = false;
            }
            if (AdicionarSubtrair) {
              nroatual = parseInt(listDadosPesq[0].NRO_ATUAL) - 1;
              actualImgResult = imageResults.items[nroatual];
            } else {
              nroatual = parseInt(listDadosPesq[0].NRO_ATUAL) + 1;
              actualImgResult = imageResults.items[nroatual];
            }
            attach = `${actualImgResult.link}`;
            const exampleEmbed = new RichEmbed()
              .setColor(0xFF0000)
              .setDescription(listDadosPesq[0].NOME_PESQ + ': ' + (parseInt(nroatual) + 1) + ' de ' + `${imageResults.items.length}` + ' imagen(s) encontrada(s).')
              .setImage(attach);
            msgReact.message.edit(exampleEmbed);
            db.run('UPDATE IMG SET NRO_ATUAL = ' + nroatual + ' WHERE ID_MSG = "' + msgReact.message.id + '" AND ID_GUILD = "' + msgReact.message.guild.id + '" AND ID_USER = "' + user.id + '"', (err, row) => {
              if (err) {
                throw err;
              }
              msgReact.remove(user.id);
              return true;
            });
            msgReact.remove(user.id);
          } else {
            msgReact.message.delete(1000);
          }
        } else {
          msgReact.remove(user.id);
          return true;
        }
      }
      return true;
    });
  }
});

//onde a magia acontece, evento ao receber uma mensagem
client.on('message', msg => {
  //se a mensagem não for por PM ou o autor da mensagem não for bot ele dá continuidade no comando
  if (msg.channel.type == "dm" || msg.author.bot) {
    if (msg.author.id == dictionary[jenasID]) {
      if (esperandoPasta) {
        esperandoPasta = false;
        if (msg.content != 'cancel') {
          pasta.TEXTO = msg.content;
          let jsonPasta = JSON.stringify(pasta);
          writeFile('./pasta/' + pasta.NOME_PASTA + '.json', jsonPasta, function (err) {
            if (err) {
              console.log(err);
            };
            msg.reply('Copypasta adicionada com sucesso.');
          });
        }
      } else {
        esperandoPasta = true;
        pasta.NOME_PASTA = msg.content;
        msg.reply('Insira a copypasta de nome: ' + pasta.NOME_PASTA);
      }
    }
    if (msg.author.id == dictionary[idBotJogos]) {
      if (msg.content.startsWith('Burro do server é') || msg.content.startsWith('Burro agora é você') || msg.content.includes('porra bicho você quer ser mais burro do que ja é?')) {
        if (msg.mentions.users.first() == msg.guild.owner.user) {
          let emojo = msg.guild.emojis.find(emoji => emoji.name == emojis[0]);
          msg.reply('Meu dono não é burro não ' + functions.fnGerarEmojiMsg(emojo.name, emojo.id, false));
        }

      }
      if (msg.content.includes('É sim')) {
        if (msg.mentions.users.first() == client.user) {
          msg.reply('Qué sai no soco FDP????');
        }
      }
      if (msg.content.includes('Vem então seu pedaço de lata que usa processador da intel!!!!')) {
        if (msg.mentions.users.first() == client.user) {
          let link = 'https://media.discordapp.net/attachments/223594824681521152/707995160012652574/lixo.png';
          const embed = new RichEmbed().setImage(link);
          msg.channel.send(embed);
        }
      }
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
      let emojo = msg.guild.emojis.find(emoji => emoji.name == dadosMsg.substring(1, dadosMsg.length - 1));
      if (emojo) {
        idemojo = functions.fnGerarEmojiMsg(emojo.name, emojo.id, true); //'<a' + dadosMsg + emojo.id + '>';
        msg.channel.send(idemojo).then(obj2 => msg.channel.send('(Enviado por: ' + msg.author.username + ')').then(obj => msg.delete(50)));
      }
    }

    //se for segunda quarta quinta ou sexta apartir das 9 da manhã envia um meus bacanos
    if (((diahoje == 3 || diahoje == 4 || diahoje == 1) && horaagora >= 9) || (diahoje == 5 && horaagora >= 21)) {
      functions.fnMeusBacanos(msg.guild.id, diahoje, today, msg.channel, db);
    }

    //se a mensagem conter normie manda tu parar de ser normie
    if (dadosMsg.toUpperCase().includes('NORMIE')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'NORMIE', dia, msg.channel)) {
        let link = dictionary[normie];
        const embed = new RichEmbed().setImage(link)
        msg.channel.send(embed);
      };
    }

    if (dadosMsg == '!t-ping') {
      if (functions.fnBuscaCooldown(msg.guild.id, 'PING', dia, msg.channel)) {
        let timenow1 = new Date();
        msg.channel.send('a').then(message => {

          let timenow2 = new Date();
          message.edit('` ' + (timenow2.getTime() - timenow1.getTime()) + 'ms `');

        })
      }
    }

    if (dadosMsg.startsWith('!tp ')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'PASTA', dia, msg.channel)) {
        let nomePasta = msg.content.substring(4, msg.content.length);
        exists('./pasta/' + nomePasta + '.json', existe => {
          if (existe) {
            let pasta = new objects.copypasta();
            pasta = JSON.parse(readFileSync('./pasta/' + nomePasta + '.json'));
            msg.channel.send(pasta.TEXTO);
            return;
          } else {
            msg.reply('Copypasta não encontrada.')
          }
        });
      }
    }
    if (dadosMsg == '!tp-random') {
      if (functions.fnBuscaCooldown(msg.guild.id, 'PASTA', dia, msg.channel)) {
        let listacopypasta = [];
        readdir('./pasta/', function (err, files) {
          //handling error
          if (err) {
            return console.log('Unable to scan directory: ' + err);
          }
          //listing all files using forEach
          files.forEach(function (file) {
            listacopypasta.push(file);
          });
          let rand = Math.floor((Math.random() * listacopypasta.length) + 1);
          let nomePasta = listacopypasta[rand - 1];
          let pasta = new objects.copypasta();
          pasta = JSON.parse(readFileSync('./pasta/' + nomePasta));
          msg.channel.send(pasta.TEXTO);
          return;
        });
      }
    }

    if (dadosMsg == '!tp-lista') {
      if (functions.fnBuscaCooldown(msg.guild.id, 'PASTALISTA', dia, msg.channel)) {
        let listacopypasta = String('');
        readdir('./pasta/', function (err, files) {
          //handling error
          if (err) {
            return console.log('Unable to scan directory: ' + err);
          }
          //listing all files using forEach
          files.forEach(function (file) {
            if (listacopypasta != '') {
              listacopypasta += ', ';
            };
            listacopypasta += file.substring(0, file.length - 5);
          });
          msg.channel.send('Lista de copypastas: ' + functions.fnMarkdownMsg(listacopypasta));
        });
      }
    }

    if (dadosMsg == ('!senpi')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'SENPI', dia, msg.channel)) {
        db.all('SELECT * FROM senpi', (err, row) => {
          if (err) {
            throw err;
          }
          if (row != null && row.length > 0) {
            let listSenpi = new Array(objects.senpi);
            listSenpi = row;
            msg.reply('o corno do senpi quitou ' + listSenpi[0].QUITADAS + ' vezes da fon. _zuo_');
          }
          return true;
        });
      }
    }

    if (dadosMsg == ('!roulette')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'ROLETA', dia, msg.channel)) {
        let bala = Math.floor((Math.random() * 6) + 1);
        if (bala == 3) {
          functions.fnRoleta(msg.member.id, msg.guild.id, true, db);
          const residentsleeper = client.emojis.find(emoji => emoji.name === emojis[2]);
          msg.reply(`você morreu!! ${residentsleeper}`);
        } else {
          functions.fnRoleta(msg.member.id, msg.guild.id, false, db);
          const monkaS = client.emojis.find(emoji => emoji.name === emojis[1]);
          msg.reply(`a arma falha, por sorte. ${monkaS}`);
        }
      }
    }

    if (dadosMsg.toUpperCase().includes('ADOLESCENTE')) {
      msg.channel.send("Adolescente é merda");
    }

    if (dadosMsg == ('!r-top')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'ROLETA_TOP', dia, msg.channel)) {
        let guilda = msg.guild.id;
        db.all('select * from roleta where guilda = "' + guilda + '" and num_morte > 0 order by num_morte DESC LIMIT 20', (err, row) => {
          if (err) {
            throw err;
          }
          if (row != null && row.length > 0) {
            let listtop = new Array(objects.morte);
            listtop = row;
            let prefix;
            let str = '';
            prefix = ' As pessoas que mais morreram no servidor são: \n';
            let user;
            listtop.forEach(element => {
              if (client.users.get(element.id_user) != null) {
                user = client.users.get(element.id_user);
                str = str + user.username + ' - ' + element.num_morte + ' mortes - ' + ((100 / (element.num_morte + element.num_tentativas)) * element.num_morte).toFixed(2) + '% \n';
              }
            });
            listtop = [];
            msg.reply(prefix + functions.fnMarkdownMsg(str));
          } else {
            msg.reply(' Ninguém morreu no servidor.');
          }
        });
      }
    }


    if (dadosMsg == ('!tabajara')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'TABAJARA', dia, msg.channel)) {
        const embed = new RichEmbed().setImage(dictionary[tabajara])
        msg.channel.send(embed);
        return;
      }
    }

    if (dadosMsg.startsWith('!t-img ')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'IMG', dia, msg.channel)) {
        searchTerm = msg.content.substring(7, msg.content.length);

        let request_params = {
          method: 'GET',
          hostname: dictionary[host],
          path: dictionary[path] + '?q=' + encodeURIComponent(searchTerm) + '&cx=' + keys[keyContext] + '&key=' + keys[keyGoogle] + '&searchType=image',
        };

        let response_handler = function (response) {
          let body = '';
          response.on('data', function (d) {
            body += d;
          });

          response.on('end', function () {
            let imageResults = JSON.parse(body);
            if (imageResults.items.length > 0) {
              let firstImageResult = imageResults.items[0];
              attach = `${firstImageResult.link}`;
              const exampleEmbed = new RichEmbed()
                .setColor(0xFF0000)
                .setDescription(searchTerm + ': 1 de ' + `${imageResults.items.length}` + ' imagen(s) encontrada(s).')
                .setImage(attach);
              msg.channel.send(exampleEmbed).then(async message => {
                await message.react('◀');
                await message.react('▶');
                await message.react('⏹');
                var fs = require('fs');
                fs.writeFile("./img/" + message.id, body, function (err) {
                  if (err) {
                    console.log(err);
                  };
                  db.run(`INSERT INTO img(ID_MSG,ID_GUILD,ID_USER,NOME_PESQ,NRO_ATUAL,NRO_MAX) VALUES("` + message.id + '","' + message.guild.id + '","' + msg.author.id + '","' + searchTerm + '",' + '0' + ',' + `${imageResults.items.length}-1` + ')', (err, row) => {
                    if (err) {
                      throw err;
                    }
                  });
                });
              });

            } else {
              console.log("Couldn't find image results!");
              msg.reply(" não foi possível encontrar a imagem.")
            }
          })
        };

        let req = request(request_params, response_handler);
        req.end();
      }
    }

    if (dadosMsg == ('!pistolette')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'PISTOLETTE', dia, msg.channel)) {
        let bala = Math.floor((Math.random() * 50) + 1);
        if (bala == 25) {
          const q_ = client.emojis.find(emoji => emoji.name === emojis[3]);
          msg.reply(`A arma falha!! ${q_}`);
        } else {
          const residentsleeper = client.emojis.find(emoji => emoji.name === emojis[2]);
          msg.reply(`você morreu!! ${residentsleeper}`);
        }
      }
    }


    //Alternativas para o help
    if (dadosMsg == '!t' || (dadosMsg == '<@!' + client.user.id + '>')) {
      dadosMsg = '!t-help'
    }

    //mensagem de help
    if (dadosMsg.startsWith('!t-help')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'HELP', dia, msg.channel)) {
        var str = "\nComandos Atuais do Bot: \n" +
          "!t <jogo>: Busca os players do jogo.\n" +
          "!t-top: Exibe os jogos mais populares do servidor.\n" +
          "!t-user <user>: Exibe os jogos recentes desse usuário.\n" +
          "!t-ver: Exibe a versão e mais informações sobre o Bot.\n" +
          "!t-img <termo>: Busca a imagem com o termo selecionado.\n" +
          "!t-help: Essa mensagem que você está vendo agora.\n" +
          "!tp <copypasta>: Exibe a copypasta alvo.\n" +
          "!tp-lista: Exibe a lista de copypastas.\n" +
          "!tp-random: Copypasta aleatória.\n" +
          "!roulette: Roleta russa com revólver.\n" +
          "!pistolette: Roleta russa com pistola.\n" +
          "Envio de emotes animados sem nitro! (o emote precisa existir no servidor), é só digitar o emote normalmente por exemplo :smugkid:";
        msg.reply(functions.fnMarkdownMsg(str));
      }
    };

    //mensagem de versão
    if (dadosMsg == ('!t-ver')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'VER', dia, msg.channel)) {
        var str = "\nVersão do bot: " + dictionary[ver] + " \n" +
          "Desenvolvedor: Jenas#8080 \n" +
          "Página do GitHub: https://github.com/Jonasslv/TMJBot/ ";

        msg.reply(functions.fnMarkdownMsg(str));
      }
    };

    //mensagem que retorna os top jogos do server
    if (dadosMsg == ('!t-top')) {
      if (functions.fnBuscaCooldown(msg.guild.id, 'TOP', dia, msg.channel)) {
        let guilda = msg.guild.id;
        db.all('select count(nome_jogo) as QTDE,NOME_JOGO from jpu where ' + dictionary[blacklist] + ' GUILDA = "' + guilda + '" group by NOME_JOGO order by qtde desc LIMIT 20', (err, row) => {
          if (err) {
            throw err;
          }
          if (row != null && row.length > 0) {
            let listtop = new Array(objects.jputop);
            listtop = row;
            let str = '';
            let prefix;
            prefix = ' Os jogos mais populares do servidor são: \n';
            listtop.forEach(element => {
              str = str + element.NOME_JOGO + ' - ' + element.QTDE + ' jogadores \n';
            });
            listtop = [];
            msg.reply(prefix + functions.fnMarkdownMsg(str));
          } else {
            msg.reply(' Não existem jogos registrados no servidor.');
          }
        });
      }
    } else {

      //mensagem que retorna os usuarios de determinado jogo
      if (dadosMsg.startsWith('!t ')) {
        if (functions.fnBuscaCooldown(msg.guild.id, 'GAME', dia, msg.channel)) {
          var jogo = msg.content.substring(3, msg.content.length);
          //trata os alias se um deles tiver sido pesquisado
          db.all('SELECT * FROM aliases where upper(alias) = Upper("' + jogo + '")', (err, row) => {
            if (err) {
              throw err;
            }
            if (row != null && row.length > 0) {
              let listAlias = new Array(objects.aliases);
              listAlias = row;
              jogo = listAlias[0].NOME_JOGO;
            }
            let guilda = msg.guild.id;
            //procura o jogo na guilda ignorando blacklist 
            db.all('SELECT * FROM jpu where ' + dictionary[blacklist] + ' upper(NOME_JOGO) LIKE Upper("%' + jogo + '%") and guilda = "' + guilda + '" order by substr(DATA,7,4)||substr(DATA,4,2)||substr(DATA,1,2) DESC LIMIT 20', (err, row) => {
              if (err) {
                throw err;
              }
              if (row != null && row.length > 0) {
                let listUsers = new Array(objects.jpu);
                listUsers = row;
                let str = '';
                let prefix;
                let existeuser = false;
                prefix = ' essas pessoas jogaram ' + jogo + ': \n';
                listUsers.forEach(element => {
                  var user = client.users.get(element.ID_USUARIO);
                  if (user != undefined) {
                    str = str + '-' + user.username + ' (' + element.NOME_JOGO + ') (' + element.DATA + ')\n';
                    existeuser = true;
                  }
                });
                if (existeuser) {
                  listUsers = [];
                  msg.reply(prefix + functions.fnMarkdownMsg(str));
                } else {
                  msg.reply(' Não foi possível encontrar o jogo.');
                }
              } else {
                msg.reply(' Não foi possível encontrar o jogo.');
              }
            });
          });
        }
      }
      //se o comando for de usuarios verifica Menção > uername > nickname
      if (dadosMsg.startsWith('!t-user')) {
        if (functions.fnBuscaCooldown(msg.guild.id, 'USER', dia, msg.channel)) {
          let user;
          if (dadosMsg == '!t-user') {
            user = msg.author;
          } else {
            //verifica se foi menção
            user = msg.mentions.users.first();
            if (!user) {
              nomeusr = msg.content.substring(8, msg.content.length);
              //verifica se foi username
              let usrlist = msg.guild.members.filter(functions.fnValidaUsername);
              if (usrlist.first() == undefined) {
                //verifica se foi nickname
                let usrlist = msg.guild.members.filter(functions.fnValidaNickname);
                if (usrlist.first() != undefined) {
                  user = usrlist.first().user;
                }
              } else {
                user = usrlist.first().user;
              }
            }
          }
          //se foi encontrado um usuário
          if (user) {
            let userid = user.id;
            let guilda = msg.guild.id;
            //busca o top 20 jogos do usuário por data
            db.all('SELECT * FROM jpu where ' + dictionary[blacklist] + ' ID_USUARIO = "' + userid + '" and guilda = "' + guilda + '" order by  substr(DATA,7,4)||substr(DATA,4,2)||substr(DATA,1,2) DESC LIMIT 20', (err, row) => {
              if (err) {
                throw err;
              }
              if (row != null && row.length > 0) {
                let listUsers = new Array(objects.jpu);
                listUsers = row;
                let str = '';
                let prefix;
                prefix = user.username + ' jogou recentemente: \n';
                listUsers.forEach(element => {
                  var user = client.users.get(element.ID_USUARIO);
                  if (user != undefined) {
                    str = str + ' ' + element.NOME_JOGO + ' (' + element.DATA + ')\n';
                  }
                });
                listUsers = [];
                msg.reply(prefix + functions.fnMarkdownMsg(str));
              } else {
                msg.reply(' esse usuário não jogou recentemente.');
              }
            });
          } else {
            msg.reply('Não foi encontrado nenhum usuário.');
          }
        }
      } else {
        if (dadosMsg == '!t-img') {
          msg.reply('insira um parâmetro de busca! (Exemplo: !t-img batata)');
        }
      }

      //se for a minha guilda ele duplica emojis, pra evitar spam em outras guildas
      if (msg.guild.id == dictionary[guildjena]) {
        //lista de emojis para serem duplicados
        let emojiscopia = [emojis[0], emojis[4], emojis[5], emojis[6], emojis[7], emojis[8], emojis[9], emojis[10]];
        let stremoji = String;
        emojiscopia.forEach(element => {
          //verifica se o emoji existe no servidor
          let emojo = msg.guild.emojis.find(emoji => emoji.name == element);
          if (emojo) {
            //duplica
            idemojo = functions.fnGerarEmojiMsg(emojo.name, emojo.id, false);
            if (dadosMsg == (idemojo)) {
              stremoji = idemojo;
              msg.channel.send(stremoji);
            }
          }
        });
      }
      //aqui o código mais complexo do bot, randomiza as mensagens de cumprimento bom dia/boa tarde/boa noite
      for (var i = 0; i < cumprimentos.length; i++) {
        for (var i2 = 0; i2 < cumprimentos[i].length; i2++) {
          if (dadosMsg.toUpperCase() == (cumprimentos[i][i2])) {
            let nr = i;
            if (functions.fnBuscaCooldown(msg.guild.id, 'GREETINGS', dia, msg.channel)) {
              if ((i == 0 && ((horaagora == 12 || horaagora == 13 || horaagora == 14 || horaagora == 15 ||
                horaagora == 16 || horaagora == 17 || horaagora == 18 || horaagora == 19 || horaagora == 20 ||
                horaagora == 21 || horaagora == 22 || horaagora == 23 || horaagora == 0 || horaagora == 1 ||
                horaagora == 2 || horaagora == 3 || horaagora == 4 || horaagora == 5)) || (i == 1 && (horaagora == 0 ||
                  horaagora == 1 || horaagora == 2 || horaagora == 3 || horaagora == 4 || horaagora == 5 || horaagora == 6 ||
                  horaagora == 7 || horaagora == 8 || horaagora == 9 || horaagora == 10 || horaagora == 11 ||
                  horaagora == 18 || horaagora == 19 || horaagora == 20 || horaagora == 21 || horaagora == 22 ||
                  horaagora == 23)) || (i == 2 && (horaagora == 6 || horaagora == 7 || horaagora == 8 ||
                    horaagora == 9 || horaagora == 10 || horaagora == 11 || horaagora == 12 || horaagora == 13 ||
                    horaagora == 14 || horaagora == 15 || horaagora == 16 || horaagora == 17)))) {
                const pistoranjo = client.emojis.find(emoji => emoji.name === emojis[0]);
                msg.reply(`Olha a hora fdp. ${pistoranjo}`);
              } else {
                let link = greet[nr][Math.floor((Math.random() * greet[nr].length) + 1) - 1];
                const embed = new RichEmbed().setImage(link);
                msg.channel.send(embed);
              }
              return;
            } else {
              return;
            }
          }
        }
      }
    }
  }
});

client.on('presenceUpdate', (oldMember, newMember) => {
  //Verifica se o usuário começou a jogar/não é bot/não é spotify
  if (newMember.presence.game != null && !newMember.user.bot && newMember.presence.game.toString() != 'Spotify' && newMember.presence.game.toString() != 'Wallpaper Engine') {
    functions.fnBuscaId(newMember.user.id, newMember.presence.game.toString(), newMember, newMember.guild.id, db);
  }

});

client.login(keys[keyBot]);
