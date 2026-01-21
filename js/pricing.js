// pricing.js
// Simple client-side import price estimator.
// Data: base MSRP in USD for each model, exchange rates, and country duty rules.

(function(){
  const models = {
    'mustang-gt': {name: 'Mustang GT', baseUSD: 48000},
    'mustang-shelby': {name: 'Mustang Shelby', baseUSD: 86000},
    'mustang-classic': {name: 'Mustang Classic', baseUSD: 35000},
    'mustang-mach-e': {name: 'Mustang Mach-E', baseUSD: 43000},
  };

  // Very simplified example exchange rates (USD -> local currency)
  const countries = {
    'IN': {name: 'India', currency: 'INR', rate: 83.50, importDutyPct: 100, gstPct: 18},
    'GB': {name: 'United Kingdom', currency: 'GBP', rate: 0.78, importDutyPct: 10, vatPct: 20},
    'AE': {name: 'United Arab Emirates', currency: 'AED', rate: 3.67, importDutyPct: 5, vatPct: 5},
    'DE': {name: 'Germany', currency: 'EUR', rate: 0.92, importDutyPct: 10, vatPct: 19},
    'AU': {name: 'Australia', currency: 'AUD', rate: 1.55, importDutyPct: 5, gstPct: 10},
  };

  function formatCurrency(value, currencyCode){
    try{
      return new Intl.NumberFormat(undefined, {style:'currency', currency:currencyCode, maximumFractionDigits:0}).format(value);
    }catch(e){
      return value.toFixed(0) + ' ' + currencyCode;
    }
  }

  function calculate(modelKey, countryCode, shippingUSD){
    const model = models[modelKey];
    const country = countries[countryCode];

    const baseUSD = model.baseUSD;
    const shipping = Number(shippingUSD) || 0;

    // CIF (Cost, Insurance, Freight) simplified = base + shipping
    const cifUSD = baseUSD + shipping;

    // Import duty = percentage on CIF
    const importDutyUSD = cifUSD * (country.importDutyPct / 100);

    // Tax (VAT/GST) applied on (CIF + Duty)
    const taxPct = country.vatPct || country.gstPct || 0;
    const taxUSD = (cifUSD + importDutyUSD) * (taxPct / 100);

    const totalUSD = cifUSD + importDutyUSD + taxUSD;

    // Convert to local currency
    const totalLocal = totalUSD * country.rate;
    const baseLocal = baseUSD * country.rate;

    return {
      model: model.name,
      country: country.name,
      currency: country.currency,
      breakdown: {
        baseUSD,
        shippingUSD: shipping,
        cifUSD,
        importDutyUSD,
        taxUSD,
        totalUSD,
        totalLocal,
        baseLocal,
        rate: country.rate,
        importDutyPct: country.importDutyPct,
        taxPct
      }
    };
  }

  // UI wiring
  const modelSel = document.getElementById('model');
  const countrySel = document.getElementById('country');
  const shippingInput = document.getElementById('shipping');
  const calcBtn = document.getElementById('calculate');
  const resultBox = document.getElementById('result');
  const breakdownEl = document.getElementById('breakdown');
  const finalPriceEl = document.getElementById('final-price');

  function renderResult(res){
    const b = res.breakdown;
    breakdownEl.innerHTML = '';

    const items = [
      {k: 'Base price (USD)', v: formatCurrency(b.baseUSD, 'USD')},
      {k: 'Shipping & handling (USD)', v: formatCurrency(b.shippingUSD, 'USD')},
      {k: 'CIF (USD)', v: formatCurrency(b.cifUSD, 'USD')},
      {k: `Import duty (${b.importDutyPct}%) (USD)`, v: formatCurrency(b.importDutyUSD, 'USD')},
      {k: `Tax (${b.taxPct}%) (USD)`, v: formatCurrency(b.taxUSD, 'USD')},
      {k: 'Total (USD)', v: formatCurrency(b.totalUSD, 'USD')},
      {k: `Exchange rate (1 USD → ${res.currency})`, v: `1 → ${b.rate}`},
      {k: `Total in ${res.currency}`, v: formatCurrency(b.totalLocal, res.currency)}
    ];

    for(const it of items){
      const li = document.createElement('li');
      li.textContent = `${it.k}: `;
      const span = document.createElement('span');
      span.textContent = it.v;
      span.style.fontWeight = '600';
      li.appendChild(span);
      breakdownEl.appendChild(li);
    }

    finalPriceEl.textContent = `Estimated imported price: ${formatCurrency(b.totalLocal, res.currency)} (${formatCurrency(b.totalUSD, 'USD')})`;
    resultBox.style.display = 'block';
  }

  function onCalculate(){
    const model = modelSel.value;
    const country = countrySel.value;
    const shipping = Number(shippingInput.value) || 0;
    const res = calculate(model, country, shipping);
    renderResult(res);
  }

  calcBtn.addEventListener('click', onCalculate);

  // Pre-calculate with defaults on load
  document.addEventListener('DOMContentLoaded', function(){
    // nothing extra for now
  });

})();