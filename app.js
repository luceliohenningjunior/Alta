// =====================================================================
//  Lógica do app. Os textos ficam em conteudo.js; aqui é só comportamento.
//  Todos os dados do paciente ficam no próprio aparelho (localStorage).
// =====================================================================
(function () {
  "use strict";

  var C = window.CONTEUDO;
  var CHAVE = "cuidar-em-casa-v1";
  var tela = document.getElementById("tela");

  // ---------- Dados no aparelho ----------
  function dadosVazios() {
    return { paciente: { nome: "", cuidador: "", dataAlta: "", profissional: "" }, remedios: [], cuidados: [], contatos: [], checks: {} };
  }
  function carregar() {
    try {
      var d = JSON.parse(localStorage.getItem(CHAVE));
      if (d && d.paciente) return Object.assign(dadosVazios(), d);
    } catch (e) { /* aparelho sem armazenamento: segue com dados vazios */ }
    return dadosVazios();
  }
  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (e) { /* idem */ }
  }
  var dados = carregar();

  // ---------- Utilidades ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function horarios(texto) {
    var lista = String(texto || "").match(/\d{1,2}[:h]\d{2}|\b\d{1,2}h\b/g) || [];
    return lista.map(function (h) {
      var p = h.replace("h", ":").split(":");
      return ("0" + parseInt(p[0], 10)).slice(-2) + ":" + ((p[1] || "00") + "00").slice(0, 2);
    }).filter(function (h, i, a) { return a.indexOf(h) === i; }).sort();
  }
  function hojeISO() {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  function agoraHM() {
    var d = new Date();
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }
  function dataBR(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }
  function soDigitos(t) { return String(t || "").replace(/[^\d+]/g, ""); }
  function primeiroNome() { return (dados.paciente.nome || "").trim().split(/\s+/)[0]; }

  // Monta a agenda do dia: cada remédio/cuidado em cada horário
  function agendaDoDia() {
    var itens = [];
    dados.remedios.forEach(function (r, i) {
      horarios(r.horarios).forEach(function (h) {
        itens.push({ id: "r" + i + "@" + h, hora: h, nome: r.nome, detalhe: [r.dose, r.para && "para " + r.para.toLowerCase()].filter(Boolean).join(" · "), tipo: "💊 Remédio" });
      });
    });
    dados.cuidados.forEach(function (c, i) {
      horarios(c.horarios).forEach(function (h) {
        itens.push({ id: "c" + i + "@" + h, hora: h, nome: c.texto, detalhe: "", tipo: "💚 Cuidado" });
      });
    });
    return itens.sort(function (a, b) { return a.hora < b.hora ? -1 : a.hora > b.hora ? 1 : 0; });
  }
  function checksHoje() {
    var hoje = hojeISO();
    // guarda só o dia de hoje: o checklist zera sozinho na virada do dia
    if (!dados.checks[hoje]) { dados.checks = {}; dados.checks[hoje] = {}; }
    return dados.checks[hoje];
  }

  // ---------- Telas ----------
  var telas = {
    inicio: { titulo: C.app.nome, render: function () {
      var nome = primeiroNome();
      var agenda = agendaDoDia(), feitos = checksHoje(), agora = agoraHM();
      var prox = agenda.filter(function (i) { return !feitos[i.id] && i.hora >= agora; })[0];
      var h = "";
      if (nome) {
        h += '<p class="suave">Cuidados de</p><p class="saudacao">' + esc(dados.paciente.nome) + "</p>";
      } else {
        h += '<div class="cartao proximo"><p style="margin:0 0 .5rem"><strong style="font-size:1.2rem">Bem-vindo!</strong>' + esc(C.app.subtitulo) + '.</p><a class="botao cheio" href="#dados">Preencher dados da alta</a></div>';
      }
      if (prox) {
        h += '<a class="cartao proximo" href="#hoje" style="display:block;text-decoration:none;color:inherit;margin-top:1rem">' +
          '<span class="suave">Próximo cuidado</span><strong>' + prox.hora + "</strong>" + esc(prox.nome) + "</a>";
      } else if (agenda.length) {
        h += '<div class="cartao proximo" style="margin-top:1rem"><strong>Tudo certo por hoje ✔</strong></div>';
      }
      h += '<div class="atalhos">' +
        '<a class="atalho" href="#hoje"><span>✅</span>Hoje</a>' +
        '<a class="atalho" href="#cuidados"><span>💚</span>Cuidados</a>' +
        '<a class="atalho" href="#alertas"><span>⚠️</span>Sinais de alerta</a>' +
        '<a class="atalho" href="#contatos"><span>☎️</span>Contatos</a>' +
        '<a class="atalho largo" href="#dados"><span>📝</span>Meus dados</a>' +
        '<button class="atalho largo" type="button" data-acao="imprimir"><span>🖨️</span>Imprimir cartilha</button>' +
        "</div>";
      return h;
    } },

    hoje: { titulo: "Hoje", render: function () {
      var agenda = agendaDoDia();
      if (!agenda.length) return vazio("Ainda não há remédios ou cuidados com horário.", "#dados", "Cadastrar em Meus dados");
      var feitos = checksHoje(), agora = agoraHM();
      var n = agenda.filter(function (i) { return feitos[i.id]; }).length;
      var d = new Date();
      var h = '<p class="suave" style="margin:0">' + d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }) + "</p>" +
        '<p style="margin:.2rem 0 0;font-weight:700">' + n + " de " + agenda.length + " feitos</p>" +
        '<div class="progresso" aria-hidden="true"><div style="width:' + Math.round(100 * n / agenda.length) + '%"></div></div>';
      var horaAtual = null;
      h += '<ul class="lista-hoje">';
      agenda.forEach(function (i) {
        if (i.hora !== horaAtual) {
          horaAtual = i.hora;
          h += '<li class="grupo-hora' + (i.hora < agora ? " passou" : "") + '">' + i.hora + "</li>";
        }
        var ok = !!feitos[i.id];
        h += '<li><label class="item-check' + (ok ? " feito" : "") + '">' +
          '<input type="checkbox" data-check="' + esc(i.id) + '"' + (ok ? " checked" : "") + ">" +
          '<span><span class="tipo">' + i.tipo + '</span><span class="nome">' + esc(i.nome) + "</span>" +
          (i.detalhe ? '<span class="tipo">' + esc(i.detalhe) + "</span>" : "") + "</span></label></li>";
      });
      return h + "</ul>";
    } },

    cuidados: { titulo: "Cuidados", render: function (sub) {
      var area = C.areas.filter(function (a) { return a.id === sub; })[0];
      if (!area) {
        return '<p class="suave">Escolha um assunto:</p><div class="atalhos" style="grid-template-columns:1fr">' +
          C.areas.map(function (a) {
            return '<a class="atalho largo" href="#cuidados/' + a.id + '"><span>' + a.icone + "</span>" + esc(a.titulo) + "</a>";
          }).join("") + "</div>";
      }
      definirTitulo(area.icone + " " + area.titulo, "#cuidados");
      return '<section class="bloco-fazer"><h3>O que fazer</h3><ul class="topicos">' + lis(area.fazer) + "</ul></section>" +
        '<section class="bloco-procurar"><h3>⚠️ Quando procurar ajuda</h3><ul class="topicos">' + lis(area.procurar) + "</ul>" +
        '<div class="linha-botoes"><a class="botao" href="#contatos">Ver contatos</a></div></section>';
    } },

    alertas: { titulo: "Sinais de alerta", render: function () {
      return C.alertas.map(function (a) {
        var botao = a.id === "samu" ? '<a class="botao" style="background:var(--cor-perigo);border-color:var(--cor-perigo)" href="tel:192">📞 Ligar 192</a>'
          : '<a class="botao secundario" href="#contatos">Ver telefone</a>';
        return '<section class="alerta ' + a.cor + '"><h2>' + esc(a.titulo) + '</h2><ul class="topicos">' + lis(a.itens) + "</ul>" +
          (a.nota ? '<p class="nota">' + esc(a.nota) + "</p>" : "") + '<div class="linha-botoes">' + botao + "</div></section>";
      }).join("");
    } },

    contatos: { titulo: "Contatos", render: function () {
      var h = '<div class="cartao contato" style="border:2px solid var(--cor-perigo)"><div><strong>SAMU</strong><div class="papel">Emergência</div></div>' +
        '<a class="botao" style="background:var(--cor-perigo);border-color:var(--cor-perigo)" href="tel:192">📞 192</a></div>';
      if (!dados.contatos.length) return h + vazio("Nenhum contato cadastrado.", "#dados", "Cadastrar em Meus dados");
      return h + dados.contatos.map(function (c) {
        var tel = soDigitos(c.telefone);
        return '<div class="cartao contato"><div><strong>' + esc(c.nome) + '</strong><div class="papel">' + esc(c.papel) + " · " + esc(c.telefone) + "</div></div>" +
          (tel ? '<a class="botao" href="tel:' + esc(tel) + '" aria-label="Ligar para ' + esc(c.nome) + '">📞 Ligar</a>' : "") + "</div>";
      }).join("");
    } },

    dados: { titulo: "Meus dados", render: function () {
      var p = dados.paciente;
      var h = '<p class="suave">Preenchido pela equipe no momento da alta. Os dados ficam guardados só neste aparelho.</p>' +
        '<form id="form-dados" autocomplete="off">' +
        '<section class="cartao"><h2>Paciente</h2>' +
        campo("Nome do paciente", "paciente.nome", p.nome) +
        campo("Cuidador principal", "paciente.cuidador", p.cuidador) +
        campo("Data da alta", "paciente.dataAlta", p.dataAlta, "date") +
        campo("Equipe ou profissional responsável", "paciente.profissional", p.profissional) + "</section>";

      h += lista("Remédios", "remedios", dados.remedios, function (r, i) {
        return campo("Remédio", "remedios." + i + ".nome", r.nome) + campo("Dose", "remedios." + i + ".dose", r.dose) +
          campo("Para quê", "remedios." + i + ".para", r.para) +
          campo("Horários", "remedios." + i + ".horarios", r.horarios, "text", "Ex.: 08:00, 14:00, 20:00");
      });
      h += lista("Cuidados com horário", "cuidados", dados.cuidados, function (c, i) {
        return campo("Cuidado", "cuidados." + i + ".texto", c.texto) +
          campo("Horários", "cuidados." + i + ".horarios", c.horarios, "text", "Ex.: 08:00, 20:00");
      });
      h += lista("Contatos", "contatos", dados.contatos, function (c, i) {
        return campo("Nome", "contatos." + i + ".nome", c.nome) + campo("Quem é (equipe, UBS, filho...)", "contatos." + i + ".papel", c.papel) +
          campo("Telefone", "contatos." + i + ".telefone", c.telefone, "tel");
      });
      h += "</form>" +
        '<div class="linha-botoes"><button type="button" class="botao" data-acao="imprimir">🖨️ Imprimir cartilha</button>' +
        '<button type="button" class="botao secundario" data-acao="exemplo">Preencher exemplo</button>' +
        '<button type="button" class="botao perigo" data-acao="apagar">Apagar tudo</button></div>';
      return h;
    } },
  };

  // ---------- Pedaços de HTML ----------
  function lis(itens) { return itens.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join(""); }
  function vazio(texto, link, rotulo) {
    return '<div class="cartao vazio"><p>' + esc(texto) + '</p><a class="botao" href="' + link + '">' + esc(rotulo) + "</a></div>";
  }
  function campo(rotulo, caminho, valor, tipo, dica) {
    var id = "f-" + caminho.replace(/\./g, "-");
    return '<label for="' + id + '">' + esc(rotulo) + "</label>" +
      '<input id="' + id + '" type="' + (tipo || "text") + '" data-campo="' + caminho + '" value="' + esc(valor) + '">' +
      (dica ? '<div class="dica">' + esc(dica) + "</div>" : "");
  }
  function lista(titulo, chave, itens, montar) {
    return '<section class="cartao"><h2>' + titulo + "</h2>" +
      itens.map(function (it, i) {
        return '<div class="subitem">' + montar(it, i) + '<button type="button" class="remover" data-remover="' + chave + "." + i + '">Remover</button></div>';
      }).join("") +
      '<div class="linha-botoes"><button type="button" class="botao secundario" data-adicionar="' + chave + '">+ Adicionar</button></div></section>';
  }

  // ---------- Cartilha impressa ----------
  function montarCartilha() {
    var p = dados.paciente;
    var linha = function (v) { return v ? esc(v) : '<span class="c-linha">&nbsp;</span>'; };
    var h = (C.rascunho ? '<div class="c-rascunho">RASCUNHO · conteúdo em validação pela equipe</div>' : "") +
      '<section class="c-capa"><h1>' + esc(C.app.nome) + '</h1><p class="c-sub">' + esc(C.app.subtitulo) + "</p>" +
      '<div class="c-ficha"><p><strong>Paciente:</strong> ' + linha(p.nome) + "</p>" +
      "<p><strong>Cuidador:</strong> " + linha(p.cuidador) + "</p>" +
      "<p><strong>Data da alta:</strong> " + linha(dataBR(p.dataAlta)) + "</p>" +
      "<p><strong>Equipe responsável:</strong> " + linha(p.profissional) + "</p></div>" +
      '<div class="c-emergencia">EMERGÊNCIA: SAMU 192</div></section>';

    // Tabela de remédios e cuidados: uma linha por horário, caixas para marcar na semana
    var agenda = agendaDoDia();
    h += '<section class="c-secao"><h2>Remédios e cuidados do dia</h2>';
    if (agenda.length) {
      h += '<p>Marque um X quando fizer. Uma coluna para cada dia da semana.</p><table class="c-tabela"><thead><tr><th>Hora</th><th>O que fazer</th>' +
        ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(function (d) { return "<th>" + d + "</th>"; }).join("") + "</tr></thead><tbody>" +
        agenda.map(function (i) {
          return '<tr><td class="c-hora">' + i.hora + "</td><td><strong>" + esc(i.nome) + "</strong>" + (i.detalhe ? "<br>" + esc(i.detalhe) : "") + "</td>" +
            new Array(8).join('<td class="c-caixa"></td>') + "</tr>";
        }).join("") + "</tbody></table>";
    } else {
      h += '<table class="c-tabela"><thead><tr><th>Hora</th><th>Remédio / cuidado</th><th>Dose</th></tr></thead><tbody>' +
        new Array(11).join("<tr><td>&nbsp;</td><td></td><td></td></tr>") + "</tbody></table>";
    }
    h += "</section>";

    h += '<section class="c-secao"><h2>Telefones importantes</h2><table class="c-tabela"><tbody>' +
      '<tr><td><strong>SAMU (emergência)</strong></td><td class="c-hora">192</td></tr>' +
      (dados.contatos.length ? dados.contatos.map(function (c) {
        return "<tr><td><strong>" + esc(c.nome) + "</strong> (" + esc(c.papel) + ')</td><td class="c-hora">' + esc(c.telefone) + "</td></tr>";
      }).join("") : new Array(5).join("<tr><td>&nbsp;</td><td></td></tr>")) + "</tbody></table></section>";

    h += '<section class="c-secao c-quebra"><h2>Sinais de alerta</h2>' + C.alertas.map(function (a) {
      return '<div class="c-alerta ' + a.cor + '"><h3>' + esc(a.titulo) + "</h3><ul>" + lis(a.itens) + "</ul>" +
        (a.nota ? "<p><em>" + esc(a.nota) + "</em></p>" : "") + "</div>";
    }).join("") + "</section>";

    h += C.areas.map(function (a) {
      return '<section class="c-secao"><h2>' + esc(a.titulo) + "</h2><h3>O que fazer</h3><ul>" + lis(a.fazer) + "</ul>" +
        '<div class="c-procurar"><h3 style="margin-top:0">Quando procurar ajuda</h3><ul>' + lis(a.procurar) + "</ul></div></section>";
    }).join("");

    document.getElementById("cartilha").innerHTML = h;
  }
  window.addEventListener("beforeprint", montarCartilha);
  function imprimir() { montarCartilha(); window.print(); }

  // ---------- Navegação ----------
  function definirTitulo(texto, voltarPara) {
    document.getElementById("titulo-tela").textContent = texto;
    var v = document.getElementById("voltar");
    v.hidden = !voltarPara;
    if (voltarPara) v.setAttribute("href", voltarPara);
  }
  function mostrar() {
    var partes = (location.hash.slice(1) || "inicio").split("/");
    var nome = telas[partes[0]] ? partes[0] : "inicio";
    definirTitulo(telas[nome].titulo, nome === "inicio" ? null : "#inicio");
    tela.innerHTML = telas[nome].render(partes[1]);
    document.querySelectorAll(".abas a").forEach(function (a) {
      a.classList.toggle("ativa", a.dataset.aba === nome);
      if (a.dataset.aba === nome) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("hashchange", function () { mostrar(); window.scrollTo(0, 0); tela.focus({ preventScroll: true }); });

  // ---------- Eventos ----------
  tela.addEventListener("change", function (e) {
    var alvo = e.target;
    if (alvo.dataset.check) {
      checksHoje()[alvo.dataset.check] = alvo.checked;
      salvar();
      var y = window.scrollY; mostrar(); window.scrollTo(0, y);
    }
  });
  tela.addEventListener("input", function (e) {
    var caminho = e.target.dataset.campo;
    if (!caminho) return;
    var p = caminho.split("."), obj = dados;
    for (var i = 0; i < p.length - 1; i++) obj = obj[p[i]];
    obj[p[p.length - 1]] = e.target.value;
    salvar();
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.acao === "imprimir") imprimir();
    if (b.dataset.acao === "exemplo") {
      if (dadosPreenchidos() && !confirm("Substituir os dados atuais pelo exemplo?")) return;
      dados = Object.assign(dadosVazios(), JSON.parse(JSON.stringify(C.exemplo)));
      salvar(); mostrar();
    }
    if (b.dataset.acao === "apagar") {
      if (!confirm("Apagar todos os dados deste aparelho?")) return;
      dados = dadosVazios(); salvar(); mostrar();
    }
    if (b.dataset.adicionar) {
      var novo = { remedios: { nome: "", dose: "", para: "", horarios: "" }, cuidados: { texto: "", horarios: "" }, contatos: { nome: "", papel: "", telefone: "" } }[b.dataset.adicionar];
      dados[b.dataset.adicionar].push(novo); salvar();
      var y = window.scrollY; mostrar(); window.scrollTo(0, y);
    }
    if (b.dataset.remover) {
      var r = b.dataset.remover.split(".");
      dados[r[0]].splice(+r[1], 1);
      dados.checks = {}; // os índices mudaram; evita marcar o item errado
      salvar();
      var y2 = window.scrollY; mostrar(); window.scrollTo(0, y2);
    }
  });
  function dadosPreenchidos() {
    return dados.paciente.nome || dados.remedios.length || dados.cuidados.length || dados.contatos.length;
  }

  if (C.rascunho) document.getElementById("faixa-rascunho").hidden = false;
  document.title = C.app.nome;
  mostrar();
})();
