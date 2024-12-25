const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Route to generate and send the PDF
app.get('/download-bill', (req, res) => {
  const { companyName, productName, amount, date } = req.query;

  // Validate required query parameters
  if (!companyName || !productName || !amount || !date) {
    return res.status(400).send('Missing required query parameters.');
  }

  // Create a PDF document
  const doc = new PDFDocument();
  const fileName = `bill-${Date.now()}.pdf`;

  // Set response headers for the PDF
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Type', 'application/pdf');

  // Pipe the PDF to the response
  doc.pipe(res);

  // Add content to the PDF
  doc.fontSize(18).text('Purchase Bill', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Company Name: ${companyName}`);
  doc.text(`Product Name: ${productName}`);
  doc.text(`Amount: $${amount}`);
  doc.text(`Date: ${date}`);
  doc.moveDown();
  doc.text('Thank you for your purchase!', { align: 'center' });

  // Finalize the PDF
  doc.end();
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
