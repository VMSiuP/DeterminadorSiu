// ═══════════════════════════════════════════════════
// Hola, curioso/a 👋
// Esta app fue creada por Víctor Manuel Siu Puyén
// Fiscal — Fiscalía de Piura, Perú
// Contacto: https://wa.me/51969761336
// Hecha con amor para Cindy, Andrés y Abril ❤️
// "Pena concreta fácilmente."
// ID: VMSIUP-DET-v3 © 2025
// ═══════════════════════════════════════════════════
console.log('%c⚖️ DETERMINADOR', 'color:#C8A84B;font-size:22px;font-weight:bold;font-family:Georgia,serif;');
console.log('%cCreado por Víctor Manuel Siu Puyén', 'color:#C8A84B;font-size:13px;font-weight:600;');
console.log('%cFiscal — Piura, Perú  |  wa.me/51969761336', 'color:#4A4A4A;font-size:11px;');
console.log('%c"Pena concreta fácilmente." 🏛️', 'color:#C8A84B;font-size:11px;font-style:italic;');

// ── Easter Egg: secuencia Konami ─────────────────────────────────────
const KONAMI = [38,38,40,40,37,39,37,39,66,65];
let ki = 0;
document.addEventListener('keydown', e => {
  ki = (e.keyCode === KONAMI[ki]) ? ki + 1 : 0;
  if (ki === KONAMI.length) {
    ki = 0;
    alert('⚖️ ¡Encontraste el easter egg!\n\nDETERMINADOR, creado por\nVíctor Manuel Siu Puyén\nFiscal, Piura - Perú\n"Pena concreta fácilmente"\n\nHecho con ❤️ para Cindy, Andrés y Abril.');
  }
});

// ── Service Worker ───────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(r => console.log('SW registrado:', r.scope))
      .catch(e => console.error('SW error:', e));
  });
}

// ── Offline banner ───────────────────────────────────────────────────
window.addEventListener('offline', () => { document.getElementById('offlineBanner').style.display = 'block'; });
window.addEventListener('online',  () => { document.getElementById('offlineBanner').style.display = 'none';  });

// ════════════════════════════════════════════════════════════════════
//  INSTALACIÓN PWA
//  - Android/Chrome Desktop: evento beforeinstallprompt
//  - iOS/Safari: detección manual + instrucciones
//  El banner desaparece al instalar o al cerrarlo (se guarda en localStorage)
// ════════════════════════════════════════════════════════════════════
(function initInstall() {
  const installBanner  = document.getElementById('installBanner');
  const iosBanner      = document.getElementById('iosBanner');
  const btnInstalar    = document.getElementById('btnInstalar');
  const btnCerrarInst  = document.getElementById('btnCerrarInstall');
  const btnCerrarIos   = document.getElementById('btnCerrarIos');
  let deferredPrompt   = null;

  // No mostrar si el usuario ya lo cerró antes
  const yaInstalado = localStorage.getItem('det-install-cerrado');
  if (yaInstalado) return;

  // ── Android / Chrome Desktop ──────────────────────────────────────
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBanner.classList.remove('hidden');
  });

  btnInstalar.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBanner.classList.add('hidden');
    if (outcome === 'accepted') localStorage.setItem('det-install-cerrado', '1');
  });

  // Al instalar desde el navegador directamente
  window.addEventListener('appinstalled', () => {
    installBanner.classList.add('hidden');
    localStorage.setItem('det-install-cerrado', '1');
  });

  // Cerrar banner manualmente
  btnCerrarInst.addEventListener('click', () => {
    installBanner.classList.add('hidden');
    localStorage.setItem('det-install-cerrado', '1');
  });

  // ── iOS / Safari ──────────────────────────────────────────────────
  // Safari no dispara beforeinstallprompt — detectar manualmente
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isInStandaloneMode = window.navigator.standalone === true;
  if (isIos && !isInStandaloneMode) {
    iosBanner.classList.remove('hidden');
  }
  btnCerrarIos.addEventListener('click', () => {
    iosBanner.classList.add('hidden');
    localStorage.setItem('det-install-cerrado', '1');
  });

})();

// ════════════════════════════════════════════════════════════════════
//  INICIALIZACIÓN GENERAL (tema + tabs) — se ejecuta inmediatamente
// ════════════════════════════════════════════════════════════════════
(function initShared() {

  // ── TEMA ────────────────────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const applyTheme = (theme) => {
    document.body.className = theme === 'dark-mode' ? 'dark-mode' : '';
    themeToggle.checked = theme === 'dark-mode';
  };
  applyTheme(localStorage.getItem('det-theme') || 'light-mode');
  themeToggle.addEventListener('change', () => {
    const t = themeToggle.checked ? 'dark-mode' : 'light-mode';
    applyTheme(t);
    localStorage.setItem('det-theme', t);
  });

  // ── TABS ─────────────────────────────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
      // Scroll al inicio del contenido al cambiar de tab
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

})();

// ════════════════════════════════════════════════════════════════════
//  LÓGICA PPL — PENA PRIVATIVA DE LIBERTAD (app.js original)
// ════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  // --- ESTADO Y REFERENCIAS UI ---
  let state = {};
  const ui = {
    themeToggle:                document.getElementById('themeToggle'),
    minAnos:                    document.getElementById('minAnos'),
    minMeses:                   document.getElementById('minMeses'),
    minDias:                    document.getElementById('minDias'),
    maxAnos:                    document.getElementById('maxAnos'),
    maxMeses:                   document.getElementById('maxMeses'),
    maxDias:                    document.getElementById('maxDias'),
    circunstancias:             document.getElementById('circunstancias'),
    submoduloIncremento:        document.getElementById('submoduloIncremento'),
    submoduloDisminucion:       document.getElementById('submoduloDisminucion'),
    submoduloAmbas:             document.getElementById('submoduloAmbas'),
    module02:                   document.getElementById('module02'),
    module03:                   document.getElementById('module03'),
    module04:                   document.getElementById('module04'),
    module05:                   document.getElementById('module05'),
    module06:                   document.getElementById('module06'),
    btnCalcularIncremento:      document.getElementById('btnCalcularIncremento'),
    btnCalcularDisminucion:     document.getElementById('btnCalcularDisminucion'),
    btnCalcularAmbas:           document.getElementById('btnCalcularAmbas'),
    btnDividirTercios:          document.getElementById('btnDividirTercios'),
    btnCalcularEscalonado:      document.getElementById('btnCalcularEscalonado'),
    btnCalcularReduccion:       document.getElementById('btnCalcularReduccion'),
    btnConvertirJornadas:       document.getElementById('btnConvertirJornadas'),
    btnNuevoCalculo:            document.getElementById('btnNuevoCalculo'),
    resultadoModulo01:          document.getElementById('resultadoModulo01'),
    textoResultadoModulo01:     document.getElementById('textoResultadoModulo01'),
    sistemaDeterminacion:       document.getElementById('sistemaDeterminacion'),
    terciosMinDisplay:          document.getElementById('terciosMinDisplay'),
    terciosMaxDisplay:          document.getElementById('terciosMaxDisplay'),
    contenidoResultadoModulo03: document.getElementById('contenidoResultadoModulo03'),
    escalonadoMinDisplay:       document.getElementById('escalonadoMinDisplay'),
    escalonadoMaxDisplay:       document.getElementById('escalonadoMaxDisplay'),
    agravantesTipo:             document.getElementById('agravantesTipo'),
    agravantesCaso:             document.getElementById('agravantesCaso'),
    contenidoResultadoModulo04: document.getElementById('contenidoResultadoModulo04'),
    contenidoResultadoModulo05: document.getElementById('contenidoResultadoModulo05'),
    contenidoResultadoModulo06: document.getElementById('contenidoResultadoModulo06'),
    finalSummary:               document.getElementById('finalSummary'),
    summaryContent:             document.getElementById('summaryContent'),
    btnCopiarResumen:           document.getElementById('btnCopiarResumen'),
    btnCompartirResumen:        document.getElementById('btnCompartirResumen'),
  };

  // --- UTILIDADES ---
  const toDays   = (a, m, d) => (a * 360) + (m * 30) + d;
  const fromDays = (totalDays) => {
    if (isNaN(totalDays) || totalDays < 0) return { anos: 0, meses: 0, dias: 0 };
    const anos  = Math.floor(totalDays / 360);
    const rem   = totalDays % 360;
    const meses = Math.floor(rem / 30);
    const dias  = Math.round(rem % 30);
    return { anos, meses, dias };
  };
  const formatYMD   = (ymd) => `${ymd.anos} Años, ${ymd.meses} Meses, ${ymd.dias} Días`;
  const parseFactor = (str) => str.includes('/') ? str.split('/').map(Number).reduce((n, d) => n / d) : Number(str);
  const show = (el) => el.classList.remove('hidden');
  const hide = (el) => el.classList.add('hidden');

  const copyToClipboard = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  };

  // --- PARSE PENA INICIAL ---
  const parseInitialPenalty = () => {
    state.summary = [];
    const [minA, minM, minD] = [ui.minAnos, ui.minMeses, ui.minDias].map(el => parseInt(el.value) || 0);
    const [maxA, maxM, maxD] = [ui.maxAnos, ui.maxMeses, ui.maxDias].map(el => parseInt(el.value) || 0);
    let minDays = toDays(minA, minM, minD);
    let maxDays = toDays(maxA, maxM, maxD);
    if (minDays === 0 && maxDays > 0) minDays = 2;
    if (maxDays === 0 && minDays > 0) maxDays = toDays(35, 0, 0);
    if (minDays > maxDays) { alert("El extremo mínimo no puede ser mayor que el máximo."); return false; }
    state.initialMinDays = minDays;
    state.initialMaxDays = maxDays;
    updateSummary('Pena Abstracta Inicial', `De ${formatYMD(fromDays(minDays))} a ${formatYMD(fromDays(maxDays))}`);
    return true;
  };

  const displayModule1Result = (min, max, title, submoduleElement, customSummaryText) => {
    state.adjustedMinDays = min;
    state.adjustedMaxDays = max;
    const resultText = `De <strong>${formatYMD(fromDays(min))}</strong> a <strong>${formatYMD(fromDays(max))}</strong>.`;
    ui.textoResultadoModulo01.innerHTML = `<p>${resultText}</p>`;
    show(ui.resultadoModulo01);
    show(ui.module02);
    updateSummary(title, customSummaryText || resultText);
    if (submoduleElement) {
      submoduleElement.classList.add('disabled-visuals');
      submoduleElement.querySelectorAll('input, button').forEach(el => el.disabled = true);
    }
    ui.resultadoModulo01.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const updateSummary = (title, text) => {
    state.summary = state.summary.filter(item => item.title !== title);
    state.summary.push({ title, text });
  };

  const renderSummary = () => {
    const html = state.summary.map(item => {
      const d = document.createElement('div');
      d.innerHTML = item.text;
      return `<h4>${item.title}</h4><p>${d.innerHTML}</p>`;
    }).join('');
    ui.summaryContent.innerHTML = html;
    show(ui.finalSummary);
    show(ui.btnNuevoCalculo);
  };

  // --- MÓDULO 01 ---
  ui.circunstancias.addEventListener('change', () => {
    document.querySelectorAll('.submodule, .result-box, #module02, #module03, #module04, #module05, #module06, #finalSummary, #btnNuevoCalculo').forEach(hide);
    document.querySelectorAll('.submodule').forEach(sub => {
      sub.classList.remove('disabled-visuals');
      sub.querySelectorAll('input, button').forEach(el => el.disabled = false);
    });
    const sel = ui.circunstancias.value;
    if (sel === 'no') {
      if (!parseInitialPenalty()) return;
      state.adjustedMinDays = state.initialMinDays;
      state.adjustedMaxDays = state.initialMaxDays;
      show(ui.module02);
    } else if (sel) {
      show(document.getElementById(`submodulo${sel.charAt(0).toUpperCase() + sel.slice(1)}`));
    }
  });

  ui.btnCalcularIncremento.addEventListener('click', () => {
    if (!parseInitialPenalty()) return;
    const cbs = Array.from(document.querySelectorAll('input[name="incrementoFactor"]:checked'));
    if (!cbs.length) return alert("Seleccione al menos una circunstancia.");
    const factors = cbs.map(cb => parseFactor(cb.value));
    const labels  = cbs.map(cb => cb.parentElement.textContent.trim());
    const results = factors.map(f => state.initialMaxDays + (state.initialMaxDays * f));
    const finalMin = state.initialMaxDays;
    const finalMax = Math.max(...results);
    let st = `Circunstancias seleccionadas:<br>- ${labels.join('<br>- ')}`;
    st += `<br><b>Nuevo Marco Penal: De ${formatYMD(fromDays(finalMin))} a ${formatYMD(fromDays(finalMax))}</b>`;
    displayModule1Result(finalMin, finalMax, 'Incremento sobre el máximo', ui.submoduloIncremento, st);
  });

  ui.btnCalcularDisminucion.addEventListener('click', () => {
    if (!parseInitialPenalty()) return;
    const cbs = Array.from(document.querySelectorAll('input[name="disminucionFactor"]:checked'));
    if (!cbs.length) return alert("Seleccione al menos una circunstancia.");
    const factors = cbs.map(cb => parseFactor(cb.value));
    const labels  = cbs.map(cb => cb.parentElement.textContent.trim());
    const results = factors.map(f => ({ min: state.initialMinDays * (1-f), max: state.initialMaxDays * (1-f) }));
    const finalMin = Math.min(...results.map(r => r.min));
    const finalMax = Math.max(...results.map(r => r.max));
    let st = `Circunstancias seleccionadas:<br>- ${labels.join('<br>- ')}`;
    st += `<br><b>Nuevo Marco Penal: De ${formatYMD(fromDays(finalMin))} a ${formatYMD(fromDays(finalMax))}</b>`;
    displayModule1Result(finalMin, finalMax, 'Disminución bajo el mínimo', ui.submoduloDisminucion, st);
  });

  ui.btnCalcularAmbas.addEventListener('click', () => {
    if (!parseInitialPenalty()) return;
    const incCbs  = Array.from(document.querySelectorAll('input[name="incrementoFactorAmbas"]:checked'));
    if (!incCbs.length) return alert("Seleccione un incremento.");
    const dismCbs = Array.from(document.querySelectorAll('input[name="disminucionFactorAmbas"]:checked'));
    if (!dismCbs.length) return alert("Seleccione una disminución.");
    const incF  = incCbs.map(cb => parseFactor(cb.value));
    const incL  = incCbs.map(cb => cb.parentElement.textContent.trim());
    const dismF = dismCbs.map(cb => parseFactor(cb.value));
    const dismL = dismCbs.map(cb => cb.parentElement.textContent.trim());
    const intMax = Math.max(...incF.map(f => state.initialMaxDays + (state.initialMaxDays * f)));
    const intMin = state.initialMaxDays;
    const res    = dismF.map(f => ({ min: intMin * (1-f), max: intMax * (1-f) }));
    const finalMin = Math.min(...res.map(r => r.min));
    const finalMax = Math.max(...res.map(r => r.max));
    let st = `<u>Paso 1: Incremento</u><br>Circunstancias seleccionadas: ${incL.join(', ')}`;
    st += `<br>Marco Intermedio: De ${formatYMD(fromDays(intMin))} a ${formatYMD(fromDays(intMax))}`;
    st += `<br><u>Paso 2: Disminución</u><br>Circunstancias seleccionadas: ${dismL.join(', ')}`;
    st += `<br><b>Nuevo Marco Penal Final: De ${formatYMD(fromDays(finalMin))} a ${formatYMD(fromDays(finalMax))}</b>`;
    displayModule1Result(finalMin, finalMax, 'Incremento y Disminución', ui.submoduloAmbas, st);
  });

  // --- MÓDULO 02 ---
  ui.sistemaDeterminacion.addEventListener('change', () => {
    hide(ui.module03); hide(ui.module04);
    const sel     = ui.sistemaDeterminacion.value;
    const minText = formatYMD(fromDays(state.adjustedMinDays));
    const maxText = formatYMD(fromDays(state.adjustedMaxDays));
    if (sel === 'tercios') {
      ui.terciosMinDisplay.textContent = minText;
      ui.terciosMaxDisplay.textContent = maxText;
      show(ui.module03);
    } else if (sel === 'escalonado') {
      ui.escalonadoMinDisplay.textContent = minText;
      ui.escalonadoMaxDisplay.textContent = maxText;
      show(ui.module04);
    }
  });

  // --- MÓDULO 03: TERCIOS ---
  ui.btnDividirTercios.addEventListener('click', () => {
    const range  = state.adjustedMaxDays - state.adjustedMinDays;
    const tercio = range / 3;
    const l1     = state.adjustedMinDays + tercio;
    const l2     = l1 + tercio;
    const content = `<p>Cada tercio equivale a: <strong>${formatYMD(fromDays(tercio))}</strong></p>` +
      `<p>Tercio inferior: De ${formatYMD(fromDays(state.adjustedMinDays))} a <strong>${formatYMD(fromDays(l1))}</strong></p>` +
      `<p>Tercio medio: De ${formatYMD(fromDays(l1))} a <strong>${formatYMD(fromDays(l2))}</strong></p>` +
      `<p>Tercio superior: De ${formatYMD(fromDays(l2))} a <strong>${formatYMD(fromDays(state.adjustedMaxDays))}</strong></p>`;
    const el = document.getElementById('resultadoModulo03');
    ui.contenidoResultadoModulo03.innerHTML = content;
    show(el); show(ui.module05); mostrarModulo06();
    updateSummary('Sistema de Tercios', content);
    renderSummary();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // --- MÓDULO 04: ESCALONADO ---
  ui.btnCalcularEscalonado.addEventListener('click', () => {
    const total = parseInt(ui.agravantesTipo.value);
    const caso  = parseInt(ui.agravantesCaso.value);
    if (isNaN(total) || total <= 0 || isNaN(caso) || caso < 0 || caso > total)
      return alert("Datos de agravantes inválidos.");
    const range  = state.adjustedMaxDays - state.adjustedMinDays;
    const valAg  = range / total;
    const inc    = valAg * caso;
    const pena   = state.adjustedMinDays + inc;
    state.basePenaltyForReduction = pena;
    state.finalPenaltyDays        = pena;
    const content = `<p>Cada agravante equivale a: <strong>${formatYMD(fromDays(valAg))}</strong></p>` +
      `<p>Incremento por ${caso} agravante(s): <strong>${formatYMD(fromDays(inc))}</strong></p>` +
      `<p>Pena concreta: <strong>${formatYMD(fromDays(pena))}</strong></p>`;
    const st = `Agravantes del tipo penal: ${total}<br>Agravantes del caso concreto: ${caso}<br>` +
      content.replace(/<strong>/g,'<b>').replace(/<\/strong>/g,'</b>').replace(/<p>/g,'').replace(/<\/p>/g,'<br>');
    const el = document.getElementById('resultadoModulo04');
    ui.contenidoResultadoModulo04.innerHTML = content;
    show(el); show(ui.module05); mostrarModulo06();
    updateSummary('Sistema Escalonado', st);
    renderSummary();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // --- MÓDULO 05: REDUCCIÓN ---
  ui.btnCalcularReduccion.addEventListener('click', () => {
    const cbs     = Array.from(document.querySelectorAll('input[name="reduccionPena"]:checked'));
    const factors = cbs.map(cb => parseFactor(cb.value));
    const labels  = cbs.map(cb => cb.parentElement.textContent.trim());
    let penaFinal      = state.basePenaltyForReduction;
    let contentDisplay = `<p>No se aplicaron reducciones.</p>`;
    let contentSummary = `No se aplicaron reducciones.`;
    if (factors.length > 0) {
      const maxF  = Math.max(...factors);
      const label = labels[factors.indexOf(maxF)];
      const red   = state.basePenaltyForReduction * maxF;
      penaFinal   = state.basePenaltyForReduction - red;
      contentDisplay = `<p>Pena final con reducción: <strong>${formatYMD(fromDays(penaFinal))}</strong></p>`;
      contentSummary = `Reducción seleccionada: ${label}<br>Monto de la reducción: ${formatYMD(fromDays(red))}<br>` +
        `<b>Pena concreta final con reducción: ${formatYMD(fromDays(penaFinal))}</b>`;
    }
    state.finalPenaltyDays = penaFinal;
    const el = document.getElementById('resultadoModulo05');
    ui.contenidoResultadoModulo05.innerHTML = contentDisplay;
    show(el);
    hide(document.getElementById('resultadoModulo06'));
    mostrarModulo06();
    updateSummary('Reducción sobre Pena Concreta', contentSummary);
    renderSummary();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // --- MÓDULO 06: CONVERSIÓN A JORNADAS ---
  const mostrarModulo06 = () => {
    if (state.finalPenaltyDays === undefined) return;
    const LIMITE = 5 * 365;
    const ymd    = fromDays(state.finalPenaltyDays);
    const dias   = (ymd.anos * 365) + (ymd.meses * 30) + ymd.dias;
    document.getElementById('penaConcretaDisplay').textContent = formatYMD(ymd);
    if (dias > LIMITE) {
      show(document.getElementById('module06Bloqueado'));
      hide(document.getElementById('module06Activo'));
    } else {
      hide(document.getElementById('module06Bloqueado'));
      show(document.getElementById('module06Activo'));
    }
    show(ui.module06);
  };

  ui.btnConvertirJornadas.addEventListener('click', () => {
    const ymd  = fromDays(state.finalPenaltyDays);
    const dias = (ymd.anos * 365) + (ymd.meses * 30) + ymd.dias;
    const raw  = Math.ceil(dias / 7);
    const fin  = Math.max(10, Math.min(raw, 156));
    const content = `<p>Días computados: <strong>${dias} días naturales</strong></p>` +
      `<p>Jornadas brutas (÷7, redondeado al alza): <strong>${raw}</strong></p>` +
      `<p>Jornadas finales (mín. 10, máx. 156): <strong>${fin} jornadas</strong></p>`;
    ui.contenidoResultadoModulo06.innerHTML = content;
    show(document.getElementById('resultadoModulo06'));
    updateSummary('Conversión a Jornadas', content);
    renderSummary();
    document.getElementById('resultadoModulo06').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // --- COPIAR / COMPARTIR ---
  const getTextForClipboard = (el) => {
    if (!el) return '';
    const d = document.createElement('div');
    d.innerHTML = el.innerHTML;
    d.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
    d.querySelectorAll('h4').forEach(h4 => h4.replaceWith(`\n--- ${h4.textContent.toUpperCase()} ---\n`));
    return d.textContent || d.innerText;
  };

  const handleCopy = (e) => {
    const btn = e.currentTarget;
    const el  = btn.id === 'btnCopiarResumen' ? ui.summaryContent : document.getElementById(btn.dataset.target);
    const txt = el ? getTextForClipboard(el).trim() : '';
    if (txt) {
      copyToClipboard(txt);
      const orig = btn.textContent;
      btn.textContent = '¡Copiado!';
      setTimeout(() => { if (btn) btn.textContent = orig; }, 1500);
    }
  };

  const handleWA = (e) => {
    const btn = e.currentTarget;
    const el  = btn.id === 'btnCompartirResumen' ? ui.summaryContent : document.getElementById(btn.dataset.target);
    const txt = el ? getTextForClipboard(el).trim() : '';
    if (txt) window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(txt)}`, '_blank');
  };

  // Solo los botones del tab PPL
  document.querySelectorAll('#tab-ppl .copy-button, #btnCopiarResumen').forEach(b => b.addEventListener('click', handleCopy));
  document.querySelectorAll('#tab-ppl .whatsapp-button, #btnCompartirResumen').forEach(b => b.addEventListener('click', handleWA));

  ui.btnNuevoCalculo.addEventListener('click', () => window.location.reload());

});
