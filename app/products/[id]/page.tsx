'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ImageSlider from '@/components/ImageSlider';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images: string[];
  originalPrice?: number;
  discountPercentage?: number;
  category: string;
  stock: number;
  sizes?: string[];
  colors?: string[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
        if (data.data.sizes && data.data.sizes.length > 0) {
          setSelectedSize(data.data.sizes[0]);
        }
        if (data.data.colors && data.data.colors.length > 0) {
          setSelectedColor(data.data.colors[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = () => {
    if (!product) return;

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
    if (!whatsappNumber) {
      alert('WhatsApp number not configured. Please contact the administrator.');
      return;
    }

    const productImages = product.images && product.images.length > 0 
      ? product.images 
      : (product.imageUrl ? [product.imageUrl] : []);
    const firstImage = productImages.length > 0 ? productImages[0] : '';

    const message = `Hello! I would like to order:\n\n` +
      `Product: ${product.name}\n` +
      `Price: ₹${product.price.toFixed(2)}\n` +
      `Category: ${product.category}\n` +
      (selectedSize ? `Size: ${selectedSize}\n` : '') +
      (selectedColor ? `Color: ${selectedColor}\n` : '') +
      (firstImage ? `\nImage: ${firstImage}\n\n` : '\n') +
      `Please confirm availability and provide order details.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
      ? [product.imageUrl]
      : [];

  const originalPrice =
    product.originalPrice && product.originalPrice > 0
      ? product.originalPrice
      : product.price * 1.2;

  const discount =
    product.discountPercentage && product.discountPercentage > 0
      ? Math.round(product.discountPercentage)
      : originalPrice > product.price
      ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
      : null;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b" style={{ borderColor: '#73181F', borderWidth: '2px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a
            href="/"
            className="text-sm font-medium transition hover:opacity-80"
            style={{ color: '#73181F' }}
          >
            ← Back to Products
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {productImages.length > 0 ? (
                <ImageSlider images={productImages} productName={product.name} />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500">No images available</p>
                </div>
              )}
              {discount && (
                <div className="text-sm font-semibold text-[#73181F]">
                  Limited Time Offer — Save {discount}% today
                </div>
              )}
              {product.stock === 0 && (
                <div className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg text-center font-semibold">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold mb-4" style={{ color: '#73181F' }}>
                {product.name}
              </h1>
              
              <div className="mb-6 flex items-baseline gap-4">
                <p className="text-4xl font-bold" style={{ color: '#73181F' }}>
                  {formatCurrency(product.price)}
                </p>
                {originalPrice > product.price && (
                  <span className="text-2xl text-gray-400 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4 leading-relaxed">{product.description}</p>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span> {product.category}
                  </p>
                  {product.stock > 0 ? (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Stock:</span> {product.stock} available
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 font-medium">
                      Currently out of stock
                    </p>
                  )}
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Size
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-md border-2 transition ${
                          selectedSize === size
                            ? 'text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: selectedSize === size ? '#73181F' : undefined,
                          borderColor: selectedSize === size ? '#73181F' : '#d1d5db',
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-md border-2 transition ${
                          selectedColor === color
                            ? 'text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: selectedColor === color ? '#73181F' : undefined,
                          borderColor: selectedColor === color ? '#73181F' : '#d1d5db',
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleOrderNow}
                disabled={product.stock === 0}
                className={`mt-auto py-4 px-8 rounded-lg font-semibold text-white transition text-lg ${
                  product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : ''
                }`}
                style={{
                  backgroundColor: product.stock === 0 ? undefined : '#73181F',
                }}
                onMouseOver={(e) => {
                  if (product.stock > 0) {
                    e.currentTarget.style.backgroundColor = '#5a1319';
                  }
                }}
                onMouseOut={(e) => {
                  if (product.stock > 0) {
                    e.currentTarget.style.backgroundColor = '#73181F';
                  }
                }}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Order Now via WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
