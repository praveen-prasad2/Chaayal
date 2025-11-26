import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import ProductModel from '@/models/Product';

interface ProductRecord {
    _id: string;
    name: string;
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

export default async function ProductsPage() {
    await connectDB();
    const records = await ProductModel.find().sort({ createdAt: -1 }).lean();
    const products: ProductRecord[] = records.map((record: any) => ({
        _id: record._id.toString(),
        name: record.name,
        price: record.price,
        originalPrice: record.originalPrice,
        images: record.images,
        imageUrl: record.imageUrl,
        category: record.category,
    }));

    return (
        <section className="min-h-screen bg-white py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Catalogue</p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a]">All Products</h1>
                    <p className="text-sm text-gray-500 max-w-3xl mx-auto">
                        Browse every piece currently available. Select a product to view the details page and start an order via WhatsApp.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">We&apos;re curating the next collection. Please check back soon.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {products.map((product) => {
                            const hasOriginal =
                                typeof product.originalPrice === 'number' && product.originalPrice > product.price;

                            return (
                                <article key={product._id} className="space-y-4 group">
                                    <Link href={`/products/${product._id}`} className="block">
                                        <div className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden">
                                            <Image
                                                src={getImageUrl(product)}
                                                alt={product.name}
                                                fill
                                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </Link>

                                    <div className="text-center space-y-1">
                                        <h2 className="text-lg font-medium text-[#1a1a1a]">{product.name}</h2>
                                        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{product.category}</p>
                                        <p className="text-base font-semibold text-[#1a1a1a]">
                                            {hasOriginal
                                                ? `${formatCurrency(product.price)} – ${formatCurrency(product.originalPrice as number)}`
                                                : formatCurrency(product.price)}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

