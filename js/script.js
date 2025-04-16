document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const csvUpload = document.getElementById('csv-upload');
    const dropZone = document.getElementById('drop-zone');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const clearFile = document.getElementById('clear-file');
    const convertBtn = document.getElementById('convert-btn');
    const previewBtn = document.getElementById('preview-btn');
    const jsonOutput = document.getElementById('json-output');
    const resultSection = document.getElementById('result-section');
    const copyJson = document.getElementById('copy-json');
    const downloadJson = document.getElementById('download-json');
    const expandJson = document.getElementById('expand-json');
    const delimiterSelect = document.getElementById('delimiter');
    const customDelimiter = document.getElementById('custom-delimiter');
    const headerCheckbox = document.getElementById('header');
    const prettyCheckbox = document.getElementById('pretty');
    const statusInfo = document.getElementById('status-info');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const previewModal = document.getElementById('preview-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const previewTable = document.getElementById('preview-table');
  
    let csvData = null;
    let jsonResult = null;
  
    // Event listeners
    csvUpload.addEventListener('change', handleFileSelect);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    clearFile.addEventListener('click', clearSelectedFile);
    convertBtn.addEventListener('click', convertToJson);
    previewBtn.addEventListener('click', showPreview);
    copyJson.addEventListener('click', copyJsonToClipboard);
    downloadJson.addEventListener('click', downloadJsonFile);
    expandJson.addEventListener('click', expandJsonViewer);
    delimiterSelect.addEventListener('change', handleDelimiterChange);
    closeModalButtons.forEach(btn => btn.addEventListener('click', closeModal));
  
    function handleFileSelect(event) {
      const file = event.target.files[0] || (event.dataTransfer && event.dataTransfer.files[0]);
      if (file) {
        processFile(file);
      }
    }
  
    function handleDragOver(e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('highlight');
    }
  
    function handleDragLeave(e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('highlight');
    }
  
    function handleDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('highlight');
  
      const file = e.dataTransfer.files[0];
      if (file && file.name.toLowerCase().endsWith('.csv')) {
        csvUpload.files = e.dataTransfer.files;
        processFile(file);
      } else {
        updateStatus('Por favor, sube un archivo CSV válido', 'error');
      }
    }
  
    function processFile(file) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        updateStatus('Por favor, sube un archivo CSV válido', 'error');
        return;
      }
  
      fileName.textContent = file.name;
      fileInfo.style.display = 'flex';
      previewBtn.disabled = false;
      convertBtn.disabled = false;
  
      updateStatus(`Archivo cargado: ${file.name}`, 'success');
  
      const reader = new FileReader();
      reader.onloadstart = () => {
        showProgressBar();
      };
      reader.onload = (e) => {
        const csvText = e.target.result;
        if (!csvText.trim()) {
          updateStatus('El archivo CSV está vacío.', 'error');
          hideProgressBar();
          return;
        }
        parseCSV(csvText);
      };
      reader.onerror = () => {
        updateStatus('Error al leer el archivo', 'error');
        hideProgressBar();
      };
      reader.readAsText(file);
    }
  
    function parseCSV(csvText) {
      const delimiter = getDelimiter();
      Papa.parse(csvText, {
        delimiter: delimiter,
        header: headerCheckbox.checked,
        skipEmptyLines: true,
        complete: function(results) {
          if (results.errors.length > 0) {
            updateStatus(`Error al procesar CSV: ${results.errors[0].message}`, 'error');
            hideProgressBar();
            return;
          }
          if (headerCheckbox.checked) {
            csvData = {
              headers: results.meta.fields,
              data: results.data
            };
          } else {
            const numCols = results.data[0].length;
            const headers = Array.from({ length: numCols }, (_, i) => `col${i + 1}`);
            csvData = {
              headers: headers,
              data: results.data.map(row => {
                const obj = {};
                headers.forEach((header, i) => {
                  obj[header] = row[i] !== undefined ? row[i] : '';
                });
                return obj;
              })
            };
          }
          generatePreviewTable();
          updateStatus('CSV procesado correctamente', 'success');
          hideProgressBar();
        },
        error: function(err) {
          updateStatus(`Error al procesar CSV: ${err.message}`, 'error');
          hideProgressBar();
        },
        worker: true // Procesamiento en segundo plano para archivos grandes
      });
    }
  
    function getDelimiter() {
      if (delimiterSelect.value === 'custom') {
        const customChar = customDelimiter.value;
        if (!customChar || customChar.length !== 1) {
          updateStatus('El delimitador personalizado debe ser un solo carácter.', 'error');
          return ',';
        }
        return customChar;
      }
      return delimiterSelect.value;
    }
  
    function handleDelimiterChange() {
      if (delimiterSelect.value === 'custom') {
        customDelimiter.style.display = 'block';
        customDelimiter.focus();
      } else {
        customDelimiter.style.display = 'none';
      }
      // Reprocesar el CSV si ya hay un archivo cargado
      if (csvUpload.files.length > 0) {
        const file = csvUpload.files[0];
        processFile(file);
      }
    }
  
    function convertToJson() {
      if (!csvData) {
        updateStatus('No hay datos CSV para convertir', 'error');
        return;
      }
      showProgressBar();
      updateStatus('Convirtiendo CSV a JSON...', 'info');
      setTimeout(() => {
        try {
          jsonResult = prettyCheckbox.checked ? JSON.stringify(csvData.data, null, 2) : JSON.stringify(csvData.data);
          jsonOutput.textContent = jsonResult;
          resultSection.style.display = 'block';
          resultSection.classList.add('slide-up');
          updateStatus('Conversión completada con éxito', 'success');
          hideProgressBar();
        } catch (error) {
          updateStatus(`Error al convertir: ${error.message}`, 'error');
          hideProgressBar();
        }
      }, 500);
    }
  
    function showPreview() {
      if (!csvData) {
        updateStatus('No hay datos para mostrar', 'error');
        return;
      }
      previewModal.classList.add('active');
    }
  
    function generatePreviewTable() {
      previewTable.innerHTML = '';
      if (!csvData) return;
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      csvData.headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      previewTable.appendChild(thead);
  
      const tbody = document.createElement('tbody');
      csvData.data.forEach(dataRow => {
        const row = document.createElement('tr');
        csvData.headers.forEach(header => {
          const td = document.createElement('td');
          td.textContent = dataRow[header] || '';
          row.appendChild(td);
        });
        tbody.appendChild(row);
      });
      previewTable.appendChild(tbody);
    }
  
    function copyJsonToClipboard() {
      if (!jsonResult) {
        updateStatus('No hay JSON para copiar', 'error');
        return;
      }
      navigator.clipboard.writeText(jsonResult)
        .then(() => {
          updateStatus('JSON copiado al portapapeles', 'success');
          copyJson.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            copyJson.innerHTML = '<i class="far fa-copy"></i>';
          }, 2000);
        })
        .catch(err => {
          updateStatus(`Error al copiar: ${err}`, 'error');
        });
    }
  
    function downloadJsonFile() {
      if (!jsonResult) {
        updateStatus('No hay JSON para descargar', 'error');
        return;
      }
      const blob = new Blob([jsonResult], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = csvUpload.files[0] ? csvUpload.files[0].name.replace(/\.csv$/i, '.json') : 'converted.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      updateStatus('JSON descargado con éxito', 'success');
    }
  
    function expandJsonViewer() {
      const jsonViewer = document.querySelector('.json-viewer');
      if (jsonViewer.style.maxHeight === 'none') {
        jsonViewer.style.maxHeight = '400px';
        expandJson.innerHTML = '<i class="fas fa-expand"></i>';
      } else {
        jsonViewer.style.maxHeight = 'none';
        expandJson.innerHTML = '<i class="fas fa-compress"></i>';
      }
    }
  
    function clearSelectedFile() {
      csvUpload.value = '';
      fileInfo.style.display = 'none';
      previewBtn.disabled = true;
      convertBtn.disabled = true;
      resultSection.style.display = 'none';
      csvData = null;
      jsonResult = null;
      updateStatus('Listo para convertir', 'info');
    }
  
    function closeModal() {
      previewModal.classList.remove('active');
    }
  
    function updateStatus(message, type) {
      let icon = '';
      switch (type) {
        case 'success':
          icon = '<i class="fas fa-check-circle"></i>';
          break;
        case 'error':
          icon = '<i class="fas fa-exclamation-circle"></i>';
          break;
        case 'info':
          icon = '<i class="fas fa-info-circle"></i>';
          break;
        case 'warning':
          icon = '<i class="fas fa-exclamation-triangle"></i>';
          break;
        default:
          icon = '<i class="fas fa-info-circle"></i>';
      }
      statusInfo.innerHTML = `${icon} ${message}`;
      statusInfo.className = 'status-info ' + type;
    }
  
    function showProgressBar() {
      progressBar.style.display = 'block';
      progressFill.style.width = '0%';
      let width = 0;
      const interval = setInterval(() => {
        if (width >= 90) {
          clearInterval(interval);
        } else {
          width += 10;
          progressFill.style.width = `${width}%`;
        }
      }, 200);
    }
  
    function hideProgressBar() {
      progressFill.style.width = '100%';
      setTimeout(() => {
        progressBar.style.display = 'none';
      }, 500);
    }
  
    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) {
        closeModal();
      }
    });
  });
  