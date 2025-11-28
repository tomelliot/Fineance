import { getCategorySummaries } from "@/services/finance-data";

export default async function TransactionsByCategoryPage() {
  const oneMonth = getCategorySummaries(1);
  const threeMonths = getCategorySummaries(3);
  const twelveMonths = getCategorySummaries(12);

  return (
    <div className="p-8 space-y-12">
      <h1 className="text-4xl font-bold">Transactions by Category</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Last 1 Month</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {oneMonth.map((summary) => (
              <tr key={summary.categoryId}>
                <td>{summary.categoryName}</td>
                <td>{summary.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Last 3 Months</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {threeMonths.map((summary) => (
              <tr key={summary.categoryId}>
                <td>{summary.categoryName}</td>
                <td>{summary.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Last 12 Months</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {twelveMonths.map((summary) => (
              <tr key={summary.categoryId}>
                <td>{summary.categoryName}</td>
                <td>{summary.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
