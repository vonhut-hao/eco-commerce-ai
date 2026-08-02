-- V14__fix_green_certificates_data.sql
-- Delete existing wrong case certificates
DELETE FROM green_certificates;

-- Seed exact uppercase strings for certificates to match frontend filters
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('BIODEGRADABLE', 'Eco Cert', '2023-01-01', 1);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('BPA FREE', 'Health Std', '2023-01-01', 1);

INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('100% ORGANIC', 'Org Cert', '2023-02-01', 2);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('COMPOSTABLE', 'Eco Cert', '2023-02-01', 2);

INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('ZERO PLASTIC', 'PlasticFree', '2023-03-01', 3);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('BIODEGRADABLE', 'Eco Cert', '2023-03-01', 3);

INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('RECYCLABLE', 'RecycleStd', '2023-04-01', 4);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('BPA FREE', 'Health Std', '2023-04-01', 4);

INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('BIODEGRADABLE', 'Eco Cert', '2023-05-01', 5);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('100% NATURAL', 'Nat Cert', '2023-05-01', 5);

INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('100% NATURAL', 'Nat Cert', '2023-06-01', 6);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('BIODEGRADABLE', 'Eco Cert', '2023-06-01', 6);

INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('RECYCLABLE', 'RecycleStd', '2023-07-01', 7);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('BPA FREE', 'Health Std', '2023-07-01', 7);

INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('FSC CERTIFIED', 'FSC', '2023-08-01', 8);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('BIODEGRADABLE', 'Eco Cert', '2023-08-01', 8);

INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('100% ORGANIC', 'Org Cert', '2023-09-01', 9);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('COMPOSTABLE', 'Eco Cert', '2023-09-01', 9);

INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('BIODEGRADABLE', 'Eco Cert', '2023-10-01', 10);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('PLANTABLE', 'Plant Cert', '2023-10-01', 10);

INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('SUSTAINABLE', 'Sust Cert', '2023-11-01', 11);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('DURABLE', 'Dur Cert', '2023-11-01', 11);

INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('PET SAFE', 'Pet Cert', '2023-12-01', 12);
INSERT INTO green_certificates (name, issuer, issue_date, product_id) VALUES ('BIODEGRADABLE', 'Eco Cert', '2023-12-01', 12);
