/*
    O objetivo desse código é verificar se o link das paginas e documentos estão corretos
*/

const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const { gerarRelatorioPDF2 } = require('../geraPDF');


async function verificaLinksRodape() {
    const driver = await new Builder().forBrowser('chrome').build();
    const resultados = [];
    const inicio = Date.now();

    try {
        await driver.get('https://qa.medcloud.link/about.html');
        await driver.manage().setTimeouts({ implicit: 5000 });
        await driver.manage().window().maximize();

        const retornaHome = {descricao: 'Voltar ao Site', seletor: 'a[href*="/"]', esperado: 'https://qa.medcloud.link/'};
        const linkVoltar = await driver.findElement(By.css(retornaHome.seletor));
        const hrefHome = await linkVoltar.getAttribute('href');

        if (hrefHome === retornaHome.esperado) {
            console.log(`[${retornaHome.descricao}] OK: ${hrefHome}`);
            resultados.push({
                nome: 'Voltar ao Site',
                valorEs: retornaHome.esperado,
                valorEc: hrefHome,
                status: 'Sucesso',
                erro: null,
            });
        } else {
            console.log(`[${retornaHome.descricao}] incorreto:\n   Esperado: ${retornaHome.esperado}\n   Encontrado: ${hrefHome} \n`);
            resultados.push({
                nome: 'Voltar ao Site',
                valorEs: retornaHome.esperado,
                valorEc: hrefHome,
                status: 'Falha',
                erro: 'Erro',
            });            
        }

        const botaoEmail = {descricao: 'Email de contato', seletor: 'a[href^="mailto:"]', esperado: 'mpp@medcloud.com.br'};
        const email = await driver.findElement(By.css(botaoEmail.seletor));
        const hrefEmail = await email.getAttribute('href');
        const emailExtraido = hrefEmail.replace('mailto:', '');

        if (emailExtraido === botaoEmail.esperado) {
            resultados.push({
                nome: 'Email de contato',
                valorEs: botaoEmail.esperado,
                valorEc: emailExtraido,
                status: 'Sucesso',
                erro: null,
            });
        } else {
            resultados.push({
                nome: 'Email de contato',
                valorEs: botaoEmail.esperado,
                valorEc: emailExtraido,
                status: 'Falha',
                erro: 'Erro',
            });
        }
        
        const botaoVagas = await driver.findElement(By.xpath("//button[contains(text(), 'Confira as vagas abertas')]"));
        await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", botaoVagas);
        await driver.sleep(1000);
        await botaoVagas.click();
        await driver.sleep(2000);

        const screenshot = await driver.takeScreenshot();
        const nomeArquivo = path.join(__dirname, 'screenshot_carreiras.png');
        fs.writeFileSync(nomeArquivo, screenshot, 'base64');

        await driver.close();

    }catch (erro) {
        console.error('Erro:', erro);
        resultados.push({
            nome: 'Erro geral no script',
            valorEs: '-',
            valorEc: '-',
            status: 'Falha',
            erro: 'Erro',
        });
    } finally {
        await driver.quit();

        const duracaoTotal = ((Date.now() - inicio) / 1000).toFixed(1) + 's';

        await gerarRelatorioPDF2('relatorio-about-nav', {
        titulo: 'Relatório de Teste - Links aba Sobre',
        resumo: `Esse teste valida se os links de redirecionamento da aba sobre estão como o esperado. Duração: ${duracaoTotal}`,
        resultados,
        observacoes: resultados.some(r => r.status === 'Falha')
            ? 'Houve falha na navegação e nao foi possível validar todos os links.'
            : 'Todos os links puderam ser validados.',
        });
    }
}

verificaLinksRodape();