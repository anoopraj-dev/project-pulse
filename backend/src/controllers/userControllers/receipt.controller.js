// import Payment from "../../models/payments.model.js";
// import { getBrowser } from "../../config/puppeteer.js";

// export const viewReceipt = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const payment = await Payment.findById(id)
//       .populate("patient", "name email")
//       .populate("doctor", "name professionalInfo email")
//       .populate("appointment", "serviceType appointmentDate appointmentTime");

//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     // -------- Appointment Data --------
//     const serviceType =
//       payment.appointment?.serviceType === "online"
//         ? "Online Consultation"
//         : "Offline Consultation";

//     const formattedAppointmentDate = payment.appointment?.appointmentDate
//       ? new Date(payment.appointment.appointmentDate).toLocaleDateString(
//           "en-IN",
//         )
//       : "-";

//     const formattedAppointmentTime =
//       payment.appointment?.appointmentTime || "-";

//     const paymentDate = new Date(payment.updatedAt).toLocaleDateString("en-IN");

//     const logoUrl = `${req.protocol}://${req.get("host")}`;

//     // ----------- HTML Template -------------
//     const html = `
// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8" />
// <style>
//   * { box-sizing: border-box; }

//   body {
//     margin: 0;
//     padding: 0;
//     font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
//     background: #f8fafc;
//     color: #1e293b;
//   }

//   .wrapper {
//     padding: 50px;
//   }

//   .invoice-card {
//     max-width: 820px;
//     margin: auto;
//     background: #ffffff;
//     border-radius: 18px;
//     overflow: hidden;
//     box-shadow: 0 25px 60px rgba(0,0,0,0.08);
//   }

//   /* Top Gradient Bar */
//   .top-bar {
//     height: 8px;
//     background: linear-gradient(90deg, #4f46e5, #7c3aed);
//   }

//   .content {
//     padding: 40px;
//   }

//   /* Header */
//   .header {
//     display: flex;
//     justify-content: space-between;
//     align-items: flex-start;
//     margin-bottom: 40px;
//   }

//   .brand {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//   }

//   .brand img {
//     height: 45px;
//   }

//   .brand-name {
//     font-size: 20px;
//     font-weight: 700;
//     letter-spacing: 1px;
//   }

//   .invoice-meta {
//     text-align: right;
//     font-size: 14px;
//     line-height: 1.8;
//   }

//   .invoice-meta h2 {
//     margin: 0 0 10px 0;
//     font-size: 18px;
//     font-weight: 600;
//   }

//   /* Section Titles */
//   .section-title {
//     font-size: 13px;
//     font-weight: 600;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//     color: #64748b;
//     margin-bottom: 15px;
//   }

//   /* Info Grid */
//   .info-grid {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 30px;
//     margin-bottom: 35px;
//   }

//   .info-card {
//     background: #f9fafb;
//     padding: 18px;
//     border-radius: 12px;
//     font-size: 14px;
//     line-height: 1.8;
//   }

//   /* Table */
//   table {
//     width: 100%;
//     border-collapse: collapse;
//     margin-top: 10px;
//   }

//   thead {
//     background: #f1f5f9;
//   }

//   th {
//     text-align: left;
//     padding: 14px;
//     font-size: 13px;
//     font-weight: 600;
//     color: #475569;
//   }

//   td {
//     padding: 16px 14px;
//     font-size: 14px;
//     border-bottom: 1px solid #f1f5f9;
//   }

//   .amount {
//     text-align: right;
//   }

//   .total-row td {
//     font-weight: 700;
//     font-size: 16px;
//     border-top: 2px solid #e2e8f0;
//   }

//   /* Status Badge */
//   .status {
//     margin-top: 20px;
//   }

//   .status-badge {
//     display: inline-block;
//     padding: 6px 16px;
//     border-radius: 50px;
//     font-size: 12px;
//     font-weight: 600;
//     background: #ecfdf5;
//     color: #059669;
//   }

//   /* Footer */
//   .footer {
//     text-align: center;
//     font-size: 12px;
//     color: #94a3b8;
//     margin-top: 40px;
//     padding-top: 20px;
//     border-top: 1px solid #e2e8f0;
//   }

// </style>
// </head>

// <body>
// <div class="wrapper">
//   <div class="invoice-card">
//     <div class="top-bar"></div>

//     <div class="content">

//       <!-- HEADER -->
//       <div class="header">
//         <div class="brand">
//           <img src="${logoUrl}/logoPrimary.png" />
//           <div class="brand-name">PULSE360</div>
//         </div>

//         <div class="invoice-meta">
//           <h2>Payment Receipt</h2>
//           <div><strong>Receipt #:</strong> ${payment.receipt}</div>
//           <div><strong>Payment Date:</strong> ${paymentDate}</div>
//           <div><strong>Service:</strong> ${serviceType}</div>
//           <div><strong>Appointment:</strong> ${formattedAppointmentDate} | ${formattedAppointmentTime}</div>
//         </div>
//       </div>

//       <!-- BILLING INFO -->
//       <div class="section-title">Billing Information</div>

//       <div class="info-grid">
//         <div class="info-card">
//           <strong>Patient</strong><br/>
//           ${payment.patient?.name}<br/>
//           ${payment.patient?.email}
//         </div>

//         <div class="info-card">
//           <strong>Doctor</strong><br/>
//           ${payment.doctor?.name}<br/>
//           ${payment.doctor?.email}<br/>
//           ${payment.doctor?.professionalInfo?.specializations?.[0] || "-"}
//         </div>
//       </div>

//       <!-- PAYMENT TABLE -->
//       <div class="section-title">Payment Summary</div>

//       <table>
//         <thead>
//           <tr>
//             <th>Description</th>
//             <th class="amount">Amount (₹)</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>${serviceType}</td>
//             <td class="amount">
//               ${(payment.amount / 100).toLocaleString("en-IN", {
//                 minimumFractionDigits: 2,
//               })}
//             </td>
//           </tr>

//           <tr class="total-row">
//             <td>Total</td>
//             <td class="amount">
//               ${(payment.amount / 100).toLocaleString("en-IN", {
//                 minimumFractionDigits: 2,
//               })}
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       <div class="status">
//         <span class="status-badge">
//           ${payment.status?.toUpperCase()}
//         </span>
//       </div>

//       <div class="footer">
//         This is a system-generated receipt.<br/>
//         © ${new Date().getFullYear()} Pulse360 
//       </div>

//     </div>
//   </div>
// </div>
// </body>
// </html>
// `;

//     const browser = getBrowser();
//     const page = await browser.newPage();

//     await page.setContent(html, { waitUntil: "load" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//     });

//     await page.close();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "inline");

//     res.send(pdfBuffer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to generate receipt" });
//   }
// };


import { viewReceiptService } from "../../services/user/receipt.service.js";

//--------------------- VIEW RECEIPT CONTROLLER ---------------------
export const viewReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const hostUrl = `${req.protocol}://${req.get("host")}`;

    const pdfBuffer = await viewReceiptService(id, hostUrl);

    //--------------------- SEND PDF ---------------------
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to generate receipt",
    });
  }
};