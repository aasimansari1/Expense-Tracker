import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { currency, formatDate } from './format.js';

export const exportTransactionsPdf = (transactions, { title = 'Transactions Report' } = {}) => {
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString();

  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(title, 14, 18);
  doc.setFontSize(10);
  doc.text(`Generated ${today}`, doc.internal.pageSize.getWidth() - 14, 18, { align: 'right' });

  doc.setTextColor(15, 23, 42);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((a, t) => a + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((a, t) => a + t.amount, 0);

  doc.setFontSize(11);
  doc.text(`Total income:  ${currency(totalIncome)}`, 14, 40);
  doc.text(`Total expense: ${currency(totalExpense)}`, 14, 47);
  doc.text(`Net balance:   ${currency(totalIncome - totalExpense)}`, 14, 54);

  autoTable(doc, {
    startY: 62,
    head: [['Date', 'Title', 'Category', 'Type', 'Amount', 'Note']],
    body: transactions.map((t) => [
      formatDate(t.date),
      t.title,
      t.category,
      t.type,
      `${t.type === 'expense' ? '-' : '+'}${currency(t.amount)}`,
      t.note || '',
    ]),
    headStyles: { fillColor: [99, 102, 241], textColor: 255 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  const filename = `expense-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};

export const exportMonthlyReportPdf = (transactions, { month } = {}) => {
  const filtered = month
    ? transactions.filter((t) => {
        const d = new Date(t.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return key === month;
      })
    : transactions;
  exportTransactionsPdf(filtered, {
    title: month ? `Monthly Report — ${month}` : 'Monthly Report',
  });
};
