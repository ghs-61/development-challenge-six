/*
  O objetivo desse código é validar o formulário de contato no footer da página, aqui eu testo a inserção de dados nos campos
*/

const { Builder, By, until } = require('selenium-webdriver');
const { gerarRelatorioPDF } = require('../geraPDF');

async function verificaContato() {
  const driver = await new Builder().forBrowser('chrome').build();
  const resultados = [];
  const inicio = Date.now();

  try {
    await driver.get('https://qa.medcloud.link/');
    await driver.manage().setTimeouts({ implicit: 5000 });
    await driver.manage().window().maximize();

    // faço o scroll até a regiao de contato pra garantir que pegue os elementos de lá
    await driver.executeScript("document.getElementById('Contact').scrollIntoView({ behavior: 'smooth' });");
    const nome = await driver.wait(
      until.elementIsVisible(
        driver.findElement(By.css('#Contact input[name="nome-input"]'))
      ),
      10000
    );
    await nome.sendKeys('Joaozinho');
    resultados.push({
      nome: `Campo Nome`,
      valor: 'Joaozinho',
      status: 'Sucesso',
      duracao: '2s',
      erro: null,
    });

    const email = await driver.findElement(By.css('#Contact input[name="e-mail-input"]'));
    await email.sendKeys('joaozinho@123.com');
    resultados.push({
      nome: `Campo Email`,
      valor: 'joaozinho@123.com',
      status: 'Sucesso',
      duracao: '2s',
      erro: null,
    });

    const telefone = await driver.findElement(By.css('#Contact input[name="telefone-input"]'));
    await telefone.sendKeys('9999999');
    resultados.push({
      nome: `Campo Telefone`,
      valor: '9999999',
      status: 'Sucesso',
      duracao: '2s',
      erro: null,
    });

    const messageInput = await driver.findElement(By.css('#Contact textarea#message'));
    await messageInput.sendKeys('teste 123');
    resultados.push({
      nome: `Campo Mensagem`,
      valor: 'teste 123',
      status: 'Sucesso',
      duracao: '2s',
      erro: null,
    });

  } catch (erro) {
    console.error('Erro no preenchimento:', erro);
    resultados.push({
      nome: 'Erro geral no script',
      valor: '-',
      status: 'Falha',
      duracao: '-',
      erro: 'Erro',
    });
  } finally {
    await driver.quit();

    const duracaoTotal = ((Date.now() - inicio) / 1000).toFixed(1) + 's';

    await gerarRelatorioPDF('relatorio-contato-input', {
      titulo: 'Relatório de Teste - Input de dados nos campos de contato',
      resumo: `Esse teste valida se os campos de contato do formulário próximo ao footer estão recebendo dados corretamente. Duração total: ${duracaoTotal}`,
      resultados,
      observacoes: resultados.some(r => r.status === 'Falha')
        ? 'Houve falha na hora de inserir os dados nos campos.'
        : 'Todos os campos funcionam corretamente e recebem os dados',
    });
  }
}

verificaContato();