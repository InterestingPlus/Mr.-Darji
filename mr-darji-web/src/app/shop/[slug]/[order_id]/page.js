export default async function BillPage({ params }) {
  const { order_id } = await params;

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Bill ID: {order_id}</h1>

      <p className="mt-2 text-gray-600">Public bill view & download</p>
    </main>
  );
}
