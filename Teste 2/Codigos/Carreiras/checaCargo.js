/*
    O objetivo desse código é acessar as páginas de carreiras e tirar um print de cada uma, abro o link em nova guia, printo, volto pra inicial
*/

const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

async function printaCargo() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://qa.medcloud.link/careers.html');
    await driver.manage().window().maximize();

    const elementos = await driver.findElements(By.css('a.mx-auto.font-bold'));
    const links = [];

    for (const elemento of elementos) {
      const href = await elemento.getAttribute('href');
      if (href) links.push(href);
    }

    const janelaOriginal = await driver.getWindowHandle();

    for (let i = 0; i < links.length; i++) {
      const url = links[i];

      await driver.executeScript(`window.open("${url}", "_blank");`);
      const janelas = await driver.getAllWindowHandles();
      const novaGuia = janelas.find(j => j !== janelaOriginal);

      await driver.switchTo().window(novaGuia);
      await driver.sleep(2000);

      const screenshot = await driver.takeScreenshot();
      const nomeArquivo = `screenshot_${i + 1}.png`;
      fs.writeFileSync(path.join(__dirname, nomeArquivo), screenshot, 'base64');

      await driver.close();
      await driver.switchTo().window(janelaOriginal);
    }

  } catch (erro) {
    console.error('Erro:', erro);
  } finally {
    await driver.quit();
  }
}

printaCargo();