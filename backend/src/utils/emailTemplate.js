export const emailTemplate = ({
  title,
  subtitle,
  body,
  highlightText,
  highlightType = "info", // success | error | warning | info
}) => {
  const highlightColors = {
    success: "#22c55e",
    error: "#ef4444",
    warning: "#facc15",
    info: "#38bdf8",
  };

  const highlightBg = {
    success: "#052e16",
    error: "#450a0a",
    warning: "#422006",
    info: "#082f49",
  };

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${title}</title>
  </head>

  <body style="margin:0; padding:0; background-color:#0f172a; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">

          <table width="100%" style="max-width:600px; background:#111827; border-radius:14px; padding:28px; color:#e5e7eb;">

            <!-- Header -->
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <h1 style="color:#38bdf8; margin:0;">PULSE360</h1>
                <p style="color:#9ca3af; margin-top:6px;">${subtitle}</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="font-size:15px; line-height:1.7;">
                ${body}
              </td>
            </tr>

            ${
              highlightText
                ? `
              <tr>
                <td style="
                  background:${highlightBg[highlightType]};
                  border-left:4px solid ${highlightColors[highlightType]};
                  padding:16px;
                  border-radius:8px;
                  margin-top:20px;
                  color:${highlightColors[highlightType]};
                ">
                  <strong>${highlightText}</strong>
                </td>
              </tr>`
                : ""
            }

            <!-- Footer -->
            <tr>
              <td align="center" style="padding-top:32px;">
                <p style="font-size:13px; color:#6b7280;">
                  © ${new Date().getFullYear()} PULSE360 · All rights reserved
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
