document.addEventListener('DOMContentLoaded', () => {
  const orderForm = document.getElementById('orderForm');
  const orderStatus = document.getElementById('orderStatus');
  const trackingSection = document.getElementById('trackingSection');
  const deliverySection = document.getElementById('deliverySection');
  const feedback = document.getElementById('feedback');
  const today = new Date().toISOString().split('T')[0];

  // Aplicar fecha de hoy a los campos de fecha
  const deliveryEstimateInput = document.getElementById('deliveryEstimate');
  if (deliveryEstimateInput) {
    deliveryEstimateInput.min = today;
    deliveryEstimateInput.value = today;
  }

  // Muestra los campos de seguimiento y entrega si el estado es "sent"
  orderStatus.addEventListener('change', (e) => {
    if (e.target.value === 'sent') {
      trackingSection.style.display = 'flex';
      deliverySection.style.display = 'flex';
      trackingSection.querySelector('input').required = true;
      deliverySection.querySelector('input').required = true;

    } else {
      trackingSection.style.display = 'none';
      deliverySection.style.display = 'none';
      trackingSection.querySelector('input').required = false;
      deliverySection.querySelector('input').required = false;
    }
  });

  // Función para mostrar y ocultar el feedback
  function showFeedback(message, type = 'success') {
    feedback.textContent = message;
    feedback.className = 'feedback ' + type;
    feedback.style.display = 'block';
    setTimeout(() => {
      feedback.textContent = '';
      feedback.className = 'feedback';
      feedback.style.display = 'none';
    }, 5000);
  }

  // Function para desactivar los campos del formulario
  function disableFormFields(disable = true) {
    orderForm.querySelectorAll('input, select, button[type="submit"]').forEach(el => el.disabled = disable);
  }

  // Envío de formulario
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'feedback';
    feedback.style.display = 'none';

    const data = {
      orderId: orderForm.orderId.value.trim(),
      customerId: orderForm.customerId.value.trim(),
      customerEmail: orderForm.customerEmail.value.trim(),
      customerPhone: orderForm.customerPhone.value.trim(),
      notificationPreference: orderForm.notificationPreference.value,
      orderStatus: orderForm.orderStatus.value,
      trackingNumber: orderForm.trackingNumber.value.trim(),
      deliveryEstimate: orderForm.deliveryEstimate.value.trim()
    };

    if (data.orderStatus !== 'sent') {
      delete data.trackingNumber;
      delete data.deliveryEstimate;
    }

    try {
      // Deshabilitar los campos del formulario para evitar múltiples envíos
      disableFormFields(true);

      // Envío de datos al servidor
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();

      // Manejo de la respuesta
      if (response.ok && result.status === 'success') {
        showFeedback('¡Notificación enviada correctamente!', 'success');
        orderForm.reset();
        trackingSection.style.display = 'none';
        deliverySection.style.display = 'none';
      } else {
        showFeedback(result.message || 'Error al enviar la notificación.', 'error');
      }

      // Habilitar los campos del formulario nuevamente
      disableFormFields(false);
    } catch (err) {
      // Manejo de errores de conexión
      showFeedback('Error de conexión. Por favor, inténtalo de nuevo.', 'error');
      disableFormFields(false);
    }
  });
});
