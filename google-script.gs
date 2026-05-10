/**
 * SCRIPT PARA GOOGLE SHEETS
 * Google Apps Script HTTP Endpoint (Web App)
 * 
 * 1. Abre tu Google Sheet para "Rutas de Cabritas"
 * 2. Ve a Extensiones > Apps Script
 * 3. Pega este código reemplazando el contenido existente.
 * 4. Haz click en Implementar (Deploy) > Nueva implementación
 * 5. Tipo de implementación: Aplicación web
 * 6. Acceso: "Cualquier persona" (Anyone)
 * 7. Copia la URL de la aplicación web y pégala en `src/store/routes.ts`
 */

const SPREADSHEET_NAME = "Rutas"; // Nombre de la hoja en tu Google Sheet

function doGet(e) {
  return handleResponse(e, false);
}

function doPost(e) {
  return handleResponse(e, true);
}

function handleResponse(e, isPost) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SPREADSHEET_NAME);
    if (!sheet) {
      throw new Error("No existe una hoja llamada '" + SPREADSHEET_NAME + "'. ¡Créalala!");
    }

    if (isPost && e.postData && e.postData.contents) {
      // Agregar nueva ruta
      const requestData = JSON.parse(e.postData.contents);
      
      const id = Date.now().toString();
      const title = requestData.title || "";
      const date = requestData.date || "";
      const type = requestData.type || "";
      const image = requestData.image || "";
      const description = requestData.description || "";
      
      // La hoja debe tener las columnas: ID | Titulo | Fecha | Categoria | Imagen | Descripcion
      sheet.appendRow([id, title, date, type, image, description]);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", id: id }))
        .setMimeType(ContentService.MimeType.JSON);
    } 
    
    // Obtener todas las rutas
    const data = sheet.getDataRange().getValues();
    const rows = [];
    
    // Asumimos que la primera fila es de encabezados, así que iteramos desde la fila 1
    for (let i = 1; i < data.length; i++) {
        rows.push({
            id: data[i][0].toString(),
            title: data[i][1],
            date: data[i][2],
            type: data[i][3],
            image: data[i][4],
            description: data[i][5]
        });
    }

    return ContentService.createTextOutput(JSON.stringify(rows.reverse()))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Configurar encabezados CORS para peticiones preflight automáticas
function doOptions(e) {
  var response = ContentService.createTextOutput("");
  response.setMimeType(ContentService.MimeType.JSON);
  return response;
}
