import CategoryClient from "./CategoryClient";
import { API_BASE_URL } from "@/config";

const categoryNamesMap = {
  1: "قسم الالعاب",
  2: "تطبيقات اللايف",
  3: "بطاقات الكترونية",
  4: "الأرصدة والعملات",
  5: "سوشال ميديا",
  6: "خدمات السيرفر",
  7: "اشتراكات",
  8: "الذكاء الاصطناعي",
  9: "قسم الارقام",
  10: "البرمجة والتصميم",
  11: "حسابات جاهزة",
  12: "إعلانات ممولة"
};

async function getCategoryData(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const categories = await res.json();
    const cat = categories.find(c => c.id === Number(id));
    if (cat) return cat;
  } catch (err) {
    console.error("Error fetching category in metadata:", err);
  }
  return { id: Number(id), name: categoryNamesMap[id] || "الخدمات المتاحة" };
}

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  const id = unwrappedParams.id;
  const category = await getCategoryData(id);

  const title = `شحن ألعاب وقسم ${category.name} بأفضل الأسعار | اسبيدر استور مصر`;
  const description = `تصفح كافة الخدمات المتاحة في قسم ${category.name} على متجر Spider Store لشحن الألعاب والشدات والجواهر والاشتراكات بأسرع تنفيذ في مصر.`;

  return {
    title,
    description,
    keywords: [
      `شحن ${category.name}`,
      `قسم ${category.name}`,
      "اسبيدر استور",
      "اسبيرد استور",
      "Spider Store",
      `أسعار خدمات ${category.name}`
    ],
    alternates: {
      canonical: `https://spider-store.vercel.app/category/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://spider-store.vercel.app/category/${id}`,
      siteName: "Spider Store",
      images: [
        {
          url: category.image && category.image.startsWith("http") 
            ? category.image 
            : "https://spider-store.vercel.app/uploads/og-image.png",
          alt: category.name
        }
      ],
      type: "website",
    }
  };
}

export default async function Page({ params }) {
  const unwrappedParams = await params;
  const id = unwrappedParams.id;
  const category = await getCategoryData(id);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": "https://spider-store.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category.name,
        "item": `https://spider-store.vercel.app/category/${id}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryClient params={params} />
    </>
  );
}
