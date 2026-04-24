export const doctorTemplate = (data) => `
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

  .header {
    background: linear-gradient(135deg, #059669, #047857);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  .header h1 {
    margin: 0;
    font-size: 22px;
  }

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
    color: #059669;
  }

  .info {
    font-size: 12px;
    margin: 4px 0;
    color: #374151;
  }

  .section-title {
    margin: 20px 0 10px;
    font-size: 14px;
    font-weight: 600;
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
    background: #d1fae5;
    color: #065f46;
  }
</style>
</head>

<body>
<div class="container">

  <!-- HEADER -->
  <div class="header">
    <h1>Doctor Performance Report</h1>
    <div style="font-size:12px; margin-top:4px;">
      Generated: ${new Date().toLocaleString()}
    </div>
  </div>

  <!-- PROFILE -->
  <div class="grid">

    <div class="card">
      <h3>Doctor Info</h3>
      <p class="info"><b>Name:</b> ${data.profile.name}</p>
      <p class="info"><b>Email:</b> ${data.profile.email}</p>
      <p class="info"><b>Phone:</b> ${data.profile.phone || "-"}</p>
      <p class="info"><b>Location:</b> ${data.profile.location || "-"}</p>
      <p class="info"><b>Gender:</b> ${data.profile.gender || "-"}</p>
    </div>

    <div class="card">
      <h3>Professional</h3>
      <p class="info"><b>Specializations:</b> ${data.professional_info?.specializations?.join(", ") || "-"}</p>
      <p class="info"><b>Qualifications:</b> ${data.professional_info?.qualifications?.join(", ") || "-"}</p>
      <p class="info"><b>Experience:</b> ${data.professional_info?.experience?.[0]?.years || 0} yrs</p>
      <p class="info"><b>License:</b> ${data.professional_info?.medicalLicense?.registrationNumber}</p>
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
      <div class="stat-value">${data.stats.totalPatients}</div>
      <div>Patients</div>
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

  <!-- EARNINGS -->
  <div class="section-title">Earnings</div>
  <div class="card">
    <p class="info"><b>Total Revenue:</b> ₹${data.earnings.total / 100}</p>
    <p class="info"><b>Transactions:</b> ${data.earnings.count}</p>
  </div>

  <!-- SERVICES -->
  <div class="section-title">Services</div>
  <div class="card">
    ${
      data.services.map(s => `
        <p class="info">
          <b>${s.serviceType}</b> — ₹${s.fees}
        </p>
      `).join("") || "<p class='info'>No services</p>"
    }
  </div>

  <!-- APPOINTMENTS -->
  <div class="section-title">Appointments</div>
  <table>
    <tr>
      <th>Date</th>
      <th>Patient</th>
      <th>Status</th>
    </tr>

    ${data.appointments.map(a => `
      <tr>
        <td>${new Date(a.appointmentDate).toDateString()}</td>
        <td>${a.patient?.name || "-"}</td>
        <td><span class="badge">${a.status}</span></td>
      </tr>
    `).join("")}
  </table>

  <!-- PAYMENTS -->
  <div class="section-title">Payments</div>
  <table>
    <tr>
      <th>Date</th>
      <th>Patient</th>
      <th>Amount</th>
    </tr>

    ${data.payments.map(p => `
      <tr>
        <td>${new Date(p.createdAt).toDateString()}</td>
        <td>${p.patient?.name || "-"}</td>
        <td>₹${p.amount / 100}</td>
      </tr>
    `).join("")}
  </table>

</div>
</body>
</html>
`;