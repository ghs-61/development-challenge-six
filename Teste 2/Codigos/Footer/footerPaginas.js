/*
    O objetivo desse código é verificar se o link das paginas e documentos estão corretos
*/

const { Builder, By } = require('selenium-webdriver');
const { gerarRelatorioPDF2 } = require('../geraPDF');

async function verificaLinksRodape() {
    const driver = await new Builder().forBrowser('chrome').build();
    const resultados = [];
    const inicio = Date.now();

    try {
        await driver.get('https://qa.medcloud.link/');
        await driver.manage().setTimeouts({ implicit: 5000 });
        await driver.manage().window().maximize();
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        await driver.sleep(1000);

        const verificacoes = [
        {
            descricao: 'Email de contato',
            seletor: 'a[href^="mailto:"]',
            esperado: 'mailto:contato@medcloud.com.br'
        },
        {
            descricao: 'Sobre',
            seletor: 'a[href="about.html"]',
            esperado: 'https://qa.medcloud.link/about.html'
        },
        {
            descricao: 'Carreiras',
            seletor: 'a[href="careers.html"]',
            esperado: 'https://qa.medcloud.link/careers.html'
        },
        {
            descricao: 'Política de Privacidade',
            seletor: 'a[href="/pdfs/Medcloud-Privacy-Policy.pdf"]',
            esperado: 'https://qa.medcloud.link/pdfs/Medcloud-Privacy-Policy.pdf'
        },
        {
            descricao: 'Termos de Uso',
            seletor: 'a[href="/pdfs/Medcloud-Terms-Use.pdf"]',
            esperado: 'https://qa.medcloud.link/pdfs/Medcloud-Terms-Use.pdf'
        },
        {
            descricao: 'App Store',
            seletor: 'a[href*="apps.apple.com"]',
            esperado: 'https://apps.apple.com/br/app/medcloud-2-0/id1486223140'
        },
        {
            descricao: 'Google Play',
            seletor: 'a[href*="play.google.com"]',
            esperado: 'https://play.google.com/store/apps/details?id=co.medcloud.android'
        }
        ];

        console.log('\n');

        for (const item of verificacoes) {
            try {
                const elemento = await driver.findElement(By.css(item.seletor));
                const href = await elemento.getAttribute('href');
                if (href === item.esperado) {        
                    console.log(`[${item.descricao}] OK: ${href}`);
                    resultados.push({
                        nome: `Item "${item.descricao}"`,
                        valorEs: item.esperado,
                        valorEc: href,
                        status: 'Sucesso',
                        erro: null,
                     });                    
                } else {
                    console.log(`[${item.descricao}] incorreto:\n   Esperado: ${item.esperado}\n   Encontrado: ${href} \n`);
                    resultados.push({
                        nome: `Item "${item.descricao}"`,
                        valorEs: item.esperado,
                        valorEc: href,
                        status: 'Erro',
                        erro: null,
                     });
                }
            } catch (erro) {
                console.log('Erro', erro);
                resultados.push({
                    nome: '-',
                    valorEs: '-',
                    valorEc: '-',
                    status: 'Erro',
                    erro: 'Erro',
                });
            }
        }

        console.log('\n');

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

        await gerarRelatorioPDF2('relatorio-redirecionamento-nav', {
        titulo: 'Relatório de Teste - Links de redirecionamento',
        resumo: `Esse teste valida se os links de redirecionamento do footer da home estão de acordo com o esperado. Duração: ${duracaoTotal}`,
        resultados,
        observacoes: resultados.some(r => r.status === 'Falha')
            ? 'Houve falha na navegação e nao foi possível validar todos os links.'
            : 'Todos os links puderam ser validados.',
        });
    }
}

verificaLinksRodape();