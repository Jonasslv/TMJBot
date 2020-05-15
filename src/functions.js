function fnUpdateRegistro (usuario, jogo, guilda, data, db) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    if (data != today) {
        db.run('UPDATE jpu SET DATA = "' + today + '" WHERE ID_USUARIO = "' + usuario + '" and NOME_JOGO = "' + jogo + '"' + 'and GUILDA = "' + guilda + '"', (err, row) => {
            if (err) {
                return false;
            }
            return true;
        });
    }
}

function fnInsertRegistro (usuario, jogo, guilda, db) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    db.run(`INSERT INTO jpu(ID_USUARIO,NOME_JOGO,DATA,guilda) VALUES("` + usuario + '","' + jogo + '","' + today + '","' + guilda + '")', (err, row) => {
        if (err) {
            return false;
        }
        return true;
    });
}

const { RichEmbed } = require('discord.js');
const cooldownSet = new Set();

module.exports = {
    //funcao para contabilizar as mortes
    fnRoleta: function (usuario, guilda, morte, db) {
        db.all('select * from roleta WHERE id_user = "' + usuario + '" and guilda= "' + guilda + '"', (err, row) => {
            if (err) {
                throw err;
            }
            if (row != null && row.length > 0) {
                let lstmorte = new Array(morte);
                lstmorte = row;
                if (morte) {
                    db.run('UPDATE roleta SET num_morte = ' + (parseInt(lstmorte[0].num_morte) + 1) + ' WHERE id_user = "' + usuario + '" and guilda= "' + guilda + '"', (err, row) => {
                        if (err) {
                            console.log('erro editar');
                            return false;
                        }
                        return true;
                    });
                } else {
                    db.run('UPDATE roleta SET num_tentativas = ' + (parseInt(lstmorte[0].num_tentativas) + 1) + ' WHERE id_user = "' + usuario + '" and guilda= "' + guilda + '"', (err, row) => {
                        if (err) {
                            console.log('erro editar');
                            return false;
                        }
                        return true;
                    });
                }
            } else {
                if (morte) {
                    db.run(`INSERT INTO roleta(id_user,num_morte,guilda,num_tentativas) VALUES("` + usuario + '", 1 ,"' + guilda + '",0)', (err, row) => {
                        if (err) {
                            console.log('erro editar');
                            return false;
                        }
                        return true;
                    });
                } else {
                    db.run(`INSERT INTO roleta(id_user,num_tentativas,guilda,num_morte) VALUES("` + usuario + '", 1 ,"' + guilda + '",0)', (err, row) => {
                        if (err) {
                            console.log('erro editar');
                            return false;
                        }
                        return true;
                    });
                }
            }
        });
    },


    //função que gera o cooldown
    fnBuscaCooldown: function (guilda, comando, data, channel) {
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
    },


    //função que verifica se o jogo está no BD, se não estiver grava, se estiver atualiza data
    fnBuscaId: function (usuario, jogo, newMember, guilda, db) {
        db.all(`SELECT * FROM jpu where ` + blacklist + ` ID_USUARIO = "` + usuario + '" and upper(NOME_JOGO) = upper("' + jogo + '")' + 'and GUILDA = "' + guilda + '"', (err, row) => {
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
                fnInsertRegistro(newMember.user.id, newMember.presence.game.toString(), guilda,db);
            }
        });
    },

    //função que verifica se o username existe
    fnValidaUsername: function (item) {
        if (item.user.username.toUpperCase().includes(nomeusr.toUpperCase())) {
            return true;
        } else { return false; }
    },

    //função que verifica se o nickname existe
    fnValidaNickname: function (item) {
        if (item.nickname != null) {
            if (item.nickname.toUpperCase().includes(nomeusr.toUpperCase())) {
                return true;
            } else { return false; }
        } else {
            return false;
        }
    },

    //função que grava no registro um jogo por usuario
    fnInsertRegistro: fnInsertRegistro,

    //função que grava no registro um jogo por usuario
    fnQuitaSenpi: function (usuario, db) {
        db.all('select * from SENPI', (err, row) => {
            if (err) {
                return false;
            }
            if (row != null && row.length > 0) {
                let lstsenpi = new Array(senpi);
                lstsenpi = row;
                db.run('UPDATE SENPI SET QUITADAS = ' + (parseInt(lstsenpi[0].QUITADAS) + 1), (err, row) => {
                    if (err) {
                        return false;
                    }
                    return true;
                });
            }
        });
    },

    //função que dá update no registro num jogo por usuario
    fnUpdateRegistro: fnUpdateRegistro,

    //função que verifica se a data do dia já foi notada, caso não, envia imagem e grava no banco o status do dia
    fnMeusBacanos: function (guilda, tipo, data, canal, db) {
        const resources = require('./resources');
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
                        var link = resources.consagrados[tipo - 3];
                    } else {
                        var link = resources.consagrados[3];
                    }
                    const embed = new RichEmbed().setImage(link);
                    canal.send(embed);
                    return true;
                });
            }
        });
    }
}