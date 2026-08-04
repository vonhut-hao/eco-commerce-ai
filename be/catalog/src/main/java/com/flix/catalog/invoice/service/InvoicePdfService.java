package com.flix.catalog.invoice.service;

import com.flix.catalog.common.dto.InvoiceDataDto;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class InvoicePdfService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final String CURRENCY_UNIT = "VND";

    public byte[] generatePdf(InvoiceDataDto data) {
        log.info("Rendering PDF for order ID: {}", data.orderId());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Colors
            Color primaryColor = new Color(34, 139, 34); // Forest Green
            Color darkGray = new Color(60, 60, 60);

            // Title Header
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, primaryColor);
            Paragraph title = new Paragraph("GREEN LIFE INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(15);
            document.add(title);

            // Metadata Table
            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setSpacingAfter(15);

            Font fontBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, darkGray);
            Font fontNormal = FontFactory.getFont(FontFactory.HELVETICA, 10, darkGray);

            addMetaRow(metaTable, "Invoice Number:", "#INV-" + data.orderId(), fontBold, fontNormal);
            addMetaRow(metaTable, "Order Date:", data.createdAt() != null ? data.createdAt().format(DATE_FORMATTER) : "N/A", fontBold, fontNormal);
            addMetaRow(metaTable, "Order Status:", data.status(), fontBold, fontNormal);
            addMetaRow(metaTable, "Customer Name:", data.customerUsername(), fontBold, fontNormal);
            addMetaRow(metaTable, "Customer Email:", data.customerEmail(), fontBold, fontNormal);
            addMetaRow(metaTable, "Payment Method:", data.paymentMethodName(), fontBold, fontNormal);

            document.add(metaTable);

            // Items Table
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{40, 15, 22, 23, 20});
            table.setSpacingAfter(15);

            // Table Header
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
            addCellHeader(table, "Product", headerFont, primaryColor);
            addCellHeader(table, "Quantity", headerFont, primaryColor);
            addCellHeader(table, "Unit Price", headerFont, primaryColor);
            addCellHeader(table, "Total Price", headerFont, primaryColor);
            addCellHeader(table, "Carbon Footprint", headerFont, primaryColor);

            // Table Rows
            for (InvoiceDataDto.InvoiceItemDto item : data.items()) {
                table.addCell(createCell(item.productName(), fontNormal, Element.ALIGN_LEFT));
                table.addCell(createCell(String.valueOf(item.quantity()), fontNormal, Element.ALIGN_CENTER));
                table.addCell(createCell(formatCurrency(item.unitPrice()), fontNormal, Element.ALIGN_RIGHT));
                table.addCell(createCell(formatCurrency(item.totalAmount()), fontNormal, Element.ALIGN_RIGHT));
                table.addCell(createCell(String.format("%.2f kg", item.lineCarbonFootprint()), fontNormal, Element.ALIGN_RIGHT));
            }

            document.add(table);

            // Summary Section
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(50);
            summaryTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

            Font summaryBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, darkGray);
            Font summaryPrimary = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, primaryColor);

            addSummaryRow(summaryTable, "Total Amount:", formatCurrency(data.totalAmount()), summaryPrimary);
            addSummaryRow(summaryTable, "Total Carbon Footprint:", String.format("%.2f kg CO2", data.totalCarbonFootprint()), summaryBold);

            document.add(summaryTable);

            // Footer
            Font footerFont = FontFactory.getFont(FontFactory.TIMES_ITALIC, 9, Color.GRAY);
            Paragraph footer = new Paragraph("\nThank you for shopping sustainably with Green Life!", footerFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            log.error("Failed to generate PDF for order ID: {}", data.orderId(), e);
            throw new RuntimeException("Failed to generate PDF invoice", e);
        }

        return out.toByteArray();
    }

    private String formatCurrency(Long amount) {
        if (amount == null) {
            return "0 " + CURRENCY_UNIT;
        }
        DecimalFormatSymbols symbols = new DecimalFormatSymbols();
        symbols.setGroupingSeparator('.');
        DecimalFormat formatter = new DecimalFormat("#,###", symbols);
        return formatter.format(amount) + " " + CURRENCY_UNIT;
    }

    private void addMetaRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cellLabel = new PdfPCell(new Phrase(label, labelFont));
        cellLabel.setBorder(Rectangle.NO_BORDER);
        table.addCell(cellLabel);

        PdfPCell cellValue = new PdfPCell(new Phrase(value, valueFont));
        cellValue.setBorder(Rectangle.NO_BORDER);
        table.addCell(cellValue);
    }

    private void addSummaryRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell cellLabel = new PdfPCell(new Phrase(label, font));
        cellLabel.setBorder(Rectangle.NO_BORDER);
        cellLabel.setPadding(4);
        table.addCell(cellLabel);

        PdfPCell cellValue = new PdfPCell(new Phrase(value, font));
        cellValue.setBorder(Rectangle.NO_BORDER);
        cellValue.setHorizontalAlignment(Element.ALIGN_RIGHT);
        cellValue.setPadding(4);
        table.addCell(cellValue);
    }

    private void addCellHeader(PdfPTable table, String title, Font font, Color bgColor) {
        PdfPCell cell = new PdfPCell(new Phrase(title, font));
        cell.setBackgroundColor(bgColor);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(6);
        table.addCell(cell);
    }

    private PdfPCell createCell(String text, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(alignment);
        cell.setPadding(5);
        return cell;
    }
}
