import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from "@/components/NavBar";
import { FaEdit, FaTrash, FaFilePdf, FaChevronCircleLeft } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const InvoicePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [invoices, setInvoices] = useState([]);
  const [amountTF, setAmountTF] = useState(0);
  const [amountTTC, setAmountTTC] = useState(0);
  const [issuedDate, setIssuedDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [error, setError] = useState(null);
  const [caseDetails, setCaseDetails] = useState({});
  const [clientDetails, setClientDetails] = useState({});

  useEffect(() => {
    if (!id) return;
  
    const fetchInvoicesAndCase = async () => {
      try {
        const invoiceResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/invoices?filters[case][$eq]=${id}`);
        if (!invoiceResponse.ok) throw new Error('Failed to fetch invoices');
        const invoiceData = await invoiceResponse.json();
        setInvoices(invoiceData.data);

        const caseResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/cases/${id}?populate=client`);
        if (!caseResponse.ok) throw new Error('Failed to fetch case details');
        const caseData = await caseResponse.json();
        
        // Log the fetched case data
        console.log("Fetched Case Data:", caseData);
  
        // Ensure you are accessing the attributes correctly
        setCaseDetails(caseData.data?.attributes || {});
        
        const clientId = caseData.data?.attributes?.client?.data?.id;
        if (clientId) {
          const clientResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/clients/${clientId}`);
          if (!clientResponse.ok) throw new Error('Failed to fetch client details');
          const clientData = await clientResponse.json();
          console.log("Fetched Client Data:", clientData);
          setClientDetails(clientData.data?.attributes || {});
        } else {
          console.warn("Client ID is missing in case data");
        }
      } catch (error) {
        console.error(error.message);
        setError(error.message);
      }
    };
  
    fetchInvoicesAndCase();
  }, [id]);

console.log(caseDetails);

const generatePDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(12);

  // Add case and client details
  const title = "Invoice Summary";
  const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const pageWidth = doc.internal.pageSize.width;
  const titleX = (pageWidth - titleWidth) / 2; // Calculer la position X pour centrer

  doc.setFontSize(16);
  doc.text(title, titleX, 10); // Afficher le texte centré à la position calculée
  doc.setFontSize(12);
  // Check if caseDetails and clientDetails are available


  if (clientDetails.FirstName) {
    doc.text(`Client: ${clientDetails.FirstName} ${clientDetails.LastName}`, 10, 40);
    doc.text(`Email: ${clientDetails.Email || 'N/A'}`, 10, 50);
    doc.text(`Phone: ${clientDetails.Phone || 'N/A'}`, 10, 60);
  } else {
    doc.text("Client Details: Not available", 10, 40);
  }

  // Add Invoices Table
  doc.text("Invoices:", 10, 70);
  
  const invoiceData = invoices.map(invoice => [
    invoice.attributes.AmountTF,
    invoice.attributes.AmountTTC,
    new Date(invoice.attributes.issued_date).toLocaleDateString(),
    new Date(invoice.attributes.end_date).toLocaleDateString()
  ]);

  // En-tête du tableau (titres des colonnes)
  const head = ['Amount (TF)', 'Amount (TTC)', 'Issued Date', 'End Date'];

  // Ajouter le tableau avec autoTable
  doc.autoTable({
    startY: 80,
    head: [head], // Le tableau des en-têtes
    body: invoiceData, // Le tableau avec toutes les lignes de données
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
  });

  // Save the PDF
  doc.save('invoices_with_case_client.pdf');
};

const printInvoicePDF = (invoice) => {
  const doc = new jsPDF();
  doc.setFontSize(12);

  const title = "Invoice Details";
  const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const pageWidth = doc.internal.pageSize.width;
  const titleX = (pageWidth - titleWidth) / 2; // Calculer la position X pour centrer

  doc.setFontSize(16);
  doc.text(title, titleX, 10); // Afficher le texte centré à la position calculée
  doc.setFontSize(12);


  if (clientDetails.FirstName) {
    doc.text(`Client: ${clientDetails.FirstName} ${clientDetails.LastName}`, 10, 40);
    doc.text(`Email: ${clientDetails.Email || 'N/A'}`, 10, 50);
    doc.text(`Phone: ${clientDetails.Phone || 'N/A'}`, 10, 60);
  } else {
    doc.text("Client Details: Not available", 10, 40);
  }

  // Add Invoice Table
  doc.text("Invoice Details:", 10, 70);

  const invoiceData = [
    ['Amount (TF)', 'Amount (TTC)', 'Issued Date', 'End Date'],
    [
      invoice.attributes.AmountTF,
      invoice.attributes.AmountTTC,
      new Date(invoice.attributes.issued_date).toLocaleDateString(),
      new Date(invoice.attributes.end_date).toLocaleDateString()
    ]
  ];

  // Ajouter le tableau avec autoTable
  doc.autoTable({
    startY: 80,
    head: [invoiceData[0]], // Première ligne (titres)
    body: [invoiceData[1]], // Deuxième ligne (valeurs)
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
  });

  // Sauvegarder le PDF
  doc.save(`invoice_${invoice.id}.pdf`);
};

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    
    const newInvoice = {
      data: {
        AmountTF: amountTF,
        AmountTTC: amountTTC,
        issued_date: issuedDate,
        end_date: endDate,
        case: id,
      },
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInvoice),
      });
      if (!response.ok) throw new Error('Failed to add invoice');
      const data = await response.json();
      setInvoices([...invoices, data.data]);
      resetForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/invoices/${invoiceId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete invoice');
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditInvoice = (invoiceItem) => {
    setEditingInvoiceId(invoiceItem.id);
    setAmountTF(invoiceItem.attributes.AmountTF);
    setAmountTTC(invoiceItem.attributes.AmountTTC);
    setIssuedDate(invoiceItem.attributes.issued_date);
    setEndDate(invoiceItem.attributes.end_date);
  };

  const handleUpdateInvoice = async (e) => {
    e.preventDefault();
    
    const updatedInvoice = {
      data: {
        AmountTF: amountTF,
        AmountTTC: amountTTC,
        issued_date: issuedDate,
        end_date: endDate,
        case: id,
      },
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/invoices/${editingInvoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInvoice),
      });
      if (!response.ok) throw new Error('Failed to update invoice');
      const data = await response.json();
      setInvoices(invoices.map(invoice => (invoice.id === editingInvoiceId ? data.data : invoice)));
      resetForm();
      setEditingInvoiceId(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setAmountTF(0);
    setAmountTTC(0);
    setIssuedDate('');
    setEndDate('');
    setEditingInvoiceId(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 text-white bg-blue-500 rounded-md flex items-center"
        >
          <FaChevronCircleLeft className="mr-2" />
          Back
        </button>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <h1 className="text-2xl font-bold mb-4 text-center">Invoice for The Case</h1>
        
        <form onSubmit={editingInvoiceId ? handleUpdateInvoice : handleAddInvoice} className="mb-6">
          <div className="flex flex-wrap mb-4">
            <div className="flex flex-col w-1/2 pr-2">
              <label className="mb-1">AmountTF</label>
              <input
                type="number"
                value={amountTF}
                onChange={(e) => setAmountTF(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex flex-col w-1/2 pl-2">
              <label className="mb-1">AmountTTC</label>
              <input
                type="number"
                value={amountTTC}
                onChange={(e) => setAmountTTC(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap mb-4">
            <div className="flex flex-col w-1/2 pr-2">
              <label className="mb-1">Issued Date</label>
              <input
                type="date"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex flex-col w-1/2 pl-2">
              <label className="mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            {editingInvoiceId ? 'Update Invoice' : 'Add Invoice'}
          </button>
        </form>

        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">AmountTF</th>
              <th className="border border-gray-300 px-4 py-2">AmountTTC</th>
              <th className="border border-gray-300 px-4 py-2">Issued Date</th>
              <th className="border border-gray-300 px-4 py-2">End Date</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
              <th className="border border-gray-300 px-4 py-2">Print</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td className="border border-gray-300 px-4 py-2">{invoice.attributes.AmountTF}</td>
                <td className="border border-gray-300 px-4 py-2">{invoice.attributes.AmountTTC}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(invoice.attributes.issued_date).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(invoice.attributes.end_date).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button onClick={() => handleEditInvoice(invoice)} className="text-blue-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteInvoice(invoice.id)} className="text-red-500 ml-2">
                    <FaTrash />
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button onClick={() => printInvoicePDF(invoice)} className="text-green-500">
                    <FaFilePdf />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={generatePDF} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md">
          Generate Combined PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;