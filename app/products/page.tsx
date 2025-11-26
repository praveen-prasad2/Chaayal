import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import ProductModel from '@/models/Product';

interface ProductRecord {
    _id: string;
    name: string;
    sku?: string;
    price: number;
    originalPrice?: number;
    images?: string[];
    imageUrl?: string;
    category: string;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(value);

const getImageUrl = (product: ProductRecord) => {
    const image = product.images?.[0] || product.imageUrl;
    if (!image) {
        return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop';
    }

    if (image.includes('drive.google.com') && image.includes('/view')) {
        const idMatch = image.match(/\/d\/(.+)\//);
        if (idMatch && idMatch[1]) {
            return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
        }
    }

    return image;
};

type ProductsPageProps = {
    searchParams?: {
        search?: string;
    };
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    await connectDB();
    const searchTerm = searchParams?.search?.toString().trim() || '';

    const query = searchTerm
        ? {
              $or: [
                  { name: { $regex: searchTerm, $options: 'i' } },
                  { sku: { $regex: searchTerm, $options: 'i' } },
                  { category: { $regex: searchTerm, $options: 'i' } },
              ],
          }
        : {};

    const records = await ProductModel.find(query).sort({ createdAt: -1 }).lean();
    const products: ProductRecord[] = records.map((record: any) => ({
        _id: record._id.toString(),
        name: record.name,
        sku: record.sku,
        price: record.price,
        originalPrice: record.originalPrice,
        images: record.images,
        imageUrl: record.imageUrl,
        category: record.category,
    }));

    const totalProducts = products.length;

    return (
        <section className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
                <header className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Catalogue</p>
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a]">What&apos;s New</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {totalProducts === 0
                                    ? 'No matching results'
                                    : `Showing ${totalProducts} result${totalProducts > 1 ? 's' : ''}${
                                          searchTerm ? ` for “${searchTerm}”` : ''
                                      }`}
                            </p>
                        </div>
                        <form
                            action="/products"
                            className="flex w-full max-w-sm items-center gap-2 border border-gray-200 rounded-md px-3 py-2"
                        >
                            <SearchInput defaultValue={searchTerm} />
                        </form>
                    </div>
                </header>

                {totalProducts === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">We&apos;re curating the next collection. Please check back soon.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => {
                                const hasOriginal =
                                    typeof product.originalPrice === 'number' && product.originalPrice > product.price;

                                return (
                                    <article key={product._id} className="space-y-3 group">
                                        <Link href={`/products/${product._id}`} className="block">
                                            <div
                                                className="relative bg-[#f5f5f5] overflow-hidden rounded-lg shadow-sm"
                                                style={{ aspectRatio: '3 / 4' }}
                                            >
                                                <Image
                                                    src={getImageUrl(product)}
                                                    alt={product.name}
                                                    fill
                                                    sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                                                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                        </Link>

                                        <div className="space-y-1 text-center">
                                            <h2 className="text-base font-semibold text-[#111]">{product.name}</h2>
                                            <p className="text-xs uppercase tracking-[0.25em] text-gray-400">{product.category}</p>
                                            <div className="flex items-center justify-center gap-2 text-sm">
                                                <span className="font-semibold text-[#111]">
                                                    {formatCurrency(product.price)}
                                                </span>
                                                {hasOriginal && (
                                                    <span className="text-gray-400 line-through">
                                                        {formatCurrency(product.originalPrice as number)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                        <PaginationPlaceholder />
                    </>
                )}
            </div>
        </section>
    );
}

function SearchInput({ defaultValue }: { defaultValue: string }) {
    return (
        <>
            <input
                name="search"
                defaultValue={defaultValue}
                type="search"
                placeholder="Search products..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
            <button
                type="submit"
                className="px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-600 hover:text-gray-900"
            >
                Go
            </button>
        </>
    );
}

function PaginationPlaceholder() {
    return (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-6">
            {[1, 2, 3, 4, 5].map((page) => (
                <button key={page} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">
                    {page}
                </button>
            ))}
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">&rarr;</button>
        </div>
    );
}

