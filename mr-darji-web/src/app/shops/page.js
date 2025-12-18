import Link from "next/link";

export default function ShopsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">All Shops</h1>

      <ul className="mt-4 space-y-2">
        <li>
          <Link href="/shop/ramesh-tailors" className="text-blue-600">
            Ramesh Tailors
          </Link>
        </li>
      </ul>
    </main>
  );
}
