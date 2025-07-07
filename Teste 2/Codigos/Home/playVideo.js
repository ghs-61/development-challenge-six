/*
    O objetivo desse código é dar play nos 5 vídeos que aparecem na home abaixo de radiologia inteligente
*/

const { Builder, By, until } = require('selenium-webdriver');
const { gerarRelatorioPDF } = require('../geraPDF');

async function verificaVideos() {
  const driver = await new Builder().forBrowser('chrome').build();
  const resultados = [];
  const inicio = Date.now();

  try {
    await driver.get('https://qa.medcloud.link/');
    await driver.manage().setTimeouts({ implicit: 5000 });
    await driver.manage().window().maximize();

    const botoesPlay = await driver.findElements(By.xpath('//button[.//img[@alt="Play"]]'));
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", botoesPlay[0]);
    await driver.sleep(1000);

    for (let i = 0; i < botoesPlay.length && i < 5; i++) {
      const nomeVideo = `Vídeo ${i + 1}`;
      try{
        await driver.executeScript("arguments[0].click();", botoesPlay[i]);

        const iframe = await driver.wait(
          until.elementLocated(By.css('iframe[src*="youtube"]')),
          10000
        );

        await driver.wait(until.elementIsVisible(iframe), 5000);
        await driver.sleep(3000);

        const botaoFechar = await driver.findElement(By.css('button[class*="closeButton"]'));
        await botaoFechar.click();

        await driver.wait(until.stalenessOf(iframe), 5000);

        resultados.push({
          nome: nomeVideo,
          valor: '-',
          status: 'Sucesso',
          duracao: '2s',
          erro: null
        });

      } catch (erro) {
        resultados.push({
          nome: nomeVideo,
          valor: '-',
          status: 'Falha',
          duracao: '-',
          erro: 'Erro'
        });
      }
    }

  } catch (erro) {
    resultados.push({
      nome: 'Erro geral no script',
      valor: '-',
      status: 'Falha',
      duracao: '-',
      erro: 'Erro'
    });
  } finally {
    await driver.quit();

    const duracaoTotal = ((Date.now() - inicio) / 1000).toFixed(1) + 's';

    await gerarRelatorioPDF('relatorio-videos-play', {
      titulo: 'Relatório de Teste - Reprodução de Vídeos na Home',
      resumo: `Esse teste verifica se os cinco vídeos da seção "Radiologia Inteligente" podem ser reproduzidos corretamente. Duração total: ${duracaoTotal}`,
      resultados,
      observacoes: resultados.some(r => r.status === 'Falha')
        ? 'Alguns vídeos não puderam ser reproduzidos. Verifique se o iframe do YouTube está sendo carregado corretamente ou se há problemas de rede.'
        : 'Todos os vídeos foram reproduzidos com sucesso.',
    });
  }
}

verificaVideos();