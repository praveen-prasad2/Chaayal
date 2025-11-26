'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Product {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    imageUrl?: string;
    images?: string[];
    category: string;
    description: string;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(value);

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                if (data.success) {
                    setProducts(data.data);
                } else {
                    throw new Error(data.error || 'Failed to fetch products');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section id="products" className="py-24 bg-secondary min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading collection...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="products" className="py-24 bg-secondary min-h-[600px] flex items-center justify-center">
                <div className="text-center text-red-500">
                    <p>Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    const getImageUrl = (product: Product) => {
        const image = product.images?.[0] || product.imageUrl;
        if (!image) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop';

        // Handle Google Drive View URLs
        if (image.includes('drive.google.com') && image.includes('/view')) {
            const idMatch = image.match(/\/d\/(.+)\//);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
            }
        }

        return image;
    };

    const collectionsMap = new Map<string, Product[]>();
    products.forEach((product) => {
        const key = product.category || 'Featured';
        if (!collectionsMap.has(key)) {
            collectionsMap.set(key, []);
        }
        collectionsMap.get(key)!.push(product);
    });

    const orderedCollections = Array.from(collectionsMap.entries()).map(([title, items]) => ({
        title,
        items,
    }));

    const featuredCollections =
        orderedCollections.length > 0
            ? orderedCollections.slice(0, 2)
            : [{ title: 'Featured Edit', items: products }];

    return (
        <section id="products" className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found in the collection.</p>
                    </div>
                ) : (
                    featuredCollections.map((collection, index) => {
                        const eyebrowPresets = ['DROP 25.25', 'Onam 2025'];
                        const eyebrow = eyebrowPresets[index] || 'Featured Edit';

                        return (
                        <div key={`${collection.title}-${index}`} className="space-y-10">
                            <div className="text-center space-y-3">
                                <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                                    {eyebrow}
                                </p>
                                <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a]">
                                    {collection.title}
                                </h2>
                                <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                                    Curated edits featuring four looks per drop, inspired by the reference layout provided.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {collection.items.slice(0, 4).map((product) => {
                                    const hasOriginal =
                                        typeof product.originalPrice === 'number' &&
                                        product.originalPrice > product.price;

                                    return (
                                        <article key={product._id} className="space-y-4 group">
                                            <Link href={`/products/${product._id}`} className="block">
                                                <div className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden">
                                                    <Image
                                                        src={getImageUrl(product)}
                                                        alt={product.name}
                                                        fill
                                                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                                                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                </div>
                                            </Link>

                                            <div className="text-center space-y-1">
                                                <h3 className="text-lg font-medium text-[#1a1a1a]">
                                                    {product.name}
                                                </h3>
                                                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                                                    {product.category}
                                                </p>
                                                <p className="text-base font-semibold text-[#1a1a1a]">
                                                    {hasOriginal
                                                        ? `${formatCurrency(product.price)} – ${formatCurrency(
                                                              product.originalPrice as number
                                                          )}`
                                                        : formatCurrency(product.price)}
                                                </p>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center">
                                <Link
                                    href="/products"
                                    className="px-10 py-3 rounded-full border border-[#1a1a1a] text-xs uppercase tracking-[0.35em] hover:bg-[#1a1a1a] hover:text-white transition-colors"
                                >
                                    View All Products
                                </Link>
                            </div>
                        </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}
