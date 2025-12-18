import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">Tailor Business Management App</h1>

      <p className="mt-4 text-gray-600">
        Manage orders, customers, bills and more.
      </p>

      <Link href="/shops" className="text-blue-600">
        View all Registered shops
      </Link>
    </main>
  );
}
