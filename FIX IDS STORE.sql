
SELECT setval(
  pg_get_serial_sequence('"CategoryType"', 'id'),
  (SELECT COALESCE(MAX("id"), 0) + 1 FROM "CategoryType"),
  false
);

SELECT setval(
  pg_get_serial_sequence('"Service"', 'id'),
  (SELECT COALESCE(MAX("id"), 0) + 1 FROM "Service"),
  false
);

SELECT setval(
  pg_get_serial_sequence('"IdentificationType"', 'id'),
  (SELECT COALESCE(MAX("id"), 0) + 1 FROM "IdentificationType"),
  false
);

SELECT setval(
  pg_get_serial_sequence('"Invoice"', 'invoiceId'),
  (SELECT COALESCE(MAX("invoiceId"), 0) + 1 FROM "Invoice"),
  false
);

SELECT setval(
  pg_get_serial_sequence('"InvoiceDetaill"', 'invoiceDetaillId'),
  (SELECT COALESCE(MAX("invoiceDetaillId"), 0) + 1 FROM "InvoiceDetaill"),
  false
);

SELECT setval(
  pg_get_serial_sequence('"InvoiceType"', 'id'),
  (SELECT COALESCE(MAX("id"), 0) + 1 FROM "InvoiceType"),
  false
);

SELECT setval(
  pg_get_serial_sequence('"PaidType"', 'id'),
  (SELECT COALESCE(MAX("id"), 0) + 1 FROM "PaidType"),
  false
);

SELECT setval(
  pg_get_serial_sequence('"PayType"', 'id'),
  (SELECT COALESCE(MAX("id"), 0) + 1 FROM "PayType"),
  false
);

SELECT setval(
  pg_get_serial_sequence('"phone_code"', 'id'),
  (SELECT COALESCE(MAX("id"), 0) + 1 FROM "phone_code"),
  false
);

SELECT setval(
  pg_get_serial_sequence('"Product"', 'id'),
  (SELECT COALESCE(MAX("id"), 0) + 1 FROM "Product"),
  false
);


SELECT setval(
  pg_get_serial_sequence('"TaxeType"', 'id'),
  (SELECT COALESCE(MAX("id"), 0) + 1 FROM "TaxeType"),
  false
);

 
 