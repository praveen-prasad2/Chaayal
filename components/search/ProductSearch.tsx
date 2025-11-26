'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

type Suggestion = {
  _id: string;
  name: string;
  images?: string[];
  imageUrl?: string;
  category?: string;
};

const PAGE_SIZE = 5;
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop';

const normalizeImage = (images?: string[], imageUrl?: string) => {
  const candidate = images?.[0] || imageUrl;
  if (!candidate) return FALLBACK_IMAGE;

  if (candidate.includes('drive.google.com') && candidate.includes('/view')) {
    const idMatch = candidate.match(/\/d\/([^/]+)/);
    if (idMatch?.[1]) {
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
  }

  return candidate;
};

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState(() => searchParams?.get('search') ?? '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(0);
    if (!debouncedQuery) {
      setResults([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/products?search=${encodeURIComponent(debouncedQuery)}&limit=40`, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.error || 'Failed to fetch results');
        }
        const payload = await res.json();
        setResults(payload?.data || []);
      })
      .catch((fetchError) => {
        if (fetchError.name === 'AbortError') return;
        setError(fetchError.message || 'Something went wrong');
        setResults([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const totalResults = results.length;
  const maxPage = Math.max(0, Math.ceil(totalResults / PAGE_SIZE) - 1);
  const visibleResults = useMemo(
    () => results.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [results, page],
  );

  useEffect(() => {
    if (page > maxPage) {
      setPage(0);
    }
  }, [maxPage, page]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  };

  const handleResultClick = () => {
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm w-full"
      >
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search"
          className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-black"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-2xl border border-gray-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            <span>{totalResults} Results</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                disabled={page === 0}
                className="rounded-full border border-gray-200 p-1 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(maxPage, prev + 1))}
                disabled={page >= maxPage}
                className="rounded-full border border-gray-200 p-1 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[380px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : error ? (
              <div className="px-4 py-6 text-center text-sm text-red-500">{error}</div>
            ) : visibleResults.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">No matching products.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {visibleResults.map((product) => (
                  <li key={product._id}>
                    <Link
                      href={`/products/${product._id}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50"
                    >
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
                        <Image
                          src={normalizeImage(product.images, product.imageUrl)}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{product.name}</p>
                        {product.category && (
                          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{product.category}</p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            href={`/products?search=${encodeURIComponent(query.trim())}`}
            onClick={handleResultClick}
            className="block border-t border-gray-100 px-4 py-3 text-center text-sm font-semibold text-[#73181F] transition hover:bg-[#73181F]/5"
          >
            See all results
          </Link>
        </div>
      )}
    </div>
  );
}

