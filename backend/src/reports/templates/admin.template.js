export const revenueTemplate = (data) => `
<html>
<body>
  <h1>Revenue Report</h1>
  <p>Total Revenue: ₹${data.totalRevenue / 100}</p>
</body>
</html>
`;