
const { RichEmbed } = require('discord.js');
const cooldownSet = new Set();
const {dictionary,consagrados} = require('./resources');


function fnChecaReactIMG(db, msgReact, user) {
    db.all('SELECT * FROM IMG WHERE ID_MSG = $msgid and ID_GUILD = $guildid and ID_USER = $userid ', {
      $msgid: msgReact.message.id, $guildid: msgReact.message.guild.id, $userid: user.id
    }, function (err, row) {
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
            db.run('UPDATE IMG SET NRO_ATUAL = $nroatual WHERE ID_MSG = $msgid AND ID_GUILD = $guildid AND ID_USER = $userid', {
              $nroatual: nroatual, $msgid: msgReact.message.id, $guildid: msgReact.message.guild.id, $userid: user.id
            }, function (err, row) {
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
  

function fnUpdateRegistro(usuario, jogo, guilda, data, db) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    if (data != today) {
        db.run('UPDATE jpu SET DATA = $today WHERE ID_USUARIO = $iduser and NOME_JOGO = $nomejogo and GUILDA = $idguild',{
            $today: today,
            $iduser: u,
            $nomejogo: jogo,
            $idguild: guilda
        }, function(err, row) {
            if (err) {
                return false;
            }
            return true;
        });
    }
}

function fnInsertRegistro(usuario, jogo, guilda, db) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    db.run(`INSERT INTO jpu(ID_USUARIO,NOME_JOGO,DATA,guilda) VALUES($iduser, $nomejogo, $today, $idguild)`,{
        $iduser: usuario,
        $nomejogo: jogo,
        $today: today,
        $idguild: guilda
    }, function(err, row) {
        if (err) {
            return false;
        }
        return true;
    });
}

function fnGerarEmojiMsg(nomeEmoji, idEmoji, animado) {
    let str;
    if (animado) {
        str = '<a:';
    } else {
        str = '<:';
    }
    return str + nomeEmoji + ':' + idEmoji + '>';
}

function fnMarkdownMsg(str) {
    change = '```';
    change = change + str;
    return change + ' ```';
}
function fnGravarRoleta(usuario, guilda, morte, db) {
    db.all('select * from roleta WHERE id_user = $iduser and guilda= $idguild', {
        $iduser: usuario,
        $idguild: guilda
    }, function (err, row) {
        if (err) {
            throw err;
        }
        if (row != null && row.length > 0) {
            let lstmorte = new Array(morte);
            lstmorte = row;
            let nrotentativas = parseInt(lstmorte[0].num_tentativas);
            let nummortes = parseInt(lstmorte[0].num_morte);
            if (morte) { nummortes = nummortes+1 }else{ nrotentativas = nrotentativas+1 };
                db.run('UPDATE roleta SET num_morte = $nromortes and num_tentativas = $numtentativas WHERE id_user = $iduser and guilda= $idguild', {
                    $nromortes: nummortes,
                    $iduser: usuario,
                    $idguild: guilda,
                    $numtentativas: nrotentativas
                }, function (err, row) {
                    if (err) {
                        console.log('erro editar');
                        return false;
                    }
                    return true;
                });
        } else {
                let nummortes = 0;
                let numtentativas = 0;
                if(morte){ nummortes = 1}else{ numtentativas = 1; }
                db.run(`INSERT INTO roleta(id_user,num_morte,guilda,num_tentativas) VALUES($iduser, $nummortes, $idguild, $numtentativas)`,{
                    $iduser: usuario,
                    $nummortes: nummortes,
                    $idguild: guilda,
                    $numtentativas: numtentativas
                }, function(err, row) {
                    if (err) {
                        console.log('erro editar');
                        return false;
                    }
                    return true;
                });
        }
    });
}


function fnBuscaCooldown(guilda, comando, data, channel) {
    if (cooldownSet.has(guilda + comando)) {
        channel.send('Espere um pouco para utilizar esse comando.').then(message =>
            message.delete(4000));
        return false;
    } else {
        cooldownSet.add(guilda + comando);
        setTimeout(() => {
            cooldownSet.delete(guilda + comando);
        }, 5000);
        return true;
    }
}

function fnBuscaId(usuario, jogo, newMember, guilda, db) {
    const blacklist = 2;
    db.all(`SELECT * FROM jpu where ` + dictionary[blacklist] + ` ID_USUARIO =  $iduser and upper(NOME_JOGO) = $nomejogo and GUILDA = $idguild`,{
        $iduser:usuario,
        $nomejogo: jogo.toUpperCase(),
    } , function(err, row) {
        if (err) {
            throw err;
        }
        if (row != null && row.length > 0) {
            const objects = require('./objects');
            let listusr = new Array(objects.jpu);
            listusr = row;
            listusr.forEach(element => {
                fnUpdateRegistro(newMember.user.id, newMember.presence.game.toString(), guilda, element.DATA, db);
            });

        } else {
            fnInsertRegistro(newMember.user.id, newMember.presence.game.toString(), guilda, db);
        }
    });
}

function fnValidaUsername(item) {
    if (item.user.username.toUpperCase().includes(nomeusr.toUpperCase())) {
        return true;
    } else { return false; }
}

function fnValidaNickname (item) {
    if (item.nickname != null) {
        if (item.nickname.toUpperCase().includes(nomeusr.toUpperCase())) {
            return true;
        } else { return false; }
    } else {
        return false;
    }
}

function fnQuitaSenpi(usuario, db) {
    const objects = require('./objects');
    db.all('select * from SENPI', function(err, row) {
        if (err) {
            return false;
        }
        if (row != null && row.length > 0) {
            let lstsenpi = new Array(objects.senpi);
            lstsenpi = row;
            db.run('UPDATE SENPI SET QUITADAS = $quitadas',{
                $quitadas:(parseInt(lstsenpi[0].QUITADAS) + 1)
            }, function (err, row) {
                if (err) {
                    return false;
                }
                return true;
            });
        }
    });
}

module.exports = {
    //funcao para contabilizar as mortes
    fnGravarRoleta: fnGravarRoleta,

    //função que gera o cooldown
    fnBuscaCooldown: fnBuscaCooldown,

    //função que verifica se o jogo está no BD, se não estiver grava, se estiver atualiza data
    fnBuscaId: fnBuscaId,

    //função que verifica se o username existe
    fnValidaUsername: fnValidaUsername,

    //função que verifica se o nickname existe
    fnValidaNickname: fnValidaNickname,

    //função que grava no registro um jogo por usuario
    fnQuitaSenpi: fnQuitaSenpi,

    fnMarkdownMsg: fnMarkdownMsg,

    fnGerarEmojiMsg: fnGerarEmojiMsg,
    //função que dá update no registro num jogo por usuario
    fnUpdateRegistro: fnUpdateRegistro,
    //função que grava no registro um jogo por usuario
    fnInsertRegistro: fnInsertRegistro
}