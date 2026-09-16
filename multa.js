// ═══════════════════════════════════════════════════
// MULTA.JS — Módulo días-multa
// Parte de DETERMINADOR v3
// ID: VMSIUP-DETERMINADOR-v3-PJ
// Lógica 100% fiel al script.js original del Multador
// ═══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // 1. GESTIÓN DE ESTADO (aislado del módulo PPL)
  const appState = {
    resultado: null,
    resultadoDescuento: null,
  };

  // 2. REFERENCIAS DOM
  const dom = {
    haberMensual:               document.getElementById('haberMensual'),
    haberPredefinido:           document.getElementById('haberPredefinido'),
    porcentaje:                 document.getElementById('porcentaje'),
    diasMulta:                  document.getElementById('diasMulta'),
    haberDiario:                document.getElementById('haberDiario'),
    valorDiaMulta:              document.getElementById('valorDiaMulta'),
    cantidadDias:               document.getElementById('cantidadDias'),
    montoFinal:                 document.getElementById('montoFinal'),
    tipoDescuento:              document.getElementById('tipoDescuento'),
    montoDescontado:            document.getElementById('montoDescontado'),
    resultadoFinalDescuento:    document.getElementById('resultadoFinalDescuento'),
    resultadosDescuentoWrapper: document.getElementById('resultadosDescuentoWrapper'),
    botonesDescuento:           document.getElementById('botonesDescuento'),
  };

  // 3. UTILIDADES
  const formatoMoneda = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });
  const roundToTwo = (num) => Math.round(num * 100) / 100;

  // 4. FUNCIONES PRINCIPALES

  function calcular() {
    const haberMensualVal = parseFloat(dom.haberMensual.value) || parseFloat(dom.haberPredefinido.value) || 0;
    const porcentajeVal   = parseFloat(dom.porcentaje.value);
    const diasMultaVal    = parseInt(dom.diasMulta.value, 10);

    resetearDescuento();

    if (!haberMensualVal || isNaN(porcentajeVal) || porcentajeVal < 25 || porcentajeVal > 50 || !diasMultaVal || diasMultaVal < 10 || diasMultaVal > 730) {
      appState.resultado = null;
      return;
    }

    const haberDiario   = roundToTwo(haberMensualVal / 30);
    const valorDiaMulta = roundToTwo(haberDiario * (porcentajeVal / 100));
    const montoFinal    = roundToTwo(valorDiaMulta * diasMultaVal);

    dom.haberDiario.textContent   = formatoMoneda.format(haberDiario);
    dom.valorDiaMulta.textContent = formatoMoneda.format(valorDiaMulta);
    dom.cantidadDias.textContent  = diasMultaVal;
    dom.montoFinal.textContent    = formatoMoneda.format(montoFinal);

    appState.resultado = { haberMensual: haberMensualVal, haberDiario, porcentaje: porcentajeVal, valorDiaMulta, diasMulta: diasMultaVal, montoFinal };
  }

  function aplicarDescuento(divisor, tipo) {
    if (!appState.resultado) return;
    const { montoFinal }  = appState.resultado;
    const montoDescontado = roundToTwo(montoFinal / divisor);
    const resultadoFinal  = roundToTwo(montoFinal - montoDescontado);
    dom.tipoDescuento.textContent           = tipo;
    dom.montoDescontado.textContent         = formatoMoneda.format(montoDescontado);
    dom.resultadoFinalDescuento.textContent = formatoMoneda.format(resultadoFinal);
    dom.resultadosDescuentoWrapper.style.display = 'block';
    dom.botonesDescuento.style.display           = 'flex';
    appState.resultadoDescuento = { tipo, montoDescontado, resultadoFinal, montoOriginal: montoFinal };
  }

  function resetearFormulario() {
    document.getElementById('main-multa').querySelectorAll('input, select').forEach(el => el.value = '');
    dom.haberDiario.textContent   = 'S/ 0.00';
    dom.valorDiaMulta.textContent = 'S/ 0.00';
    dom.cantidadDias.textContent  = '0';
    dom.montoFinal.textContent    = 'S/ 0.00';
    resetearDescuento();
    appState.resultado = null;
  }

  function resetearDescuento() {
    dom.resultadosDescuentoWrapper.style.display = 'none';
    dom.tipoDescuento.textContent                = '';
    dom.montoDescontado.textContent              = '';
    dom.resultadoFinalDescuento.textContent      = '';
    appState.resultadoDescuento                  = null;
  }

  // 5. EVENT LISTENERS
  ['input', 'change'].forEach(ev => {
    dom.haberMensual.addEventListener(ev, calcular);
    dom.haberPredefinido.addEventListener(ev, () => {
      if (dom.haberPredefinido.value) dom.haberMensual.value = '';
      calcular();
    });
    dom.porcentaje.addEventListener(ev, calcular);
    dom.diasMulta.addEventListener(ev, calcular);
  });

  document.getElementById('copiar').addEventListener('click', () => {
    if (!appState.resultado) return;
    const r = appState.resultado;
    const texto = `Haber mensual: ${formatoMoneda.format(r.haberMensual)}\nHaber diario: ${formatoMoneda.format(r.haberDiario)}\nPorcentaje: ${r.porcentaje}%\nValor de día-multa: ${formatoMoneda.format(r.valorDiaMulta)}\nDías-multa: ${r.diasMulta}\nMonto final: ${formatoMoneda.format(r.montoFinal)}`;
    navigator.clipboard.writeText(texto);
  });

  document.getElementById('whatsapp').addEventListener('click', () => {
    if (!appState.resultado) return;
    const r = appState.resultado;
    const texto = `Víctor Siu te brinda el resultado:\n\nHaber mensual: ${formatoMoneda.format(r.haberMensual)}\nHaber diario: ${formatoMoneda.format(r.haberDiario)}\nPorcentaje: ${r.porcentaje}%\nValor de día-multa: ${formatoMoneda.format(r.valorDiaMulta)}\nDías-multa: ${r.diasMulta}\n*Monto final: ${formatoMoneda.format(r.montoFinal)}*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  });

  document.getElementById('nuevo').addEventListener('click', resetearFormulario);

  document.getElementById('descuentoSexto').addEventListener('click',   () => aplicarDescuento(6, '1/6 por Terminación anticipada'));
  document.getElementById('descuentoSeptimo').addEventListener('click', () => aplicarDescuento(7, '1/7 por Conclusión anticipada'));

  document.getElementById('copiarDescuento').addEventListener('click', () => {
    if (!appState.resultadoDescuento) return;
    const r = appState.resultadoDescuento;
    const texto = `Monto original: ${formatoMoneda.format(r.montoOriginal)}\nDescuento: ${r.tipo}\nMonto descontado: ${formatoMoneda.format(r.montoDescontado)}\nMonto con descuento: ${formatoMoneda.format(r.resultadoFinal)}`;
    navigator.clipboard.writeText(texto);
  });

  document.getElementById('whatsappDescuento').addEventListener('click', () => {
    if (!appState.resultadoDescuento) return;
    const r = appState.resultadoDescuento;
    const texto = `Víctor Siu te brinda el resultado con descuento:\n\nMonto original: ${formatoMoneda.format(r.montoOriginal)}\nDescuento: ${r.tipo}\nMonto descontado: ${formatoMoneda.format(r.montoDescontado)}\n*Monto con descuento: ${formatoMoneda.format(r.resultadoFinal)}*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  });

});
