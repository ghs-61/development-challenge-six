/*
  O objetivo desse código é testar o botão de testar grátis do header, inserir dados e realizar um envio
*/

const { Builder, By, until } = require('selenium-webdriver');
const { gerarRelatorioPDF } = require('../geraPDF');

async function verificaTesteGratis() {
  const driver = await new Builder().forBrowser('chrome').build();
  const resultados = [];
  const inicio = Date.now();

  try {
    await driver.get('https://qa.medcloud.link/');
    await driver.manage().setTimeouts({ implicit: 5000 });
    await driver.manage().window().maximize();

    const botaoTestar = await driver.findElement(By.xpath("//button[text()='Testar grátis']"));
    const textoExperimente = await driver.findElement(By.xpath("//p[contains(text(), 'Experimente por 14 dias!')]"));
    const botaoSolicitar = await driver.findElement(By.xpath("//button[@type='submit']"));

    await botaoTestar.click();
    await driver.wait(until.elementIsVisible(textoExperimente), 2000);
    resultados.push({
      nome: `Clique Botão Testar Grátis`,
      valor: '-',
      status: 'Sucesso',
      duracao: '-',
      erro: null,
    });

    const nome = await driver.findElement(By.name('nome-input'));
    await nome.sendKeys('Joaozinho');
    resultados.push({
      nome: `Campo Nome`,
      valor: 'Joaozinho',
      status: 'Sucesso',
      duracao: '-',
      erro: null,
    });

    const email = await driver.findElement(By.name('e-mail-input'));
    await email.sendKeys('joaozinho@123.com');
    resultados.push({
      nome: `Campo Email`,
      valor: 'joaozinho@123.com',
      status: 'Sucesso',
      duracao: '-',
      erro: null,
    });

    const telefone = await driver.findElement(By.name('telefone-input'));
    await telefone.sendKeys('9999999');
    resultados.push({
      nome: `Campo Telefone`,
      valor: '9999999',
      status: 'Sucesso',
      duracao: '-',
      erro: null,
    });
    
    const posicao = await driver.findElement(By.id('pos'));
    await posicao.sendKeys('Administrador');
    resultados.push({
      nome: `Campo Posição/Cargo`,
      valor: 'Admistrador',
      status: 'Sucesso',
      duracao: '-',
      erro: null,
    });

    await botaoSolicitar.click();
    resultados.push({
      nome: `Clique Botão Submit`,
      valor: '-',
      status: 'Sucesso',
      duracao: '-',
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

    await gerarRelatorioPDF('relatorio-teste-gratis-input', {
      titulo: 'Relatório de Teste - Input de dados nos campos de teste grátis',
      resumo: `Esse teste valida se os campos de dados do modal de teste grátis estão funcionando corretamente, além disso também registra se foi possível enviar a solicitação de teste. Duração total: ${duracaoTotal}`,
      resultados,
      observacoes: resultados.some(r => r.status === 'Falha')
        ? 'Houve falha na hora de inserir os dados nos campos.'
        : 'Todos os campos funcionam corretamente e recebem os dados',
    });
  }
}

verificaTesteGratis();