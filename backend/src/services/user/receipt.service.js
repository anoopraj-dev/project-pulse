import Payment from "../../models/payments.model.js";
import Settlement from "../../models/settlement.model.js";
import { getBrowser } from "../../config/puppeteer.js";

//---------------- MAIN SERVICE ----------------
export const viewReceiptService = async (id, hostUrl, role) => {
  const browser = getBrowser();
  const page = await browser.newPage();

  let html;

  if (role === "doctor") {
    const settlement = await Settlement.findOne({ payment: id })
      .populate("payment")
      .populate("patient")
      .populate("appointment");

    if (!settlement) throw { status: 404, message: "Settlement not found" };

    html = buildDoctorReceiptHTML(settlement, hostUrl);
  } else {
    const payment = await Payment.findById(id)
      .populate("patient", "name email")
      .populate("doctor", "name email professionalInfo")
      .populate("appointment", "serviceType appointmentDate appointmentTime");

    if (!payment) throw { status: 404, message: "Payment not found" };

    html = buildPatientReceiptHTML(payment, hostUrl);
  }

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await page.close();

  return pdfBuffer;
};

//  PULSE360 — PATIENT RECEIPT (TAX INVOICE)
const buildPatientReceiptHTML = (payment, hostUrl) => {
  const serviceType =
    payment.appointment?.serviceType === "online"
      ? "Online (video)"
      : "In-clinic";

  const serviceLabel =
    payment.appointment?.serviceType === "online"
      ? "Online consultation"
      : "Offline consultation";

  const issueDate = new Date(payment.updatedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const issueDateTime = new Date(payment.updatedAt).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const amount = (payment.amount / 100).toFixed(2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Tax Invoice – ${payment.receipt}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;background:#e8e8e8;min-height:100vh;padding:36px 16px;}
    .page{max-width:620px;margin:0 auto;background:#fff;border:1px solid #ccc;box-shadow:2px 0 0 #ccc,-2px 0 0 #ccc,0 4px 12px rgba(0,0,0,0.18);}
    .bill-header{background:#185fa5;padding:22px 28px 18px;display:flex;justify-content:space-between;align-items:flex-start;}
    .brand-name{font-size:22px;font-weight:700;color:#fff;letter-spacing:1px;}
    .brand-tagline{font-size:10px;color:rgba(255,255,255,0.6);margin-top:3px;letter-spacing:0.4px;}
    .bill-type-label{font-size:18px;font-weight:700;color:#fff;text-align:right;letter-spacing:0.5px;}
    .bill-type-num{font-size:10px;color:rgba(255,255,255,0.65);text-align:right;margin-top:4px;}
    .meta-row{background:#0c447c;padding:10px 28px;display:flex;gap:28px;}
    .meta-item{font-size:10px;color:rgba(255,255,255,0.6);}
    .meta-item span{display:block;color:#fff;font-size:11px;font-weight:500;margin-top:2px;}
    .bill-body{padding:22px 28px;}
    .parties{display:grid;grid-template-columns:1fr 1fr;border:1px solid #ddd;margin-bottom:0;}
    .party{padding:14px 16px;}
    .party:first-child{border-right:1px solid #ddd;}
    .party-label{font-size:9px;text-transform:uppercase;letter-spacing:0.8px;color:#888;margin-bottom:6px;font-weight:600;}
    .party-name{font-size:13px;font-weight:600;color:#1a1a1a;}
    .party-detail{font-size:11px;color:#555;margin-top:4px;line-height:1.6;}
    .appt-strip{background:#f5f5f5;border:1px solid #ddd;border-top:none;display:flex;margin-bottom:20px;}
    .appt-col{flex:1;padding:10px 16px;border-right:1px solid #ddd;font-size:11px;color:#444;}
    .appt-col:last-child{border-right:none;}
    .appt-col strong{display:block;font-size:9px;text-transform:uppercase;letter-spacing:0.7px;color:#888;margin-bottom:3px;font-weight:600;}
    table.line-table{width:100%;border-collapse:collapse;font-size:12px;}
    table.line-table thead tr{background:#185fa5;}
    table.line-table thead th{padding:9px 12px;color:#fff;font-size:9px;text-transform:uppercase;letter-spacing:0.7px;font-weight:600;text-align:left;}
    table.line-table thead th:last-child{text-align:right;}
    table.line-table tbody tr{border-bottom:1px solid #eee;}
    table.line-table tbody tr:nth-child(even){background:#fafafa;}
    table.line-table tbody td{padding:10px 12px;color:#333;vertical-align:top;}
    table.line-table tbody td:last-child{text-align:right;font-weight:500;}
    .subtotals{border:1px solid #ddd;border-top:none;}
    .subtotal-row{display:flex;justify-content:space-between;padding:8px 12px;border-bottom:1px solid #eee;font-size:12px;color:#555;}
    .subtotal-row.deduct{color:#a32d2d;}
    .subtotal-row.grand{background:#185fa5;color:#fff;font-size:14px;font-weight:700;padding:13px 12px;}
    .bill-footer{margin-top:20px;padding-top:16px;border-top:2px dashed #ddd;display:flex;justify-content:space-between;align-items:flex-end;}
    .footer-note{font-size:10px;color:#888;line-height:1.7;}
    .stamp{border:2.5px solid #3b6d11;border-radius:4px;padding:7px 16px;text-align:center;}
    .stamp-text{font-size:16px;font-weight:700;color:#3b6d11;letter-spacing:3px;}
    .stamp-sub{font-size:9px;color:#3b6d11;margin-top:2px;}
  </style>
</head>
<body>
<div class="page">
  <div class="bill-header">
    <div>
      <div class="brand-name">PULSE360</div>
      <div class="brand-tagline">Healthcare Platform &nbsp;·&nbsp; PULSE360 Health Pvt. Ltd.</div>
    </div>
    <div>
      <div class="bill-type-label">TAX INVOICE</div>
      <div class="bill-type-num">No. ${payment.receipt}</div>
    </div>
  </div>
  <div class="meta-row">
    <div class="meta-item">Date of issue<span>${issueDate}</span></div>
    <div class="meta-item">Payment time<span>${issueDateTime}</span></div>
    <div class="meta-item">Mode<span>${serviceLabel}</span></div>
    <div class="meta-item">Status<span>Paid</span></div>
  </div>

  <div class="bill-body">
    <div class="parties">
      <div class="party">
        <div class="party-label">Billed to (patient)</div>
        <div class="party-name">${payment.patient?.name}</div>
        <div class="party-detail">${payment.patient?.email}</div>
      </div>
      <div class="party">
        <div class="party-label">Consulting doctor</div>
        <div class="party-name">${payment.doctor?.name}</div>
        <div class="party-detail">
          ${payment.doctor?.professionalInfo?.specializations?.[0] || "—"}<br>
          ${payment.doctor?.email}
        </div>
      </div>
    </div>

    <div class="appt-strip">
      <div class="appt-col"><strong>Appt. date</strong>${payment.appointment?.appointmentDate}</div>
      <div class="appt-col"><strong>Appt. time</strong>${payment.appointment?.appointmentTime}</div>
      <div class="appt-col"><strong>Type</strong>${serviceType}</div>
    </div>

    <table class="line-table">
      <thead>
        <tr>
          <th style="width:36px">#</th>
          <th>Description</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>01</td>
          <td>
            <div style="font-weight:600;color:#1a1a1a;">Consultation fee</div>
            <div style="font-size:10px;color:#888;margin-top:2px;">${serviceLabel} &nbsp;·&nbsp; ${payment.doctor?.professionalInfo?.specializations?.[0] || "General"}</div>
          </td>
          <td>1</td>
          <td>₹ ${amount}</td>
          <td>₹ ${amount}</td>
        </tr>
      </tbody>
    </table>

    <div class="subtotals">
      <div class="subtotal-row"><span>Subtotal</span><span>₹ ${amount}</span></div>
      <div class="subtotal-row"><span>Tax (0% — healthcare exempt)</span><span>₹ 0.00</span></div>
      <div class="subtotal-row grand"><span>Total paid</span><span>₹ ${amount}</span></div>
    </div>

    <div class="bill-footer">
      <div class="footer-note">
        Thank you for choosing PULSE360.<br>
        For queries: support@pulse360.in<br>
        GSTIN: 29XXXXX0000X1Z5
      </div>
      <div class="stamp">
        <div class="stamp-text">PAID</div>
        <div class="stamp-sub">${issueDate}</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
};

//  PULSE360 — DOCTOR PAYOUT STATEMENT
const buildDoctorReceiptHTML = (settlement, hostUrl) => {
  const payment = settlement.payment;
  const patient = settlement.patient;
  const appointment = settlement.appointment;

  const grossAmount = (payment.amount / 100).toFixed(2);
  const platformFee = (settlement.platformFee / 100).toFixed(2);
  const refund = settlement.patientRefund / 100;
  const doctorPayout = (settlement.doctorPayout / 100).toFixed(2);

  const serviceLabel =
    payment.appointment?.serviceType === "online"
      ? "Online (video)"
      : "In-clinic";

  const settleDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const settleDateTime = new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Payout Statement – ${settlement._id}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;background:#e8e8e8;min-height:100vh;padding:36px 16px;}
    .page{max-width:620px;margin:0 auto;background:#fff;border:1px solid #ccc;box-shadow:2px 0 0 #ccc,-2px 0 0 #ccc,0 4px 12px rgba(0,0,0,0.18);}
    .bill-header{background:#185fa5;padding:22px 28px 18px;display:flex;justify-content:space-between;align-items:flex-start;}
    .brand-name{font-size:22px;font-weight:700;color:#fff;letter-spacing:1px;}
    .brand-tagline{font-size:10px;color:rgba(255,255,255,0.6);margin-top:3px;letter-spacing:0.4px;}
    .bill-type-label{font-size:16px;font-weight:700;color:#fff;text-align:right;letter-spacing:0.5px;}
    .bill-type-num{font-size:10px;color:rgba(255,255,255,0.65);text-align:right;margin-top:4px;}
    .meta-row{background:#0c447c;padding:10px 28px;display:flex;gap:28px;}
    .meta-item{font-size:10px;color:rgba(255,255,255,0.6);}
    .meta-item span{display:block;color:#fff;font-size:11px;font-weight:500;margin-top:2px;}
    .bill-body{padding:22px 28px;}
    .parties{display:grid;grid-template-columns:1fr 1fr;border:1px solid #ddd;margin-bottom:0;}
    .party{padding:14px 16px;}
    .party:first-child{border-right:1px solid #ddd;}
    .party-label{font-size:9px;text-transform:uppercase;letter-spacing:0.8px;color:#888;margin-bottom:6px;font-weight:600;}
    .party-name{font-size:13px;font-weight:600;color:#1a1a1a;}
    .party-detail{font-size:11px;color:#555;margin-top:4px;line-height:1.6;}
    .appt-strip{background:#f5f5f5;border:1px solid #ddd;border-top:none;display:flex;margin-bottom:20px;}
    .appt-col{flex:1;padding:10px 16px;border-right:1px solid #ddd;font-size:11px;color:#444;}
    .appt-col:last-child{border-right:none;}
    .appt-col strong{display:block;font-size:9px;text-transform:uppercase;letter-spacing:0.7px;color:#888;margin-bottom:3px;font-weight:600;}
    table.line-table{width:100%;border-collapse:collapse;font-size:12px;}
    table.line-table thead tr{background:#185fa5;}
    table.line-table thead th{padding:9px 12px;color:#fff;font-size:9px;text-transform:uppercase;letter-spacing:0.7px;font-weight:600;text-align:left;}
    table.line-table thead th:last-child{text-align:right;}
    table.line-table tbody tr{border-bottom:1px solid #eee;}
    table.line-table tbody tr:nth-child(even){background:#fafafa;}
    table.line-table tbody td{padding:10px 12px;color:#333;vertical-align:top;}
    table.line-table tbody td:last-child{text-align:right;font-weight:500;}
    .subtotals{border:1px solid #ddd;border-top:none;}
    .subtotal-row{display:flex;justify-content:space-between;padding:8px 12px;border-bottom:1px solid #eee;font-size:12px;color:#555;}
    .subtotal-row.deduct{color:#a32d2d;}
    .subtotal-row.grand{background:#185fa5;color:#fff;font-size:14px;font-weight:700;padding:13px 12px;}
    .bill-footer{margin-top:20px;padding-top:16px;border-top:2px dashed #ddd;display:flex;justify-content:space-between;align-items:flex-end;}
    .footer-note{font-size:10px;color:#888;line-height:1.7;}
    .stamp{border:2.5px solid #185fa5;border-radius:4px;padding:7px 16px;text-align:center;}
    .stamp-text{font-size:14px;font-weight:700;color:#185fa5;letter-spacing:2px;}
    .stamp-sub{font-size:9px;color:#185fa5;margin-top:2px;}
  </style>
</head>
<body>
<div class="page">
  <div class="bill-header">
    <div>
      <div class="brand-name">PULSE360</div>
      <div class="brand-tagline">Healthcare Platform &nbsp;·&nbsp; PULSE360 Health Pvt. Ltd.</div>
    </div>
    <div>
      <div class="bill-type-label">PAYOUT STATEMENT</div>
      <div class="bill-type-num">No. ${settlement._id}</div>
    </div>
  </div>
  <div class="meta-row">
    <div class="meta-item">Settlement date<span>${settleDate}</span></div>
    <div class="meta-item">Processed at<span>${settleDateTime}</span></div>
    <div class="meta-item">Mode<span>${serviceLabel}</span></div>
    <div class="meta-item">Status<span>Settled</span></div>
  </div>

  <div class="bill-body">
    <div class="parties">
      <div class="party">
        <div class="party-label">Doctor (payee)</div>
        <div class="party-name">${settlement.doctor?.name || "Dr. —"}</div>
        <div class="party-detail">${settlement.doctor?.email || "—"}</div>
      </div>
      <div class="party">
        <div class="party-label">Patient</div>
        <div class="party-name">${patient?.name}</div>
        <div class="party-detail">${patient?.email}</div>
      </div>
    </div>

    <div class="appt-strip">
      <div class="appt-col"><strong>Appt. date</strong>${appointment?.appointmentDate}</div>
      <div class="appt-col"><strong>Appt. time</strong>${appointment?.appointmentTime}</div>
      <div class="appt-col"><strong>Type</strong>${serviceLabel}</div>
    </div>

    <table class="line-table">
      <thead>
        <tr>
          <th style="width:36px">#</th>
          <th>Description</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>01</td>
          <td>
            <div style="font-weight:600;color:#1a1a1a;">Consultation fee (gross)</div>
            <div style="font-size:10px;color:#888;margin-top:2px;">${serviceLabel} consultation</div>
          </td>
          <td>1</td>
          <td>₹ ${grossAmount}</td>
          <td>₹ ${grossAmount}</td>
        </tr>
        <tr>
          <td>02</td>
          <td>
            <div style="font-weight:600;color:#a32d2d;">Platform service fee</div>
            <div style="font-size:10px;color:#888;margin-top:2px;">PULSE360 platform usage charge</div>
          </td>
          <td>1</td>
          <td style="color:#a32d2d;">− ₹ ${platformFee}</td>
          <td style="color:#a32d2d;">− ₹ ${platformFee}</td>
        </tr>
        ${
          refund > 0
            ? `
        <tr>
          <td>03</td>
          <td>
            <div style="font-weight:600;color:#a32d2d;">Refund impact</div>
            <div style="font-size:10px;color:#888;margin-top:2px;">Patient refund adjustment</div>
          </td>
          <td>1</td>
          <td style="color:#a32d2d;">− ₹ ${refund.toFixed(2)}</td>
          <td style="color:#a32d2d;">− ₹ ${refund.toFixed(2)}</td>
        </tr>`
            : ""
        }
      </tbody>
    </table>

    <div class="subtotals">
      <div class="subtotal-row"><span>Gross consultation fee</span><span>₹ ${grossAmount}</span></div>
      <div class="subtotal-row deduct"><span>Platform fee deduction</span><span>− ₹ ${platformFee}</span></div>
      ${refund > 0 ? `<div class="subtotal-row deduct"><span>Refund impact</span><span>− ₹ ${refund.toFixed(2)}</span></div>` : ""}
      <div class="subtotal-row grand"><span>Net doctor payout</span><span>₹ ${doctorPayout}</span></div>
    </div>

    <div class="bill-footer">
      <div class="footer-note">
        Payout processed via bank transfer.<br>
        For queries: doctors@pulse360.in<br>
        Settlement ref: ${settlement._id}
      </div>
      <div class="stamp">
        <div class="stamp-text">SETTLED</div>
        <div class="stamp-sub">${settleDate}</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
};
