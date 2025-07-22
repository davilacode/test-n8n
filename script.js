// script.js - Landing page logic

document.addEventListener('DOMContentLoaded', () => {
  const orderForm = document.getElementById('orderForm');
  const orderStatus = document.getElementById('orderStatus');
  const trackingSection = document.getElementById('trackingSection');
  const deliverySection = document.getElementById('deliverySection');
  const feedback = document.getElementById('feedback');
  const today = new Date().toISOString().split('T')[0];

  const deliveryEstimateInput = document.getElementById('deliveryEstimate');
  if (deliveryEstimateInput) {
    deliveryEstimateInput.min = today;
    deliveryEstimateInput.value = today;
  }

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

  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'feedback';

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

      orderForm.querySelectorAll('input, select, button[type="submit"]').forEach(el => el.disabled = true);

      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (response.ok && result.status === 'success') {
        feedback.textContent = '¡Notificación enviada correctamente!';
        feedback.classList.add('success');
        orderForm.reset();
        trackingSection.style.display = 'none';
        deliverySection.style.display = 'none';
      } else {
        feedback.textContent = result.message || 'Error al enviar la notificación.';
        feedback.classList.add('error');
      }

      orderForm.querySelectorAll('input, select, button[type="submit"]').forEach(el => el.disabled = false);
      orderForm.querySelector('button[type="submit"], input').disabled = false;
    } catch (err) {
      feedback.textContent = 'Error de conexión. Por favor, inténtalo de nuevo.';
      feedback.classList.add('error');

      orderForm.querySelector('button[type="submit"], input').disabled = false;
    }
  });
});
