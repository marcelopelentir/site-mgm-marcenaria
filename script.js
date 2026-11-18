/* ==========================================================================
   MGM Marcenaria — comportamento
   ========================================================================== */


/* MENU MOBILE ----------------------------------------------------------------
   O estado (aberto/fechado) mora no atributo aria-expanded do botão.
   O CSS lê esse atributo para mostrar o painel; o leitor de tela também. */

const botaoMenu = document.querySelector('.cabecalho__botao');
const menu = document.querySelector('#menu-principal');

function definirMenu(aberto) {
  botaoMenu.setAttribute('aria-expanded', aberto);
  botaoMenu.textContent = aberto ? 'Fechar' : 'Menu';
  document.body.classList.toggle('menu-aberto', aberto);
}

// Clique no botão: inverte o estado atual
botaoMenu.addEventListener('click', () => {
  const estaAberto = botaoMenu.getAttribute('aria-expanded') === 'true';
  definirMenu(!estaAberto);
});

// Clique em qualquer link do menu: fecha (a página rola até a âncora)
menu.addEventListener('click', (evento) => {
  if (evento.target.closest('a')) {
    definirMenu(false);
  }
});

// Tecla Esc: fecha e devolve o foco ao botão, para quem navega pelo teclado
document.addEventListener('keydown', (evento) => {
  const estaAberto = botaoMenu.getAttribute('aria-expanded') === 'true';

  if (evento.key === 'Escape' && estaAberto) {
    definirMenu(false);
    botaoMenu.focus();
  }
});


/* ABAS (página de projetos comerciais) ---------------------------------------
   Funciona em qualquer elemento com data-abas. O painel ativo é o único sem
   o atributo hidden. Setas esquerda/direita trocam de aba, como pede o padrão
   de acessibilidade para abas. */

document.querySelectorAll('[data-abas]').forEach((grupo) => {
  const botoes = [...grupo.querySelectorAll('[role="tab"]')];
  const paineis = grupo.querySelectorAll('[role="tabpanel"]');

  function ativar(botao) {
    botoes.forEach((b) => {
      const ativo = b === botao;
      b.setAttribute('aria-selected', ativo);
      b.tabIndex = ativo ? 0 : -1;   // só a aba ativa recebe foco pelo Tab
    });
    paineis.forEach((painel) => {
      painel.hidden = painel.id !== botao.getAttribute('aria-controls');
    });
  }

  botoes.forEach((botao, i) => {
    botao.addEventListener('click', () => ativar(botao));

    botao.addEventListener('keydown', (evento) => {
      if (evento.key !== 'ArrowRight' && evento.key !== 'ArrowLeft') return;
      const passo = evento.key === 'ArrowRight' ? 1 : -1;
      const proximo = botoes[(i + passo + botoes.length) % botoes.length];
      proximo.focus();
      ativar(proximo);
    });
  });

  ativar(botoes[0]);
});
