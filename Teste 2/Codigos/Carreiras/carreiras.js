/*
    O objetivo desse código é verificar se o link das paginas de carreiras estão corretos
*/

const { Builder, By } = require('selenium-webdriver');
const { gerarRelatorioPDF2 } = require('../geraPDF');

async function verificaLinksCarreira() {
    const driver = await new Builder().forBrowser('chrome').build();
    const resultados = [];
    const inicio = Date.now();

    try {
        await driver.get('https://qa.medcloud.link/careers.html');
        await driver.manage().setTimeouts({ implicit: 5000 });
        await driver.manage().window().maximize();
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        await driver.sleep(1000);

        const verificacoes = [
        {
            descricao: 'Analista de Integrações',
            seletor: 'a[href="careers/integration-analyst.html"]',
            esperado: 'https://qa.medcloud.link/careers/integration-analyst.html'
            
        },
        {
            descricao: 'Analista de Suporte',
            seletor: 'a[href="careers/support-analyst.html"]',
            esperado: 'https://qa.medcloud.link/careers/support-analyst.html'
        },
        {
            descricao: 'Analista de RH',
            seletor: 'a[href="careers/rh-analyst.html"]',
            esperado: 'https://qa.medcloud.link/careers/rh-analyst.html'
        },
        {
            descricao: 'Analista de Projetos',
            seletor: 'a[href="careers/project-analyst.html"]',
            esperado: 'https://qa.medcloud.link/careers/project-analyst.html'
        },
        {
            descricao: 'Desenvolvedor Mobile/JS',
            seletor: 'a[href="careers/mobile-developer.html"]',
            esperado: 'https://qa.medcloud.link/careers/mobile-developer.html'
        },
        {
            descricao: 'Desenvolvedor Web',
            seletor: 'a[href*="careers/web-developer.html"]',
            esperado: 'https://qa.medcloud.link/careers/web-devloper.html'
        },
        {
            descricao: 'Desenvolvedor Mobile',
            seletor: 'a[href*="careers/mobile-developer-2.html"]',
            esperado: 'https://qa.medcloud.link/careers/mobile-developer-2.html'
        },
        {
            descricao: 'Web Designer',
            seletor: 'a[href*="careers/web-designer.html"]',
            esperado: 'https://qa.medcloud.link/careers/web-designer'
        },
        {
            descricao: 'Sales Representative',
            seletor: 'a[href*="careers/sales-representative.html"]',
            esperado: 'https://qa.medcloud.link/careers/sales-representative.html'
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
                        nome: `Cargo "${item.descricao}"`,
                        valorEs: item.esperado,
                        valorEc: href,
                        status: 'Sucesso',
                        erro: null,
                     });

                } else {
                    console.log(`[${item.descricao}] incorreto:\n   Esperado: ${item.esperado}\n   Encontrado: ${href} \n`);
                    resultados.push({
                        nome: `Cargo "${item.descricao}"`,
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

        const retornaHome = {descricao: 'Voltar ao Site', seletor: 'a[href*="/careers"]', esperado: 'https://qa.medcloud.link'};
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
                status: 'Erro',
                erro: null,
            });
        }

    } catch (erro) {
        console.error('Erro', erro);
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

        await gerarRelatorioPDF2('relatorio-carreiras-nav', {
        titulo: 'Relatório de Teste - Navegação pela página de carreiras',
        resumo: `Esse teste valida se os links de vagas disponíveis na página de carreiras estão de acordo com o esperado. Além disso também verifica se o botão de voltar para home está com o link correto. Duração: ${duracaoTotal}`,
        resultados,
        observacoes: resultados.some(r => r.status === 'Falha')
            ? 'Houve falha na navegação e nao foi possível validar todos os links.'
            : 'Todos os links puderam ser validados.',
        });
    }
}

verificaLinksCarreira();