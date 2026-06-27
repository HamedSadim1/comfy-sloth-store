import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { formatPrice } from "../utils/helper";
import { FaCheck, FaSearch } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { colors } from "../data";
import { useStore } from "../store";
import useComfys from "../hooks/useComfye";
import { Products } from "../types";

// Define interfaces for sub-component props
interface SearchFormProps {
  onSearch: (text: string) => void;
}

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
}

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

interface CompanyFilterProps {
  companies: string[];
  selectedCompany: string;
  onCompanyChange: (company: string) => void;
}

interface ColorFilterProps {
  colors: string[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

interface PriceFilterProps {
  price: number;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (price: number) => void;
}

interface ShippingFilterProps {
  freeShipping: boolean;
  onShippingChange: () => void;
}

interface ClearButtonProps {
  onClear: () => void;
}

// Reusable group block with eyebrow label + content
const FilterGroup: React.FC<FilterGroupProps> = ({ title, children }) => (
  <div className="form-control">
    <span className="label">{title}</span>
    <div className="control">{children}</div>
  </div>
);

// Sub-component for search form
const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (ref.current) {
        onSearch(ref.current.value);
      }
    },
    [onSearch]
  );

  return (
    <form onSubmit={handleSubmit}>
      <FilterGroup title="Search">
        <div className="search-row">
          <FaSearch className="search-icon" aria-hidden="true" />
          <input
            type="text"
            name="text"
            placeholder="search products"
            className="search-input"
            ref={ref}
            aria-label="Search products"
          />
        </div>
      </FilterGroup>
    </form>
  );
};

// Sub-component for category filter
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => (
  <FilterGroup title="Category">
    <div className="chip-list">
      {categories.map((categoryItem) => {
        const isActive =
          categoryItem.toLowerCase() === selectedCategory.toLowerCase();
        return (
          <button
            key={categoryItem}
            type="button"
            name="category"
            className={isActive ? "chip active" : "chip"}
            onClick={() => onCategoryChange(categoryItem.toLowerCase())}
          >
            {categoryItem}
          </button>
        );
      })}
    </div>
  </FilterGroup>
);

// Sub-component for company filter
const CompanyFilter: React.FC<CompanyFilterProps> = ({
  companies,
  selectedCompany,
  onCompanyChange,
}) => (
  <FilterGroup title="Brand">
    <div className="select-wrap">
      <select
        name="company"
        className="company"
        value={selectedCompany}
        onChange={(e) => onCompanyChange(e.target.value)}
        aria-label="Filter by brand"
      >
        {companies.map((company) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>
    </div>
  </FilterGroup>
);

// Sub-component for color filter
const ColorFilter: React.FC<ColorFilterProps> = ({
  colors,
  selectedColor,
  onColorChange,
}) => (
  <FilterGroup title="Color">
    <div className="color-list">
      <button
        type="button"
        name="color"
        onClick={() => onColorChange("all")}
        className={selectedColor === "all" ? "color-text active" : "color-text"}
      >
        all
      </button>
      {colors.map((colorData) => (
        <button
          key={colorData}
          type="button"
          name="color"
          onClick={() => onColorChange(colorData)}
          style={{ background: colorData }}
          className={
            selectedColor.toLowerCase() === colorData.toLowerCase()
              ? "color-swatch active"
              : "color-swatch"
          }
          aria-label={`Filter by color ${colorData}`}
        >
          {selectedColor.toLowerCase() === colorData.toLowerCase() && (
            <FaCheck />
          )}
        </button>
      ))}
    </div>
  </FilterGroup>
);

// Sub-component for price filter
const PriceFilter: React.FC<PriceFilterProps> = ({
  price,
  minPrice,
  maxPrice,
  onPriceChange,
}) => (
  <FilterGroup title="Price">
    <p className="price">{formatPrice(price)}</p>
    <input
      type="range"
      name="price"
      value={price}
      onChange={(e) => onPriceChange(parseInt(e.target.value))}
      min={minPrice}
      max={maxPrice}
      className="price-range"
      aria-label="Maximum price"
    />
    <div className="price-range-meta">
      <span>{formatPrice(minPrice)}</span>
      <span>{formatPrice(maxPrice)}</span>
    </div>
  </FilterGroup>
);

// Sub-component for shipping filter
const ShippingFilter: React.FC<ShippingFilterProps> = ({
  freeShipping,
  onShippingChange,
}) => (
  <FilterGroup title="Shipping">
    <label className="toggle">
      <input
        type="checkbox"
        name="shipping"
        checked={freeShipping}
        onChange={onShippingChange}
      />
      <span className="track" aria-hidden="true">
        <span className="thumb" />
      </span>
      <span className="toggle-label">Free shipping only</span>
    </label>
  </FilterGroup>
);

// Sub-component for clear button
const ClearButton: React.FC<ClearButtonProps> = ({ onClear }) => (
  <button type="button" className="clear-btn" onClick={onClear}>
    <FiX />
    Clear filters
  </button>
);

// Main functional component for filters
const Filter: React.FC = () => {
  // Store selectors
  const setSearchText = useStore((state) => state.setSearchText);
  const freeShipping = useStore(
    (state) => state.comfyStoreQuery.showAllFreeShipping
  );
  const setFreeShipping = useStore((state) => state.setShowAllFreeShipping);
  const updateCategory = useStore((state) => state.updateCategory);
  const category = useStore((state) => state.comfyStoreQuery.category);
  const company = useStore((state) => state.comfyStoreQuery.company);
  const updateCompany = useStore((state) => state.updateCompany);
  const color = useStore((state) => state.comfyStoreQuery.color);
  const updateColor = useStore((state) => state.updateColor);
  const clearFilter = useStore((state) => state.clearFilter);
  const getMaxPrice = useStore((state) => state.getMaxPrice);
  const getMinPrice = useStore((state) => state.getMinPrice);
  const price = useStore((state) => state.comfyStoreQuery.price);
  const updatePrice = useStore((state) => state.updatePrice);

  // Fetch products data
  const { data } = useComfys();

  // `data` from `useComfys` is `InfiniteData<ProductsPage>`; flatMap across
  // pages to derive the accumulated Products[]. Memoise the fallback so it
  // isn't a fresh `[]` each render — that would invalidate the brandOptions
  // useMemo below forever.
  const products = useMemo<Products[]>(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data]
  );

  // Calculate min and max prices
  const maxPrice = getMaxPrice(products);
  const minPrice = getMinPrice(products);

  // Derive the brand <select> options from the loaded product set. With
  // dummyjson the brand names are arbitrary strings ("Apple", "Samsung",
  // …) so a hardcoded list is no longer useful. The mapper lowercases
  // the brand at the source, so case-insensitive dedup is automatic.
  // "all" stays first so the filter sentinel still works.
  const brandOptions = useMemo(() => {
    const known = products
      .map((p) => p.company)
      .filter((brand): brand is string => brand.length > 0);
    return ["all", ...Array.from(new Set(known)).sort()];
  }, [products]);

  // Derive the category chip list from the loaded product set. dummyjson
  // returns arbitrary categories ("smartphones", "laptops", "fragrances",
  // …) that would never match a hardcoded home-furniture list — so we
  // compute the chips from the live data, just like brandOptions. Values
  // stay lowercase for canonical compare; the chip CSS already applies
  // `text-transform: capitalize` for display.
  const categoryOptions = useMemo(() => {
    const known = products
      .map((p) => p.category)
      .filter(
        (cat): cat is string =>
          typeof cat === "string" && cat.length > 0 && cat !== "uncategorised"
      );
    return ["all", ...Array.from(new Set(known)).sort()];
  }, [products]);

  // Initialize price to max on mount
  useEffect(() => {
    updatePrice(maxPrice);
  }, [updatePrice, maxPrice]);

  // Handlers with useCallback for performance
  const handleSearch = useCallback(
    (text: string) => {
      setSearchText(text);
    },
    [setSearchText]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      updateCategory(category);
    },
    [updateCategory]
  );

  const handleCompanyChange = useCallback(
    (company: string) => {
      updateCompany(company);
    },
    [updateCompany]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      updateColor(color);
    },
    [updateColor]
  );

  const handlePriceChange = useCallback(
    (price: number) => {
      updatePrice(price);
    },
    [updatePrice]
  );

  const handleClear = useCallback(() => {
    clearFilter(maxPrice);
  }, [clearFilter, maxPrice]);

  return (
    <Wrapper>
      <div className="card">
        <SearchForm onSearch={handleSearch} />
        <hr className="divider" />
        <CategoryFilter
          categories={categoryOptions}
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
        />
        <hr className="divider" />
        <CompanyFilter
          companies={brandOptions}
          selectedCompany={company}
          onCompanyChange={handleCompanyChange}
        />
        <hr className="divider" />
        <ColorFilter
          colors={colors}
          selectedColor={color}
          onColorChange={handleColorChange}
        />
        <hr className="divider" />
        <PriceFilter
          price={price}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
        />
        <hr className="divider" />
        <ShippingFilter
          freeShipping={freeShipping}
          onShippingChange={setFreeShipping}
        />
        <hr className="divider" />
        <ClearButton onClear={handleClear} />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.aside`
  .card {
    background: var(--clr-white);
    border: 1px solid rgba(34, 34, 34, 0.06);
    border-radius: var(--radius-xl);
    padding: 1.5rem 1.25rem;
    box-shadow: var(--shadow-xs);
  }

  /* Sticky long enough to be useful on tall product lists */
  @media (min-width: 768px) {
    align-self: start;
    position: sticky;
    top: 6.5rem; /* below glass-blur navbar (5rem) + a bit of breathing room */
  }

  .divider {
    border: none;
    border-top: 1px solid rgba(34, 34, 34, 0.06);
    margin: 1.25rem 0;
  }

  .form-control {
    .label {
      display: block;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--clr-grey-3);
      margin-bottom: 0.7rem;
    }
  }

  .search-row {
    position: relative;
    display: flex;
    align-items: center;

    .search-icon {
      position: absolute;
      left: 0.85rem;
      width: 0.9rem;
      height: 0.9rem;
      color: var(--clr-grey-6);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 0.65rem 0.85rem 0.65rem 2.35rem;
      background: var(--clr-grey-10);
      border: 1px solid transparent;
      border-radius: var(--radius-full);
      font-size: 0.9rem;
      color: var(--clr-grey-1);
      letter-spacing: 0;
      transition:
        border-color 0.3s var(--ease-out),
        background 0.3s var(--ease-out),
        box-shadow 0.3s var(--ease-out);
      outline: none;

      &::placeholder {
        color: var(--clr-grey-6);
        text-transform: none;
        letter-spacing: 0;
      }

      &:focus {
        background: var(--clr-white);
        border-color: var(--clr-primary-5);
        box-shadow: 0 0 0 4px rgba(204, 152, 110, 0.15);
      }
    }
  }

  .chip-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;

    .chip {
      padding: 0.32rem 0.75rem;
      border-radius: var(--radius-full);
      background: transparent;
      border: 1px solid rgba(34, 34, 34, 0.1);
      color: var(--clr-grey-4);
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: capitalize;
      letter-spacing: 0;
      cursor: pointer;
      transition:
        background 0.3s var(--ease-out),
        color 0.3s var(--ease-out),
        border-color 0.3s var(--ease-out),
        transform 0.2s var(--ease-out);

      &:hover {
        background: var(--clr-primary-10);
        border-color: var(--clr-primary-7);
        color: var(--clr-primary-2);
      }

      &.active {
        background: var(--gradient-accent);
        color: var(--clr-white);
        border-color: transparent;
        box-shadow: var(--shadow-sm);
      }

      &:focus-visible {
        outline: 2px solid var(--clr-primary-5);
        outline-offset: 2px;
      }
    }
  }

  .select-wrap {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      right: 1rem;
      top: 50%;
      width: 0.55rem;
      height: 0.55rem;
      border-right: 2px solid var(--clr-grey-3);
      border-bottom: 2px solid var(--clr-grey-3);
      transform: translateY(-70%) rotate(45deg);
      pointer-events: none;
    }

    .company {
      width: 100%;
      padding: 0.65rem 2.4rem 0.65rem 0.95rem;
      background: var(--clr-grey-10);
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: capitalize;
      color: var(--clr-grey-2);
      letter-spacing: 0;
      cursor: pointer;
      appearance: none;
      transition:
        border-color 0.3s var(--ease-out),
        background 0.3s var(--ease-out);

      &:focus {
        background: var(--clr-white);
        border-color: var(--clr-primary-5);
        outline: none;
        box-shadow: 0 0 0 4px rgba(204, 152, 110, 0.15);
      }
    }
  }

  .color-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;

    .color-text {
      background: transparent;
      border: none;
      padding: 0.2rem 0.4rem;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--clr-grey-5);
      text-transform: capitalize;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition:
        color 0.3s var(--ease-out),
        border-color 0.3s var(--ease-out);

      &:hover {
        color: var(--clr-grey-2);
      }

      &.active {
        color: var(--clr-primary-2);
        border-color: var(--clr-primary-5);
      }
    }

    .color-swatch {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      border: 2px solid transparent;
      box-shadow: inset 0 0 0 2px var(--clr-white);
      cursor: pointer;
      opacity: 0.65;
      display: grid;
      place-items: center;
      transition:
        opacity 0.3s var(--ease-out),
        transform 0.2s var(--ease-out),
        border-color 0.3s var(--ease-out);

      svg {
        width: 0.7rem;
        height: 0.7rem;
        color: var(--clr-white);
      }

      &:hover {
        opacity: 0.9;
        transform: scale(1.06);
      }

      &.active {
        opacity: 1;
        border-color: var(--clr-grey-1);
        transform: scale(1.06);
      }
    }
  }

  .price {
    font-weight: 700;
    font-size: 1rem;
    color: var(--clr-grey-1);
    letter-spacing: 0;
    margin: 0 0 0.5rem;
  }

  .price-range {
    width: 100%;
    margin: 0;
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    cursor: pointer;

    &::-webkit-slider-runnable-track {
      height: 6px;
      border-radius: 999px;
      background: linear-gradient(
        to right,
        var(--clr-primary-5) 0%,
        var(--clr-primary-5) var(--range-progress, 100%),
        var(--clr-grey-9) var(--range-progress, 100%),
        var(--clr-grey-9) 100%
      );
    }

    &::-moz-range-track {
      height: 6px;
      border-radius: 999px;
      background: var(--clr-grey-9);
    }

    &::-moz-range-progress {
      height: 6px;
      border-radius: 999px;
      background: var(--clr-primary-5);
    }

    &::-webkit-slider-thumb {
      appearance: none;
      -webkit-appearance: none;
      width: 1.1rem;
      height: 1.1rem;
      margin-top: -0.25rem;
      border-radius: 50%;
      background: var(--clr-white);
      border: 2px solid var(--clr-primary-5);
      box-shadow: var(--shadow-sm);
      cursor: grab;
      transition:
        transform 0.2s var(--ease-out),
        box-shadow 0.2s var(--ease-out);
    }

    &:hover::-webkit-slider-thumb,
    &:focus-visible::-webkit-slider-thumb {
      transform: scale(1.1);
      box-shadow: var(--shadow-md);
    }

    &::-moz-range-thumb {
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 50%;
      background: var(--clr-white);
      border: 2px solid var(--clr-primary-5);
      box-shadow: var(--shadow-sm);
      cursor: grab;
    }

    &:focus-visible {
      outline: none;
    }
  }

  .price-range-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    color: var(--clr-grey-5);
    margin-top: 0.4rem;
    letter-spacing: 0.04em;
  }

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    cursor: pointer;
    user-select: none;

    input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
      width: 1px;
      height: 1px;
    }

    .track {
      position: relative;
      width: 2.4rem;
      height: 1.3rem;
      border-radius: 999px;
      background: var(--clr-grey-9);
      border: 1px solid rgba(34, 34, 34, 0.08);
      transition: background 0.3s var(--ease-out);
      flex-shrink: 0;

      .thumb {
        position: absolute;
        top: 50%;
        left: 3px;
        transform: translateY(-50%);
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background: var(--clr-white);
        box-shadow: var(--shadow-sm);
        transition:
          left 0.3s var(--ease-out),
          background 0.3s var(--ease-out);
      }
    }

    input:checked + .track {
      background: var(--gradient-accent);

      .thumb {
        left: calc(100% - 1.15rem);
      }
    }

    input:focus-visible + .track {
      box-shadow: 0 0 0 4px rgba(204, 152, 110, 0.2);
    }

    .toggle-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--clr-grey-2);
      text-transform: none;
      letter-spacing: 0;
    }
  }

  .clear-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
    justify-content: center;
    padding: 0.7rem 1rem;
    border-radius: var(--radius-full);
    background: transparent;
    border: 1px solid var(--clr-red-dark);
    color: var(--clr-red-dark);
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0;
    cursor: pointer;
    transition:
      background 0.3s var(--ease-out),
      color 0.3s var(--ease-out),
      transform 0.2s var(--ease-out);

    svg {
      width: 0.95rem;
      height: 0.95rem;
    }

    &:hover {
      background: var(--clr-red-dark);
      color: var(--clr-white);
    }

    &:focus-visible {
      outline: 2px solid var(--clr-red-dark);
      outline-offset: 2px;
    }
  }
`;

export default Filter;
