## Prueba Técnica n8n - Sistema de Notificaciones para E-commerce

### Descripción General
Este proyecto implementa un sistema automatizado de notificaciones para informar a clientes sobre el estado de sus pedidos, usando n8n como motor de orquestación. Las notificaciones se envían por email y/o SMS según preferencia, y el equipo de soporte puede actualizar el estado de los pedidos desde una landing page.

---

## 1. Estructura del Flujo n8n
- **Trigger principal:** Webhook HTTP que recibe datos desde la landing page.
- **Validación:** Nodo "Execute Code" (JavaScript) valida los campos recibidos (orderId, customerEmail, customerPhone, notificationPreference, orderStatus, trackingNumber, deliveryEstimate).
- **Generación de mensaje:** Nodo "Execute Code" genera el contenido dinámico del mensaje según el estado del pedido.
- **Bifurcación:** Nodo "Switch" decide el canal de notificación (email, SMS, ambos).
- **Envío de notificaciones:**
  - Email: Nodo Gmail.
  - SMS: Nodo Twilio.
- **Manejo de errores:**
  - Errores capturados y registrados en Google Sheets.
  - Nodo "Set" para estructurar errores y nodos involucrados.
  - Nodo "Review results" para consolidar resultados y errores.
  - Nodo "Evaluate Error" para desglosar errores y registrar en hoja de cálculo.
- **Reintentos:**
  - Trigger programado revisa errores y reintenta notificaciones fallidas tras 5 minutos.

---

## 2. Instrucciones de Uso

### a) Iniciar n8n
- Ejecuta n8n localmente o en la nube.
- Importa el archivo `n8n-flow.json` desde el editor de n8n.
- Configurar en el nodo Webhook autenticación Header Auth, agregar credenciales de nombre `x-api-key` y el valor que desees.
- Configura credenciales para Gmail, Twilio y Google Sheets si deseas pruebas reales.

> **Nota importante sobre SMS:**
> Por el uso de la versión de prueba de Twilio, el envío de mensajes SMS solo funciona con dos números telefónicos previamente verificados en el sistema. Si se intenta enviar un SMS a un número no autorizado, el flujo registrará el error y no realizará el envío. 

### b) Usar la Landing Page
- Ejecuta `npm install` en la raíz del proyecto para instalar las dependencias necesarias.
- Crea un archivo `.env` en la raíz del proyecto con los siguientes valores:
  ```env
  N8N_WEBHOOK_URL=https://<tu_instancia_n8n>/webhook/<id_webhook>
  N8N_API_KEY=<Key usado para Header Auth>
  ```
- Ejecuta `npx vercel dev` en la raíz del proyecto para iniciar el servidor local y exponer el endpoint `/api/notify`.
- Abre `localhost:3000` en tu navegador.
- Completa el formulario con los datos del pedido.
- El formulario envía los datos vía POST al webhook de n8n a través del endpoint local.
- Recibirás feedback de éxito o error en pantalla.

### c) Datos esperados
- orderId (requerido)
- customerId (opcional)
- customerEmail (requerido, formato válido)
- customerPhone (requerido, formato internacional)
- notificationPreference (email, sms, both)
- orderStatus (pending, processing, sent, delivered, canceled)
- trackingNumber y deliveryEstimate (requeridos solo si orderStatus es "sent")

---

## 3. Explicación de los Módulos de Código
### a) Validación de Datos
- Implementado en nodo "Execute Code" (JavaScript).
- Verifica presencia y formato de los campos.
- Retorna error claro si alguna validación falla, deteniendo el flujo y registrando el error.

### b) Generación de Mensaje Dinámico
- Implementado en nodo "Execute Code" (JavaScript).
- Construye el mensaje y asunto para email/SMS según el estado del pedido y datos adicionales.

---

## 4. Manejo de Errores
- Todos los errores (validación, envío) se capturan y registran en Google Sheets.
- El flujo permite reintentos automáticos tras 5 minutos para notificaciones fallidas.
- El usuario recibe feedback inmediato en la landing page.

---

## 5. Archivos y Entregables
- `n8n-flow.json`: Flujo n8n exportado.
- `index.html`, `script.js`, `styles.css`: Código fuente de la landing page.
- `api/notify.js`: Endpoint intermediario (API Gateway) que recibe los datos del formulario, valida y reenvía la información al webhook de n8n para disparar el flujo de notificaciones.
- `README.md`: Documentación y guía de uso.
