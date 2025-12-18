import BASE_URL from "@/config";
import axios from "axios";

export default async function ShopProfilePage({ params }) {
  const { slug } = await params;

  let shop = null;

  try {
    const response = await axios.get(`${BASE_URL}/api/profile/${slug}`);
    shop = response.data;
  } catch (error) {
    console.error("Error fetching shop data:", error);
  }

  if (!shop) {
    return <div className="p-6 text-center">Shop not found.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <header className="border-b pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
            <p className="text-lg text-blue-600 font-medium">{shop.shopType}</p>
            <p className="italic text-gray-500">{shop.tagline}</p>
          </div>
          <div className="text-right">
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Member since {new Date(shop.memberSince).getFullYear()}
            </span>
          </div>
        </div>
      </header>

      {/* Details Grid */}
      <section className="grid md:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">About</h2>
          <p className="text-gray-700">
            {shop.about.description || "No description provided."}
          </p>

          <div className="mt-4">
            <h3 className="font-medium text-gray-900">Specialities:</h3>
            <ul className="list-disc list-inside text-gray-600">
              {shop.about.specialities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>📍 Address:</strong> {shop.address}
            </p>
            <p>
              <strong>📞 Phone:</strong> {shop.contact.phone}
            </p>
            {shop.contact.whatsappNumber && (
              <p>
                <strong>💬 WhatsApp:</strong> {shop.contact.whatsappNumber}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
