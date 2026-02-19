
function doGet() {
  var scriptProperties = PropertiesService.getScriptProperties();
  // Ambil API_KEY dari Script Properties
  var apiKey = scriptProperties.getProperty('API_KEY') || '';
  
  var template = HtmlService.createTemplateFromFile('index');
  // Gunakan JSON.stringify agar aman saat dimasukkan ke dalam JavaScript di HTML
  template.apiKey = JSON.stringify(apiKey);
  
  return template.evaluate()
      .setTitle('ARSUDI AI - BP PAUD & PNF')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getAppInitializationData() {
  var props = PropertiesService.getScriptProperties();
  return {
    users: props.getProperty('arsudi_users') || '[]',
    letters: props.getProperty('arsudi_data') || '[]',
    title: props.getProperty('arsudi_title') || 'ARSUDI AI'
  };
}

function setAppData(key, value) {
  var props = PropertiesService.getScriptProperties();
  props.setProperty(key, value);
  return true;
}
