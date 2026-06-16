// Google Apps Script para RaggaMaps
// Este script deve ser colado no editor do Google Apps Script
// Deploy como "Web App" com acesso: "Anyone"

function doGet(e) {
  // Ler dados da planilha
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('dados');
  const data = sheet.getDataRange().getValues();
  
  // Converter para formato JSON (ignorando cabeçalho)
  const headers = data[0];
  const jsonData = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      // Converter datas e horas para formato string
      let value = row[index];
      const headerLower = header.toLowerCase();
      
      if (value instanceof Date) {
        // Se for data, converter para formato ISO
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        
        // Verificar se é apenas data ou data com hora
        // Horários no Excel são armazenados como datas com base em 1899-12-30
        if (year === 1899 && (value.getMonth() === 11 || value.getMonth() === 10)) {
          // É um horário do Excel - extrair apenas hora:minuto
          const hours = String(value.getHours()).padStart(2, '0');
          const minutes = String(value.getMinutes()).padStart(2, '0');
          value = `${hours}:${minutes}`;
        } else if (value.getHours() === 0 && value.getMinutes() === 0 && value.getSeconds() === 0) {
          // É apenas data
          value = `${year}-${month}-${day}`;
        } else {
          // É data com hora
          const hours = String(value.getHours()).padStart(2, '0');
          const minutes = String(value.getMinutes()).padStart(2, '0');
          value = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
        }
      }
      
      obj[headerLower] = value;
    });
    return obj;
  });
  
  // Retornar como JSON
  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // Adicionar novo evento à planilha
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('dados');
  
  try {
    // Parsear dados recebidos
    const data = JSON.parse(e.postData.contents);
    
    // Adicionar nova linha
    sheet.appendRow([
      data.nome || '',
      data.endereco || '',
      data.data || '',
      data.horario_inicio || '',
      data.horario_fim || '',
      data.status || '',
      data.description || '',
      data.link || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
