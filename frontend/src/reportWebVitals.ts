import { onCLS, onLCP, onFCP, onTTFB } from 'web-vitals';

/**
 * TODO: Implementar lógica de reporte de métricas web-vitals
 * 
 * Opciones recomendadas:
 * 1. Enviar a Google Analytics: usar gtag('event', 'web_vitals', {...})
 * 2. Enviar a endpoint propio: fetch('/api/metrics', { method: 'POST', body: JSON.stringify(metric) })
 * 3. Enviar a servicios de monitoreo: Sentry, Datadog, etc.
 * 4. Log a consola para desarrollo: console.log('Web Vitals:', metric)
 * 
 * Ejemplo de implementación:
 * const sendToAnalytics = (metric: any) => {
 *   // Enviar métrica a tu sistema de analítica
 *   console.log('Web Vitals:', metric);
 * };
 * 
 * Luego llamar: reportWebVitals(sendToAnalytics);
 */
const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry);
    onLCP(onPerfEntry);
    onFCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
