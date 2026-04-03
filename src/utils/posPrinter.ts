import { formatCurrency } from './currency';

/**
 * Utilidad para manejar la apertura del cajón monedero
 * y la impresión de soportes de gastos en impresoras POS.
 */
export const posPrinterService = {
  /**
   * Abre el cajón monedero enviando una impresión "vacía" o con un soporte de gasto.
   * La mayoría de impresoras POS están configuradas para abrir el cajón al recibir 
   * una orden de impresión.
   */
  openDrawerForExpense: (data: {
    amount: number;
    description: string;
    userName: string;
    category?: string;
  }) => {
    const { amount, description, userName, category } = data;
    const date = new Date().toLocaleString('es-CO');

    // Generar un HTML minimalista para el ticket de gasto
    // Este ticket es el que "patea" la apertura del cajón
    const printWindow = window.open('', '_blank', 'width=300,height=400');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <style>
            body { 
              font-family: 'Courier New', Courier, monospace; 
              width: 58mm; /* Ajustado para impresoras POS estándar */
              padding: 5mm;
              font-size: 10px;
              text-align: center;
            }
            .header { font-weight: bold; font-size: 12px; margin-bottom: 5px; }
            .divider { border-top: 1px dashed #000; margin: 5px 0; }
            .amount { font-size: 16px; font-weight: bold; margin: 10px 0; }
            .footer { font-size: 8px; margin-top: 15px; color: #666; }
            @media print {
              @page { margin: 0; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">COMPROBANTE DE GASTO</div>
          <div>${date}</div>
          <div class="divider"></div>
          <div style="text-align: left;">
            <div><strong>Resp:</strong> ${userName}</div>
            <div><strong>Cat:</strong> ${category || 'General'}</div>
          </div>
          <div class="divider"></div>
          <div>CONCEPTO:</div>
          <div style="text-align: left; margin: 5px 0;">${description}</div>
          <div class="amount">${formatCurrency(amount)}</div>
          <div class="divider"></div>
          <div class="footer">
            Este documento es un soporte interno<br>
            de apertura de caja para gastos.
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  },

  /**
   * Solo abre el cajón sin imprimir nada visible (si el driver lo permite)
   */
  justOpenDrawer: () => {
    const printWindow = window.open('', '_blank', 'width=100,height=100');
    if (!printWindow) return;
    
    // Un simple espacio para que la impresora detecte actividad
    printWindow.document.write('<html><body><script>window.onload=function(){window.print();window.close();};</script></body></html>');
    printWindow.document.close();
  }
};
