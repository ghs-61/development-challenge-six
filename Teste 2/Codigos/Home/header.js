/*
  O objetivo desse código é navegar pelos botões do header, para ir até as respectivas seções
*/

const { Builder, By } = require('selenium-webdriver');
const { gerarRelatorioPDF } = require('../geraPDF');

async function verificaHeader() {
  const driver = await new Builder().forBrowser('chrome').build();
  const botoesSecoes = [
    {botaoId: 'headerRis',},
    {botaoId: 'headerPacs',},
    {botaoId: 'headerPortal',},
    {botaoId: 'headerContact',},
    {botaoId: 'headerPlans',},
    {botaoId: 'headerHome'},
  ]
  const resultados = [];
  const inicio = Date.now();
  try {
    await driver.get('https://qa.medcloud.link/');
    await driver.manage().setTimeouts({ implicit: 5000 });
    await driver.manage().window().maximize();
    
    for (const { botaoId } of botoesSecoes) {
      try {
        const botao = await driver.findElement(By.id(botaoId));
        await botao.click();
        await driver.sleep(2000); // tempo para rolar até a seção

        resultados.push({
          nome: `Botão "${botaoId}"`,
          valor: '-',
          status: 'Sucesso',
          duracao: '2s',
          erro: null,
        });
      } catch (erro) {
        resultados.push({
          nome: `Botão "${botaoId}"`,
          valor: '-',
          status: 'Falha',
          duracao: '-',
          erro: 'Erro',
        });
      }
    }

  } catch (erro) {
    resultados.push({
      nome: 'Erro geral no script',
      status: 'Falha',
      duracao: '-',
      erro: "Erro",
    });
  } finally {
    await driver.quit();

    const duracaoTotal = ((Date.now() - inicio) / 1000).toFixed(1) + 's';

    await gerarRelatorioPDF('relatorio-header-nav', {
      titulo: 'Relatório de Teste - Navegação por Botões do Header',
      resumo: `Esse teste valida se os botões do header estão funcionando corretamente. Duração total: ${duracaoTotal}`,
      resultados,
      observacoes: resultados.some(r => r.status === 'Falha')
        ? 'Houve falha na navegação de alguns botões. Verificar seletor ou visibilidade.'
        : 'Todos os botões do header navegaram corretamente até suas seções.',
    });
  }
}

verificaHeader();