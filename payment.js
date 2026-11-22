// Fail closed until BANDRIGS merchant setup and response verification are complete.
// No card data is stored, logged, sent to our server, or added to a URL here.
(() => {
  const form = document.getElementById('helcimForm');
  if (!form) return;
  form.addEventListener('submit', event => event.preventDefault());
  document.getElementById('buttonProcess').disabled = true;
  document.getElementById('payment-fields').disabled = true;
  // Do not load Helcim or call helcimProcess with the documentation sample token.
})();
