export function calculateEstimatedPrice(quoteForm) {
  const area = Number(quoteForm.areaApproxSqm) || 50;
  let baseRate = 45;

  if (quoteForm.serviceType.includes('Ultra Flake')) baseRate = 44;
  if (quoteForm.serviceType.includes('Hyper Flake')) baseRate = 48;
  if (quoteForm.serviceType.includes('EPO100T')) baseRate = 38;
  if (quoteForm.serviceType.includes('Quartz Shield')) baseRate = 58;
  if (quoteForm.serviceType.includes('Metallic')) baseRate = 75;
  if (quoteForm.serviceType.includes('Sparta-Guard')) baseRate = 52;

  const subtotal = area * baseRate;
  return {
    min: Math.round(subtotal * 0.95),
    max: Math.round(subtotal * 1.15),
  };
}
