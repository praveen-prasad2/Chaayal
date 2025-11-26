'use client';

import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

type Product = {
  _id: string;
  name: string;
  sku?: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  imageUrl?: string;
  originalPrice?: number;
  discountPercentage?: number;
  sizes?: string[];
  colors?: string[];
};

type ProductFormState = {
  name: string;
  sku: string;
  description: string;
  category: string;
  price: string;
  originalPrice: string;
  discountPercentage: string;
  stock: string;
  sizes: string;
  colors: string;
  images: string[];
};

const MAX_IMAGES = 5;
const SIDEBAR_LINKS = [
  { id: 'create-product', label: 'Create New Product' },
  { id: 'all-products', label: 'All Products' },
  { id: 'enquiries', label: 'Enquiries' },
] as const;
type SectionKey = (typeof SIDEBAR_LINKS)[number]['id'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    value || 0,
  );

const initialForm: ProductFormState = {
  name: '',
  sku: '',
  description: '',
  category: '',
  price: '',
  originalPrice: '',
  discountPercentage: '',
  stock: '',
  sizes: '',
  colors: '',
  images: [],
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('create-product');

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch products');
      }
      setProducts(data.data || []);
    } catch (err: any) {
      setError(err?.message || 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, fetchProducts]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingProduct(null);
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Invalid password');
      }
      setIsAuthenticated(true);
      setToast('Welcome back!');
    } catch (err: any) {
      setError(err?.message || 'Unable to verify password.');
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const availableSlots = MAX_IMAGES - form.images.length;
    if (availableSlots <= 0) {
      setError(`You can upload up to ${MAX_IMAGES} images per product.`);
      return;
    }

    const batch = Array.from(files).slice(0, availableSlots);
    const body = new FormData();
    batch.forEach((file) => body.append('files', file));

    setUploading(true);
    setError('');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to upload images');
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...data.urls].slice(0, MAX_IMAGES) }));
    } catch (err: any) {
      setError(err?.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const transformPayload = () => {
    if (!form.images.length) {
      throw new Error('Please upload at least one product image.');
    }
    const sku = form.sku.trim().toUpperCase();
    if (!sku) {
      throw new Error('Please provide a SKU.');
    }
    return {
      name: form.name.trim(),
      sku,
      description: form.description.trim(),
      category: form.category.trim(),
      price: Number(form.price) || 0,
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      discountPercentage: form.discountPercentage ? Number(form.discountPercentage) : undefined,
      stock: Number(form.stock) || 0,
      images: form.images,
      sizes: form.sizes
        ? form.sizes
            .split(',')
            .map((size) => size.trim())
            .filter(Boolean)
        : [],
      colors: form.colors
        ? form.colors
            .split(',')
            .map((color) => color.trim())
            .filter(Boolean)
        : [],
    };
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const payload = transformPayload();
      setSubmitting(true);
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Unable to save product.');
      }
      setToast(editingProduct ? 'Product updated successfully.' : 'Product created successfully.');
      resetForm();
      fetchProducts();
      setActiveSection('all-products');
    } catch (err: any) {
      setError(err?.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      sku: product.sku || '',
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      discountPercentage: product.discountPercentage?.toString() || '',
      stock: product.stock.toString(),
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      images: product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [],
    });
    setActiveSection('create-product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Unable to delete product.');
      }
      setToast('Product deleted.');
      fetchProducts();
    } catch (err: any) {
      setError(err?.message || 'Delete failed.');
    }
  };

  const handleUpdateStock = async (id: string, stock: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to update stock.');
      }
      setToast('Stock updated.');
      fetchProducts();
    } catch (err: any) {
      setError(err?.message || 'Unable to update stock.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setShowPassword(false);
    setProducts([]);
    setForm(initialForm);
    setEditingProduct(null);
    setActiveSection('create-product');
    setToast('');
    setError('');
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#73181F] px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white w-full max-w-sm p-8 rounded-2xl shadow space-y-4"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold text-[#73181F]">Chaayal Admin</h1>
            <p className="text-gray-500 text-sm">Enter the admin password to continue</p>
          </div>
          <label className="block text-sm font-medium text-gray-600">
            Password
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border rounded-md px-3 py-2 pr-11 focus:outline-none focus:ring-2 focus:ring-[#73181F]"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800 focus:outline-none"
                aria-label="Toggle password visibility"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 12s4-6.5 9.5-6.5 9.5 6.5 9.5 6.5-4 6.5-9.5 6.5S2.5 12 2.5 12z" />
                  <circle cx="12" cy="12" r="3" />
                  {!showPassword && <path d="M4 20 20 4" />}
                </svg>
              </button>
            </div>
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#73181F] hover:bg-[#5a1319] text-white py-2 rounded-md transition"
          >
            Sign In
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="hidden md:flex w-64 flex-col bg-white border-r shadow-sm">
        <div className="px-6 py-8 border-b">
          <h2 className="text-2xl font-bold text-[#73181F]">Chaayal Admin</h2>
          <p className="text-sm text-gray-500">Manage products & enquiries</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {SIDEBAR_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveSection(link.id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                activeSection === link.id
                  ? 'bg-[#73181F]/10 text-[#73181F]'
                  : 'text-gray-700 hover:bg-[#73181F]/10 hover:text-[#73181F]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <div className="md:hidden bg-white shadow px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-semibold" style={{ color: '#73181F' }}>
              Chaayal Admin
            </h1>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-red-600"
              >
                Logout
              </button>
              <details className="relative">
                <summary className="list-none cursor-pointer px-4 py-2 border rounded-lg text-sm">
                  Menu
                </summary>
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
                  {SIDEBAR_LINKS.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => setActiveSection(link.id)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        activeSection === link.id ? 'text-[#73181F]' : ''
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>

        <main className="px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {toast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg">
              {toast}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {activeSection === 'create-product' && (
            <CreateProductSection
              form={form}
              uploading={uploading}
              submitting={submitting}
              editingProduct={editingProduct}
              onSubmit={handleSubmit}
              onReset={resetForm}
              onFieldChange={setForm}
              onUpload={handleFileUpload}
              onRemoveImage={handleRemoveImage}
            />
          )}

          {activeSection === 'all-products' && (
            <ProductsTableSection
              products={products}
              loading={loading}
              formatCurrency={formatCurrency}
              onRefresh={fetchProducts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdateStock={handleUpdateStock}
            />
          )}

          {activeSection === 'enquiries' && <EnquiriesSection />}
        </main>
      </div>
    </div>
  );
}

type CreateProductSectionProps = {
  form: ProductFormState;
  uploading: boolean;
  submitting: boolean;
  editingProduct: Product | null;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onFieldChange: Dispatch<SetStateAction<ProductFormState>>;
  onUpload: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
};

function CreateProductSection({
  form,
  uploading,
  submitting,
  editingProduct,
  onSubmit,
  onReset,
  onFieldChange,
  onUpload,
  onRemoveImage,
}: CreateProductSectionProps) {
  return (
    <section className="bg-white rounded-2xl shadow p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Inventory</p>
          <h2 className="text-3xl font-bold mt-1" style={{ color: '#73181F' }}>
            {editingProduct ? 'Edit Product' : 'Create New Product'}
          </h2>
        </div>
        {editingProduct && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-gray-500 underline hover:text-gray-800"
          >
            Cancel edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Product Name"
            required
            value={form.name}
            onChange={(value) => onFieldChange((prev) => ({ ...prev, name: value }))}
          />
          <TextField
            label="SKU"
            required
            value={form.sku}
            onChange={(value) => onFieldChange((prev) => ({ ...prev, sku: value }))}
            placeholder="e.g., CH-001"
          />
          <TextField
            label="Category"
            required
            value={form.category}
            onChange={(value) => onFieldChange((prev) => ({ ...prev, category: value }))}
          />
          <TextField
            label="Price (₹)"
            required
            type="number"
            value={form.price}
            onChange={(value) => onFieldChange((prev) => ({ ...prev, price: value }))}
          />
          <TextField
            label="Original Price (MRP)"
            type="number"
            placeholder="Optional"
            value={form.originalPrice}
            onChange={(value) => onFieldChange((prev) => ({ ...prev, originalPrice: value }))}
          />
          <TextField
            label="Discount Percentage"
            type="number"
            placeholder="Optional"
            value={form.discountPercentage}
            onChange={(value) =>
              onFieldChange((prev) => ({ ...prev, discountPercentage: value }))
            }
          />
          <TextField
            label="Stock"
            required
            type="number"
            value={form.stock}
            onChange={(value) => onFieldChange((prev) => ({ ...prev, stock: value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(event) =>
              onFieldChange((prev) => ({ ...prev, description: event.target.value }))
            }
            rows={4}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#73181F] text-black"
          />
        </div>

        <TextField
          label="Sizes (comma separated)"
          placeholder="S, M, L, XL"
          value={form.sizes}
          onChange={(value) => onFieldChange((prev) => ({ ...prev, sizes: value }))}
        />
        <TextField
          label="Colors (comma separated)"
          placeholder="Maroon, White"
          value={form.colors}
          onChange={(value) => onFieldChange((prev) => ({ ...prev, colors: value }))}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images (max {MAX_IMAGES})
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => onUpload(event.target.files)}
            disabled={uploading || form.images.length >= MAX_IMAGES}
            className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-md focus:outline-none focus:ring-2 cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload up to {MAX_IMAGES} images. Supported formats: JPEG, PNG, GIF, WebP.
          </p>
          {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
          {form.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {form.images.map((url, index) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl border"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#73181F] text-white px-6 py-2 rounded-md shadow hover:bg-[#5a1319] transition disabled:opacity-60"
          >
            {submitting ? 'Saving…' : editingProduct ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={submitting}
            className="px-6 py-2 rounded-md border border-gray-300 text-gray-600 hover:text-gray-900"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
};

function TextField({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
  placeholder,
}: TextFieldProps) {
  return (
    <label className="text-sm font-medium text-gray-600">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#73181F]"
      />
    </label>
  );
}

type ProductsTableProps = {
  products: Product[];
  loading: boolean;
  formatCurrency: (value: number) => string;
  onRefresh: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onUpdateStock: (id: string, stock: number) => void;
};

function ProductsTableSection({
  products,
  loading,
  formatCurrency,
  onRefresh,
  onEdit,
  onDelete,
  onUpdateStock,
}: ProductsTableProps) {
  return (
    <section className="bg-white rounded-2xl shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Catalogue</p>
          <h2 className="text-2xl font-semibold" style={{ color: '#73181F' }}>
            All Products
          </h2>
        </div>
        <button
          onClick={onRefresh}
          className="text-sm px-4 py-2 border rounded-full hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 uppercase tracking-wide text-xs">
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Pricing</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {product.images?.[0] || product.imageUrl ? (
                      <img
                        src={product.images?.[0] || product.imageUrl}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg border border-dashed flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {product.sku || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900 font-semibold">
                      {formatCurrency(product.price)}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </div>
                    )}
                    {product.discountPercentage && (
                      <span className="text-xs text-emerald-600 font-semibold">
                        {product.discountPercentage}% off
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      defaultValue={product.stock}
                      className="w-24 border rounded-md px-2 py-1 text-sm text-black"
                      onBlur={(event) => {
                        const newStock = Number(event.target.value);
                        if (!Number.isNaN(newStock) && newStock !== product.stock) {
                          onUpdateStock(product._id, newStock);
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-[#73181F] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function EnquiriesSection() {
  return (
    <section className="bg-white rounded-2xl shadow p-6 space-y-3">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Customer Desk</p>
        <h2 className="text-2xl font-semibold" style={{ color: '#73181F' }}>
          Enquiries
        </h2>
      </div>
      <p className="text-sm text-gray-600">
        This workspace will surface WhatsApp or form enquiries once the lead capture flow is
        connected. Need a specific workflow (export to Excel, tagging, follow-ups)? Let me know
        and I can wire it up.
      </p>
      <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-gray-500 text-sm">
        No enquiries yet. Keep an eye on your WhatsApp inbox for now.
      </div>
    </section>
  );
}

