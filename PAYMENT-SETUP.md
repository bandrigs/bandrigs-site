# BANDRIGS payment page activation

The /payment/ page is a styled, deliberately inactive integration draft. No charge can be submitted. The sample token supplied by the user matches the public documentation token; it has not been installed. The placeholder PHP action is not a backend.

Before activation:
1. Obtain the BANDRIGS Helcim.js configuration token and verify currency USD, Purchase vs Verify/Pre-Auth, permitted domain, and test/live mode in Helcim.
2. Supply a real server-side POST result handler. Verify the transaction against Helcim before recording payment or returning a paid confirmation. Do not trust browser-posted results, amounts, or query-string flags. Do not log or persist raw card fields, CVV, or complete callback payloads.
3. Match invoice reference, currency, amount and transaction status to the invoice. Process repeated callbacks idempotently. This page currently describes a customer-entered invoice amount; determine whether exact server-enforced amounts or partial payments are allowed before activation.
4. Add the provider script to the payment page head only: https://secure.myhelcim.com/js/version2.js. Set the real configuration token and form action. Keep sensitive card inputs without name attributes so ordinary form POST does not send them to the site.
5. Enable the fields only after configuration is ready and provider script loads. Use reportValidity, amount/expiry validation, and duplicate-click protection before calling helcimProcess(). Restore retry controls for declines and script/network failures; never turn an uncertain outcome into a second automatic charge.
6. Test approved, declined, invalid input, provider/network failure and repeated callbacks with the merchant test configuration. No live payment testing has been performed.
7. Publish only after merchant verification; link the page from customer invoices. It is intentionally noindex and excluded from the sitemap.

Official reference: https://devdocs.helcim.com/docs/html-form-structure
