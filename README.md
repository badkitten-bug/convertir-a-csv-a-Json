# NexusConverter

**NexusConverter** es una aplicación web interactiva que transforma archivos CSV en JSON de manera robusta y profesional. La herramienta permite convertir archivos CSV a JSON, utilizando diferentes delimitadores, definiendo encabezados, mostrando una vista previa de los datos y ofreciendo acciones adicionales como copiar y descargar el JSON generado.

---

## Características

- **Carga de Archivos CSV:**  
  Permite subir el archivo mediante selección directa o arrastrar y soltar.

- **Selección de Delimitador:**  
  Soporta delimitadores predefinidos (coma, punto y coma, tabulación, pipe) y un delimitador personalizado.

- **Encabezados Personalizables:**  
  Permite definir si la primera fila contiene los encabezados o generar nombres de columnas por defecto.

- **Conversión a JSON:**  
  Transforma los datos a JSON en formato compacto o con formateo (pretty print).

- **Vista Previa de Datos:**  
  Genera una tabla interactiva con la vista previa de los datos extraídos del CSV.

- **Acciones Adicionales:**  
  Permite copiar el JSON al portapapeles y descargarlo como archivo.

- **Procesamiento Robusto:**  
  Utiliza [Papa Parse](https://www.papaparse.com/) para manejar CSVs complejos (campos con comas, saltos de línea y comillas) y procesamiento en segundo plano para archivos grandes.

---

## Requisitos

- **Navegador Web Moderno:**  
  Se utiliza HTML5, ES6 y APIs modernas (FileReader, Clipboard, etc.).

- **Acceso a Internet:**  
  Para cargar recursos externos como Papa Parse, Font Awesome y Google Fonts a través de CDN.

---

## Cómo Usar la Aplicación

1. **Abrir la Aplicación:**  
   Abre el archivo `index.html` en tu navegador.

2. **Cargar el Archivo CSV:**  
   - Arrastra y suelta tu archivo CSV en el área designada.
   - O utiliza el botón **"Seleccionar archivo"**.

3. **Configurar Opciones:**  
   - **Delimitador:** Selecciona uno de los predefinidos o ingresa un carácter personalizado.
   - **Encabezado:** Determina si la primera fila contiene los encabezados.
   - **Formato JSON:** Elige mostrar el JSON en formato compacto o formateado ("pretty print").

4. **Convertir a JSON:**  
   Presiona **"Convertir a JSON"** para iniciar la conversión.

5. **Visualizar y Accionar:**  
   - Visualiza el JSON en la sección de resultados.
   - Copia el JSON al portapapeles o descárgalo como archivo.
   - Utiliza la vista previa para ver los datos en forma de tabla.

---

## Estructura del Proyecto

NexusConverter/ 
├── index.html # Archivo principal de la aplicación 
├── css/ │ └── styles.css # Hoja de estilos para el diseño y la responsividad 
├── js/ │ └── script.js # Lógica JavaScript para el manejo del CSV y conversión a JSON 
└── README.md # Documentación del proyecto


---

## Integración de Dependencias

El proyecto utiliza recursos externos que se cargan mediante CDN:

- **[Papa Parse](https://www.papaparse.com/):**  
  Para el análisis robusto de archivos CSV.  
  ```html
  <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
**Font Awesome:**  
Para utilizar íconos en la interfaz.

**Google Fonts:**  
Con las fuentes 'Inter' y 'JetBrains Mono' para una tipografía moderna y legible.

---

**Mejoras y Extensiones Futuras**

- **Manejo Avanzado de CSV:**  
  Ajustar la configuración de Papa Parse para soportar CSVs aún más complejos.
- **Optimización de Rendimiento:**  
  Uso extensivo de Web Workers para procesar archivos grandes sin afectar la interfaz.
- **Accesibilidad:**  
  Mejorar la navegación por teclado y agregar atributos ARIA en elementos interactivos.
- **Interfaz Responsive:**  
  Ajustes adicionales en CSS para optimizar la experiencia en dispositivos móviles.

---

**Licencia:**  
Este proyecto es de código abierto y se distribuye bajo la **Licencia MIT**.

**Autor:**  
 Steve Gomez
