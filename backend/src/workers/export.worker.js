import { Worker } from "bullmq";
import { bullRedis } from "../config/redis.js";
import fs from "fs";
import path from "path";
import { connectDB } from "../db/db.js";
import puppeteer from "puppeteer";
import { buildPatientExport } from "../services/patient/export.service.js";

import Export from "../models/export.model.js";
import Appointment from "../models/appointments.model.js";
import Consultation from "../models/consultation.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Payment from '../models/payments.model.js'

await connectDB();

const worker = new Worker(
  "export-queue",
  async (job) => {
    const { exportId, patientId } = job.data;

    const exportJob = await Export.findById(exportId);
    if (!exportJob) throw new Error("Export job not found");

    exportJob.status = "processing";
    await exportJob.save();

    const data = await buildPatientExport(patientId);

    // ------- Create exports folder ------
    const exportDir = path.join(process.cwd(), "exports");
    fs.mkdirSync(exportDir, { recursive: true });

    // ---------------- HTML TEMPLATE ----------------
    const html = `
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

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 12px;
    background: white;
    border-radius: 10px;
    overflow: hidden;
  }

  th {
    background: #f3f4f6;
    text-align: left;
    padding: 10px;
    font-weight: 600;
  }

  td {
    padding: 10px;
    border-top: 1px solid #e5e7eb;
  }

  .section-title {
    margin: 20px 0 10px;
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }

  .badge {
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 10px;
    background: #e0f2fe;
    color: #0369a1;
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
      <p class="info"><b>Phone:</b> ${data.profile.phone}</p>
      <p class="info"><b>Gender:</b> ${data.profile.gender || "-"}</p>
      <p class="info"><b>Blood Group:</b> ${data.medical_history.bloodGroup}</p>
    </div>

    <div class="card">
      <h3>Lifestyle</h3>
      <p class="info"><b>Smoking:</b> ${data.lifestyle_habits.smoking}</p>
      <p class="info"><b>Alcohol:</b> ${data.lifestyle_habits.alcohol}</p>
      <p class="info"><b>Exercise:</b> ${data.lifestyle_habits.exerciseFrequency}</p>
      <p class="info"><b>Sleep:</b> ${data.lifestyle_habits.sleepHours} hrs</p>
      <p class="info"><b>Stress:</b> ${data.lifestyle_habits.stressLevel}</p>
    </div>

  </div>

  <!-- MEDICAL HISTORY -->
  <div class="section-title">Medical History</div>
  <div class="card">
    <p class="info"><b>Blood Pressure:</b> ${data.medical_history.bloodPressure}</p>
    <p class="info"><b>Cholesterol:</b> ${data.medical_history.cholesterol}</p>
    <p class="info"><b>Sugar Level:</b> ${data.medical_history.sugarLevel}</p>
    <p class="info"><b>Allergies:</b> ${data.medical_history.allergies?.join(", ")}</p>
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
        <td>${a.doctor?.name}</td>
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
      <th>Status</th>
    </tr>

    ${data.payments.map(p => `
      <tr>
        <td>${new Date(p.createdAt).toDateString()}</td>
        <td>${p.doctor || "-"}</td>
        <td>₹${p.amount / 100}</td>
        <td>
          <span class="badge ${p.status === 'failed' ? 'danger' : ''}">
            ${p.status}
          </span>
        </td>
      </tr>
    `).join("")}
  </table>

</div>
</body>
</html>
`;

    // ---------------- PUPPETEER ----------------
    const browser = await puppeteer.launch({
      headless: "new",
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfPath = path.join(exportDir, `${exportId}.pdf`);

    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // ---------------- DB UPDATE ----------------
    exportJob.status = "completed";
    exportJob.fileUrl = `/exports/${exportId}.pdf`;
    await exportJob.save();

    return { success: true };
  },
  {
    connection: bullRedis,
    concurrency: 3,
  }
);

// -------- ERROR HANDLING --------
worker.on("failed", async (job, err) => {
  console.log("Worker error", err);

  if (!job) return;

  const exportJob = await Export.findById(job.data.exportId);
  if (exportJob) {
    exportJob.status = "failed";
    exportJob.error = err.message;
    await exportJob.save();
  }
});

console.log("Export worker running...");