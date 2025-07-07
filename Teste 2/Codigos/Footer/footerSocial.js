/*
    O objetivo desse código é verificar se o link das redes sociais estão corretos
*/

const { Builder, By } = require('selenium-webdriver');
const { gerarRelatorioPDF2 } = require('../geraPDF');

async function verificaFooter() {
    const driver = await new Builder().forBrowser('chrome').build();
    const resultados = [];
    const inicio = Date.now();

    try {
        await driver.get('https://qa.medcloud.link/');
        await driver.manage().setTimeouts({ implicit: 5000 });
        await driver.manage().window().maximize();
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        await driver.sleep(1000);

            const redesSociais = [
            {
                nome: 'Spotify',
                descricao: 'spotify-svg', 
                esperado: 'https://open.spotify.com/show/4IK3IeDsKHbflXLQ6oy20W'
            },
            {
                nome: 'Instagram',
                descricao: 'instagram-svg',
                esperado: 'https://www.instagram.com/medcloudbr/'
            },
            {
                nome: 'Facebook',
                descricao: 'facebook-svg',
                esperado: 'https://www.facebook.com/medcloudbr'
            },
            {
                nome: 'X',
                descricao: 'twitter-svg',
                esperado: 'https://x.com/medcloudbr'
            },
            {
                nome: 'Youtube',
                descricao: 'youtube-svg',
                esperado: 'https://www.youtube.com/channel/UCQZCk0wyl9vQLDt84d1Sr1w'
            },
            {
                nome: 'LinkedIn',
                descricao: 'linkedin-svg',
                esperado: 'https://www.linkedin.com/company/medcloud/'
            }
            ];
        
        for (const item of redesSociais) {
            try {
                const img = await driver.findElement(By.id(item.descricao));
                const link = await img.findElement(By.xpath('..'));
                const href = await link.getAttribute('href');
                if (href === item.esperado) {
                    console.log(`[${item.descricao}] Link correto: ${href}`);
                    resultados.push({
                        nome: item.nome,
                        valorEs: item.esperado,
                        valorEc: href,
                        status: 'Sucesso',
                        erro: null,
                    });                  
                } else {
                    console.log(`[${item.descricao}] Link incorreto:\n   Esperado: ${item.esperado}\n   Encontrado: ${href}\n`);
                    resultados.push({
                        nome: item.nome,
                        valorEs: item.esperado,
                        valorEc: href,
                        status: 'Erro',
                        erro: null,
                    });
                }
            } catch (erro) {
                console.error('Erro:', erro);
                resultados.push({
                    nome: '-',
                    valorEs: '-',
                    valorEc: '-',
                    status: 'Erro',
                    erro: 'Erro',
                });
        }
    }

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

        await gerarRelatorioPDF2('relatorio-redes-sociais-nav', {
        titulo: 'Relatório de Teste - Links de redes sociais',
        resumo: `Esse teste valida se os links de redes sociais do footer da home estão de acordo com o esperado. Duração: ${duracaoTotal}`,
        resultados,
        observacoes: resultados.some(r => r.status === 'Falha')
            ? 'Houve falha na navegação e nao foi possível validar todos os links.'
            : 'Todos os links puderam ser validados.',
        });
    }
}

verificaFooter();