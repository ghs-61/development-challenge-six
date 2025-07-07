const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function gerarRelatorioPDF(nomeArquivo, dados) {
  const { titulo, valor, resumo, resultados, observacoes } = dados;

  const logoPath = path.resolve(__dirname, 'medcloud.webp');
  const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });

  const dataAtual = new Date().toLocaleString('pt-BR');

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 30px; }
          header img { height: 50px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .status-ok { color: green; font-weight: bold; }
          .status-fail { color: red; font-weight: bold; }
          footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; }
        </style>
      </head>
      <body>
        <header>
          <img src="data:image/png;base64,${logoBase64}" alt="Logo">
          <div>Data do teste: ${dataAtual}</div>
        </header>

        <h1>${titulo}</h1>

        <p>${resumo}</p>

        <h2>Resultados</h2>
        <table>
          <tr>
            <th>Teste</th>
            <th>Valor enviado</th>
            <th>Status</th>
            <th>Duração</th>
            <th>Erro</th>
          </tr>
          ${resultados.map(r => `
            <tr>
              <td>${r.nome}</td>
              <td>${r.valor}</td>
              <td class="${r.status === 'Sucesso' ? 'status-ok' : 'status-fail'}">${r.status}</td>
              <td>${r.duracao}</td>
              <td>${r.erro || '-'}</td>
            </tr>`).join('')}
        </table>

        ${observacoes ? `
          <h2>Observações</h2>
          <p>${observacoes}</p>
        ` : ''}

        <footer>
          Relatório gerado automaticamente por sistema de testes automatizados - ${dataAtual}
        </footer>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const caminhoPDF = path.resolve(__dirname, `${nomeArquivo}.pdf`);
  await page.pdf({
    path: caminhoPDF,
    format: 'A4',
    printBackground: true
  });

  await browser.close();
  console.log(`Relatório salvo em: ${caminhoPDF}`);
}

async function gerarRelatorioPDF2(nomeArquivo, dados) {
  const { titulo, valorEs, valorEc, resumo, resultados, observacoes } = dados;

  const logoPath = path.resolve(__dirname, 'medcloud.webp');
  const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });

  const dataAtual = new Date().toLocaleString('pt-BR');

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 30px; }
          header img { height: 50px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .status-ok { color: green; font-weight: bold; }
          .status-fail { color: red; font-weight: bold; }
          footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; }
        </style>
      </head>
      <body>
        <header>
          <img src="data:image/png;base64,${logoBase64}" alt="Logo">
          <div>Data do teste: ${dataAtual}</div>
        </header>

        <h1>${titulo}</h1>

        <p>${resumo}</p>

        <h2>Resultados</h2>
        <table>
          <tr>
            <th>Teste</th>
            <th>Valor Esperado</th>
            <th>Valor Encontrado</th>
            <th>Status</th>
            <th>Erro</th>
          </tr>
          ${resultados.map(r => `
            <tr>
              <td>${r.nome}</td>
              <td>${r.valorEs}</td>
              <td>${r.valorEc}</td>
              <td class="${r.status === 'Sucesso' ? 'status-ok' : 'status-fail'}">${r.status}</td>
              <td>${r.erro || '-'}</td>
            </tr>`).join('')}
        </table>

        ${observacoes ? `
          <h2>Observações</h2>
          <p>${observacoes}</p>
        ` : ''}

        <footer>
          Relatório gerado automaticamente por sistema de testes automatizados - ${dataAtual}
        </footer>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const caminhoPDF = path.resolve(__dirname, `${nomeArquivo}.pdf`);
  await page.pdf({
    path: caminhoPDF,
    format: 'A4',
    printBackground: true
  });

  await browser.close();
  console.log(`Relatório salvo em: ${caminhoPDF}`);
}

module.exports = { gerarRelatorioPDF, gerarRelatorioPDF2 };
