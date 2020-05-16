const { RichEmbed } = require('discord.js');
const objects = require('./objects');
const { greet, dictionary, emojis } = require('./resources');
const functions = require('./functions');
const { keys } = require('./keys');
const { readFileSync, writeFile, exists, readdir } = require('fs');

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

function fnCopypastaRandom(msg) {
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

  function fnParaDeSerNormie(msg) {
    let link = dictionary[normie];
    const embed = new RichEmbed().setImage(link)
    msg.channel.send(embed);
  }
  
  function fnFakePing(msg) {
    let timenow1 = new Date();
    msg.channel.send('a').then(message => {
  
      let timenow2 = new Date();
      message.edit('` ' + (timenow2.getTime() - timenow1.getTime()) + 'ms `');
  
    });
  }
  
  function fnEnviaEmojiAnimado(msg, dadosMsg) {
    let emojo = msg.guild.emojis.find(emoji => emoji.name == dadosMsg.substring(1, dadosMsg.length - 1));
    if (emojo) {
      let idemojo = functions.fnGerarEmojiMsg(emojo.name, emojo.id, true); //'<a' + dadosMsg + emojo.id + '>';
      msg.channel.send(idemojo).then(obj2 => msg.channel.send('(Enviado por: ' + msg.author.username + ')').then(obj => msg.delete(50)));
    }
  }
  
  function fnEnviaCopypastaEscolhida(msg) {
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
  
  function fnRinhaDeBot(msg, client) {
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
        ;
        const embed = new RichEmbed().setImage(dictionary[lixo]);
        msg.channel.send(embed);
      }
    }
  }

  function fnCapturarCopypasta(pasta, esperandoPasta, msg) {
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
  
  function fnTopJogos(msg, db) {
    let guilda = msg.guild.id;
    db.all('select count(nome_jogo) as QTDE,NOME_JOGO from jpu where ' + dictionary[blacklist] + ' GUILDA = $guilda group by NOME_JOGO order by qtde desc LIMIT 20', {
      $guilda: guilda
    }, function (err, row) {
      if (err) {
        throw err;
      }
      if (row != null && row.length > 0) {
        let listtop = new Array(objects.jputop);
        listtop = row;
        let strJogos = '';
        let prefix = ' Os jogos mais populares do servidor são: \n';
        listtop.forEach(element => {
          strJogos = strJogos + element.NOME_JOGO + ' - ' + element.QTDE + ' jogadores \n';
        });
        listtop = [];
        msg.reply(prefix + functions.fnMarkdownMsg(strJogos.substring(0, strJogos.length - 1)));
      } else {
        msg.reply(' Não existem jogos registrados no servidor.');
      }
    });
  }
  
  function fnListaCopypastas(msg) {
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
  
  function fnRoulette(msg, client, db) {
    let bala = Math.floor((Math.random() * 6) + 1);
    if (bala == 3) {
      functions.fnGravarRoleta(msg.member.id, msg.guild.id, true, db);
      const residentsleeper = client.emojis.find(emoji => emoji.name === emojis[2]);
      msg.reply(`você morreu!! ${residentsleeper}`);
    } else {
      functions.fnGravarRoleta(msg.member.id, msg.guild.id, false, db);
      const monkaS = client.emojis.find(emoji => emoji.name === emojis[1]);
      msg.reply(`a arma falha, por sorte. ${monkaS}`);
    }
  }
  
  
  function fnSenpi(msg, db) {
    db.all('SELECT * FROM senpi', function (err, row) {
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
  
  function fnRoletaTop(msg, client, db) {
    let guilda = msg.guild.id;
    db.all('select * from roleta where guilda = $guilda and num_morte > 0 order by num_morte DESC LIMIT 20', {
      $guilda: guilda
    }, function (err, row) {
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
        msg.reply(prefix + functions.fnMarkdownMsg(str.substring(0, str.length - 1)));
      } else {
        msg.reply(' Ninguém morreu no servidor.');
      }
    });
  }
  
  function fnTabajara(msg) {
    const embed = new RichEmbed().setImage(dictionary[tabajara])
    msg.channel.send(embed);
    return;
  }
  
  function fnBuscaImg(msg, db) {
    const { request } = require('https');
    let searchTerm = msg.content.substring(7, msg.content.length);
  
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
          let attach = `${firstImageResult.link}`;
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
              db.run(`INSERT INTO img(ID_MSG,ID_GUILD,ID_USER,NOME_PESQ,NRO_ATUAL,NRO_MAX) VALUES($idmsg, $idguild, $iduser, $nomepesq, $nroatual, $nromax)`, {
                $idmsg: message.id,
                $idguild: message.guild.id,
                $iduser: msg.author.id,
                $nomepesq: searchTerm,
                $nroatual: 0,
                $nromax: (imageResults.items.length - 1)
              }, function (err, row) {
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
  
  function fnHelp(msg) {
    let str = "Comandos Atuais do Bot: \n" +
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
  
  function fnPistolette(msg, client) {
    let bala = Math.floor((Math.random() * 50) + 1);
    if (bala == 25) {
      const q_ = client.emojis.find(emoji => emoji.name === emojis[3]);
      msg.reply(`A arma falha!! ${q_}`);
    } else {
      const residentsleeper = client.emojis.find(emoji => emoji.name === emojis[2]);
      msg.reply(`você morreu!! ${residentsleeper}`);
    }
  }
  
  function fnVer(msg) {
    let str = "Versão do bot: " + dictionary[ver] + " \n" +
      "Desenvolvedor: Jenas#8080 \n" +
      "Página do GitHub: https://github.com/Jonasslv/TMJBot/ ";
  
    msg.reply(functions.fnMarkdownMsg(str));
  }
  
  function fnBuscaJogos(msg, db, client) {
    let jogo = msg.content.substring(3, msg.content.length);
    //trata os alias se um deles tiver sido pesquisado
    db.all('SELECT * FROM aliases where upper(alias) = $jogo', {
      $jogo: jogo.toUpperCase()
    }, function (err, row) {
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
      db.all('SELECT * FROM jpu where ' + dictionary[blacklist] + ' upper(NOME_JOGO) LIKE $jogo and guilda = $idguild order by substr(DATA,7,4)||substr(DATA,4,2)||substr(DATA,1,2) DESC LIMIT 20', {
        $jogo: '%' + jogo.toUpperCase() + '%',
        $idguild: guilda
      }, function (err, row) {
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
            msg.reply(prefix + functions.fnMarkdownMsg(str.substring(0, str.length - 1)));
          } else {
            msg.reply(' Não foi possível encontrar o jogo.');
          }
        } else {
          msg.reply(' Não foi possível encontrar o jogo.');
        }
      });
    });
  }
  
  function fnBuscaJogosUser(msg, dadosMsg, db, client) {
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
      db.all('SELECT * FROM jpu where ' + dictionary[blacklist] + ' ID_USUARIO = $iduser and guilda = $idguild order by substr(DATA,7,4)||substr(DATA,4,2)||substr(DATA,1,2) DESC LIMIT 20', {
        $iduser: userid,
        $idguild: guilda
      }, function (err, row) {
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
          msg.reply(prefix + functions.fnMarkdownMsg(str.substring(0, str.length - 1)));
        } else {
          msg.reply(' esse usuário não jogou recentemente.');
        }
      });
    } else {
      msg.reply('Não foi encontrado nenhum usuário.');
    }
  }
 
  function fnCopyEmojiJenas(msg,dadosMsg) {
    //lista de emojis para serem duplicados
    let emojiscopia = [emojis[0], emojis[4], emojis[5], emojis[6], emojis[7], emojis[8], emojis[9], emojis[10], emojis[11]];
    let stremoji = '';
    emojiscopia.forEach(element => {
      //verifica se o emoji existe no servidor
      let emojo = msg.guild.emojis.find(emoji => emoji.name == element);
      if (emojo) {
        //duplica
        let idemojo = functions.fnGerarEmojiMsg(emojo.name, emojo.id, false);
        if (dadosMsg == (idemojo)) {
          stremoji = idemojo;
          msg.channel.send(stremoji);
        }
      }
    });
  }
  
  function fnEnviaMsgCumprimento(msg,i,horaagora){
    let nr = i;
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
  }
  
function fnMeusBacanos(guilda, tipo, data, canal, db) {
    db.all('select * from GREETINGS where GUILDA = "' + guilda + '" and DATA = "' + data + '"  ', (err, row) => {
        if (err) {
            throw err;
        }
        if (row != null && row.length > 0) {
            return true;
        } else {
            db.run(`INSERT INTO GREETINGS(GUILDA,DATA,TIPO) VALUES("` + guilda + '","' + data + '","' + tipo + '")', (err, row) => {
                if (err) {
                }
                if (tipo > 1) {
                    var link = consagrados[tipo - 3];
                } else {
                    var link = consagrados[3];
                }
                const embed = new RichEmbed().setImage(link);
                canal.send(embed);
                return true;
            });
        }
    });
}


module.exports = {
    fnCopypastaRandom: fnCopypastaRandom,
    fnMeusBacanos: fnMeusBacanos,
    fnCopyEmojiJenas: fnCopyEmojiJenas,
    fnEnviaMsgCumprimento: fnEnviaMsgCumprimento,
    fnBuscaJogosUser: fnBuscaJogosUser,
    fnBuscaJogos: fnBuscaJogos,
    fnHelp: fnHelp,
    fnPistolette: fnPistolette,
    fnVer: fnVer,
    fnBuscaImg: fnBuscaImg,
    fnTabajara: fnTabajara,
    fnParaDeSerNormie: fnParaDeSerNormie,
    fnFakePing: fnFakePing,
    fnEnviaEmojiAnimado: fnEnviaEmojiAnimado,
    fnEnviaCopypastaEscolhida: fnEnviaCopypastaEscolhida,
    fnRinhaDeBot: fnRinhaDeBot,
    fnCapturarCopypasta: fnCapturarCopypasta,
    fnTopJogos: fnTopJogos,
    fnListaCopypastas: fnListaCopypastas,
    fnRoulette: fnRoulette,
    fnSenpi: fnSenpi,
    fnRoletaTop: fnRoletaTop
    
}