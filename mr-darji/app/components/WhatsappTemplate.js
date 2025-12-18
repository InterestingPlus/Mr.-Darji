export function OrderConfirmation(phone, orderDetails) {
  if (!orderDetails || !phone) return;

  const message = `*You Order is Confirmed:*\n \n*Name*: orderDetails.name`;

  return `https://wa.me/${phone}/?text=${encodeURIComponent(message)}`;
}

export function PaymentReminder(phone, orderDetails) {
  if (!orderDetails || !phone) return;

  const message = `*Payment Reminder:*\n \n*Name*: orderDetails.name`;

  return `https://wa.me/${phone}/?text=${encodeURIComponent(message)}`;
}
