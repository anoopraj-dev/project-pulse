import { Worker } from "bullmq";
import { bullRedis } from "../config/redis.js";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

import { connectDB } from "../db/db.js";
import Export from "../models/export.model.js";
import { REPORTS } from "../reports/index.js";

await connectDB();

const worker = new Worker(
  "export-queue",
  async (job) => {
    try {
      const { exportId, reportType, entityId, filters } = job.data;

      // ---------------- FETCH EXPORT JOB ----------------
      const exportJob = await Export.findById(exportId);
      if (!exportJob) {
        throw new Error("Export job not found");
      }

      exportJob.status = "processing";
      await exportJob.save();

      // ---------------- VALIDATE REPORT ----------------
      const report = REPORTS[reportType];
      if (!report) {
        throw new Error("Invalid report type");
      }

      // ---------------- BUILD DATA ----------------
      const data = await report.builder(entityId, filters);

      // ---------------- GENERATE HTML ----------------
      const html = report.template(data);

      // ---------------- CREATE EXPORT DIRECTORY ----------------
      const exportDir = path.join(process.cwd(), "exports");
      fs.mkdirSync(exportDir, { recursive: true });

      const pdfPath = path.join(exportDir, `${exportId}.pdf`);

      // ---------------- GENERATE PDF ----------------
      const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
      });

      await browser.close();

      // ---------------- UPDATE EXPORT STATUS ----------------
      exportJob.status = "completed";
      exportJob.fileUrl = `/exports/${exportId}.pdf`;
      await exportJob.save();

      return { success: true };
    } catch (err) {
      throw err;
    }
  },
  {
    connection: bullRedis,
    concurrency: 3,
  }
);

// ---------------- FAILED JOB HANDLER ----------------
worker.on("failed", async (job, err) => {
  if (!job) return;

  const exportJob = await Export.findById(job.data.exportId);

  if (exportJob) {
    exportJob.status = "failed";
    exportJob.error = err.message;
    await exportJob.save();
  }
});