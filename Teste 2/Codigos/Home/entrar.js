/*
  O objetivo desse código é simular o login pelo botão entrar, que gera loop infinito
*/

const { Builder, By } = require('selenium-webdriver');

async function verificaEntrar() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://qa.medcloud.link/');
    await driver.manage().setTimeouts({ implicit: 5000 });
    await driver.manage().window().maximize();

    const botaoEntrar = await driver.findElement(By.xpath("//button[text()='Entrar']"));
    //aqui tentei fechar a aplicação, mas nao deu certo
    await botaoEntrar.click();
    await driver.sleep(3000);

  }
  catch (erro) {
    console.error('Erro:', erro);
  } finally {
    await driver.quit();
  }
}
verificaEntrar();