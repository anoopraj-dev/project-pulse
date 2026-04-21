export const patientTemplate = (data) => `
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
    max-width: 900px;
    margin: auto;
  }

  /* HEADER */
  .header {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  .header h1 {
    margin: 0;
    font-size: 22px;
  }

  /* GRID */
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .card {
    background: white;
    padding: 14px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
  }

  .card h3 {
    margin-top: 0;
    font-size: 14px;
    color: #2563eb;
  }

  .info {
    font-size: 12px;
    margin: 4px 0;
    color: #374151;
  }

  /* STATS */
  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .stat-box {
    background: white;
    border: 1px solid #e5e7eb;
    padding: 12px;
    border-radius: 10px;
    text-align: center;
  }

  .stat-value {
    font-size: 16px;
    font-weight: bold;
    color: #111827;
  }

  /* SECTION TITLE */
  .section-title {
    margin: 20px 0 10px;
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }

  /* TABLE */
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

  /* BADGE */
  .badge {
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 10px;
    background: #dbeafe;
    color: #1e40af;
  }

  .danger {
    background: #fee2e2;
    color: #b91c1c;
  }
</style>
</head>

<body>
<div class="container">

  <!-- HEADER -->
  <div class="header">
    <h1>Patient Health Report</h1>
    <div style="font-size:12px; margin-top:4px;">
      Generated: ${new Date().toLocaleString()}
    </div>
  </div>

  <!-- PROFILE GRID -->
  <div class="grid">

    <div class="card">
      <h3>Personal Info</h3>
      <p class="info"><b>Name:</b> ${data.profile.name}</p>
      <p class="info"><b>Email:</b> ${data.profile.email}</p>
      <p class="info"><b>Phone:</b> ${data.profile.phone || "-"}</p>
      <p class="info"><b>Gender:</b> ${data.profile.gender || "-"}</p>
    </div>

    <div class="card">
      <h3>Health Overview</h3>
      <p class="info"><b>Blood Group:</b> ${data.medical_history?.bloodGroup || "-"}</p>
      <p class="info"><b>BP:</b> ${data.medical_history?.bloodPressure || "-"}</p>
      <p class="info"><b>Sugar:</b> ${data.medical_history?.sugarLevel || "-"}</p>
      <p class="info"><b>Cholesterol:</b> ${data.medical_history?.cholesterol || "-"}</p>
    </div>

  </div>

  <!-- STATS -->
  <div class="section-title">Overview</div>

  <div class="stats">
    <div class="stat-box">
      <div class="stat-value">${data.stats.totalAppointments}</div>
      <div>Appointments</div>
    </div>

    <div class="stat-box">
      <div class="stat-value">${data.stats.totalDoctors}</div>
      <div>Doctors</div>
    </div>

    <div class="stat-box">
      <div class="stat-value">${data.stats.totalConsultations}</div>
      <div>Consultations</div>
    </div>

    <div class="stat-box">
      <div class="stat-value">${data.stats.totalPrescriptions}</div>
      <div>Prescriptions</div>
    </div>
  </div>

  <!-- EXPENSES -->
  <div class="section-title">Expenses</div>

  <div class="card">
    <p class="info">
      <b>Total Spent:</b> ₹${(data.expenses.total / 100).toFixed(2)}
    </p>
    <p class="info">
      <b>Transactions:</b> ${data.expenses.count}
    </p>
  </div>

  <!-- APPOINTMENTS -->
  <div class="section-title">Appointments</div>

  <table>
    <tr>
      <th>Date</th>
      <th>Doctor</th>
      <th>Status</th>
    </tr>

    ${data.appointments.map(a => `
      <tr>
        <td>${new Date(a.appointmentDate).toDateString()}</td>
        <td>${a.doctor?.name || "-"}</td>
        <td><span class="badge">${a.status}</span></td>
      </tr>
    `).join("")}
  </table>

  <!-- PAYMENTS -->
  <div class="section-title">Payments</div>

  <table>
    <tr>
      <th>Date</th>
      <th>Doctor</th>
      <th>Amount</th>
    </tr>

    ${data.payments.map(p => `
      <tr>
        <td>${new Date(p.createdAt).toDateString()}</td>
        <td>${p.doctor?.name || "-"}</td>
        <td>₹${(p.amount / 100).toFixed(2)}</td>
      </tr>
    `).join("")}
  </table>

</div>
</body>
</html>
`;