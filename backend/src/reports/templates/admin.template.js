export const adminTemplate = (data) => `
<html>
<head>
<style>
  body {
    font-family: 'Inter', Arial, sans-serif;
    background: #f6f7fb;
    padding: 30px;
    color: #111827;
  }

  .container {
    max-width: 1000px;
    margin: auto;
  }

  .header {
    background: linear-gradient(135deg, #2563eb, #1e3a8a);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .stat-box {
    background: white;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    text-align: center;
  }

  .stat-value {
    font-size: 16px;
    font-weight: bold;
  }

  .section-title {
    margin: 20px 0 10px;
    font-size: 14px;
    font-weight: 600;
  }

  .card {
    background: white;
    padding: 14px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    margin-bottom: 12px;
  }

  .info {
    font-size: 12px;
    margin: 4px 0;
    color: #374151;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    background: white;
    border-radius: 10px;
    overflow: hidden;
  }

  th {
    background: #f3f4f6;
    padding: 10px;
    text-align: left;
  }

  td {
    padding: 10px;
    border-top: 1px solid #e5e7eb;
  }

  .badge {
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 10px;
    background: #dbeafe;
    color: #1e40af;
  }
</style>
</head>

<body>
<div class="container">

  <div class="header">
    <h1>Admin Revenue Report</h1>
    <div style="font-size:12px;">
      Generated: ${new Date(data.generatedAt).toLocaleString()}
    </div>
  </div>

  <!-- STATS -->
  <div class="stats">

    <div class="stat-box">
      <div class="stat-value">${data.summary.totalAppointments}</div>
      <div>Appointments</div>
    </div>

    <div class="stat-box">
      <div class="stat-value">${data.summary.totalTransactions}</div>
      <div>Transactions</div>
    </div>

    <div class="stat-box">
      <div class="stat-value">${data.summary.totalConsultations}</div>
      <div>Consultations</div>
    </div>

    <div class="stat-box">
      <div class="stat-value">₹${(data.summary.grossVolume / 100).toFixed(0)}</div>
      <div>Gross Revenue</div>
    </div>

  </div>

  <!-- FINANCIAL -->
  <div class="section-title">Financial Overview</div>

  <div class="card">
    <p class="info"><b>Platform Profit:</b> ₹${(data.summary.platformProfit / 100).toFixed(0)}</p>
    <p class="info"><b>Penalty Income:</b> ₹${(data.summary.penalty / 100).toFixed(0)}</p>
    <p class="info"><b>Refunds:</b> ₹${(data.summary.refunds / 100).toFixed(0)}</p>
    <p class="info"><b>Doctor Payouts:</b> ₹${(data.summary.doctorPayouts / 100).toFixed(0)}</p>
    <p class="info"><b>Total Profit:</b> ₹${(data.summary.profit / 100).toFixed(0)}</p>
  </div>

  <!-- INSIGHTS -->
  <div class="section-title">Insights</div>

  <div class="card">
    <p class="info"><b>Refund Rate:</b> ${data.insights.refundRate}%</p>
    <p class="info"><b>Payout Ratio:</b> ${data.insights.payoutRatio}%</p>
    <p class="info"><b>Profit Margin:</b> ${data.insights.profitMargin}%</p>
  </div>

  <!-- TOP DOCTORS -->
  <div class="section-title">Top Doctors</div>

  <div class="card">
    ${data.insights.topDoctors.map(d => `
      <p class="info">
        <b>${d.doctor?.name || "-"}</b> — ${d.appointmentCount} appointments
      </p>
    `).join("")}
  </div>

</div>
</body>
</html>
`;