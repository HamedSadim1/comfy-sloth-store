import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { formatPrice } from "../utils/helper";
import { FaSearch } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { colors } from "../data";
import { useStore } from "../store";
import useComfys from "../hooks/useComfye";
import useCategoryList from "../hooks/useCategoryList";
import { Products, Category } from "../types";
import { shimmerFill } from "../styles/shimmer";
import Button from "./Button";
import ColorSwatch from "./ColorSwatch";

// Define interfaces for sub-component props
interface SearchFormProps {
  onSearch: (text: string) => void;
}

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
}

// How many chips to show before the "Show all N more" pill kicks in.
// Picked to fit comfortably in the 240–260px sidebar without scrolling.
const INITIAL_VISIBLE = 10;

interface CategoryFilterProps {
  /** Categories to render (either the API list or a products-derived fallback). */
  categories: Category[];
  /** True while the dedicated category-list query is pending AND we have
   *  no fallback yet — the chip group renders shimmer placeholders. */
  isLoading: boolean;
  /** True when the dedicated query failed AND we still have a usable
   *  (products-derived) fallback list — renders a small note above
   *  the chip group so users know the list isn't the full catalogue. */
  hasFallbackWarning: boolean;
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
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

// Sub-component for category filter.
//
// Reads the full /products/category-list when available (via useCategoryList
// in the parent) so the chip group shows every category from the first
// paint. Falls back to a products-derived list with a small warning note
// if the API call fails. Renders the first `INITIAL_VISIBLE` categories
// plus a "+N more" pill that the user clicks to expand the rest.
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  isLoading,
  hasFallbackWarning,
  selectedCategory,
  onCategoryChange,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const visibleCategories = expanded
    ? categories
    : categories.slice(0, INITIAL_VISIBLE);
  const hiddenCount = categories.length - visibleCategories.length;

  return (
    <FilterGroup title="Category">
      {hasFallbackWarning && (
        <p className="fallback-note">
          Couldn&rsquo;t load the full category list &mdash; showing what&rsquo;s
          currently visible in the catalogue.
        </p>
      )}
      <div className="chip-list">
        {/* "all" pseudo-category always first — independent of API. */}
        <button
          key="__all__"
          type="button"
          name="category"
          className={selectedCategory === "all" ? "chip active" : "chip"}
          onClick={() => onCategoryChange("all")}
        >
          all
        </button>
        {isLoading
          ? Array.from({ length: INITIAL_VISIBLE }).map((_, i) => (
              <span
                key={`__skeleton__${i}`}
                className="chip chip-skeleton"
                aria-hidden="true"
              />
            ))
          : null}
        {!isLoading &&
          visibleCategories.map((categoryItem) => {
            const isActive = selectedCategory === categoryItem.slug;
            return (
              <button
                key={categoryItem.slug}
                type="button"
                name="category"
                className={isActive ? "chip active" : "chip"}
                onClick={() => onCategoryChange(categoryItem.slug)}
                aria-label={`Filter by category ${categoryItem.name}`}
              >
                {categoryItem.name}
              </button>
            );
          })}
        {!isLoading && hiddenCount > 0 && !expanded && (
          <button
            type="button"
            className="chip show-all-pill"
            onClick={() => setExpanded(true)}
            aria-label={`Show ${hiddenCount} more categories`}
          >
            +{hiddenCount} more
          </button>
        )}
      </div>
    </FilterGroup>
  );
};

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

// Sub-component for color filter — uses the shared <ColorSwatch />
// primitive so the swatch visuals are aligned with AddToCart.
const ColorFilter: React.FC<ColorFilterProps> = ({
  colors,
  selectedColor,
  onColorChange,
}) => {
  const isAllActive = selectedColor === "all";
  return (
    <FilterGroup title="Color">
      <div className="color-list">
        <button
          type="button"
          name="color"
          onClick={() => onColorChange("all")}
          className={isAllActive ? "color-text active" : "color-text"}
        >
          all
        </button>
        {colors.map((colorData) => {
          const isActive =
            selectedColor.toLowerCase() === colorData.toLowerCase();
          return (
            <ColorSwatch
              key={colorData}
              color={colorData}
              size="md"
              active={isActive}
              ariaLabel={`Filter by color ${colorData}`}
              onClick={() => onColorChange(colorData)}
              showCheck
            />
          );
        })}
      </div>
    </FilterGroup>
  );
};

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

// Sub-component for clear button — uses the shared <Button variant="danger" />
// primitive for consistency with the cart's clear button.
const ClearButton: React.FC<ClearButtonProps> = ({ onClear }) => (
  <Button
    type="button"
    variant="danger"
    onClick={onClear}
    fullWidth
    iconRight={<FiX />}
  >
    Clear filters
  </Button>
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
  const setMaxPrice = useStore((state) => state.setMaxPrice);

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

  // Derive the brand <select> options from the loaded product set.
  const brandOptions = useMemo(() => {
    const known = products
      .map((p) => p.company)
      .filter((brand): brand is string => brand.length > 0);
    return ["all", ...Array.from(new Set(known)).sort()];
  }, [products]);

  // Pull the full dummyjson category list so every category is visible from
  // the first paint — not only those present in the currently-loaded pages
  // of `useComfys`. If the API call fails, fall back to a list aggregated
  // from the products we already have in memory (with a small warning note
  // rendered inside the CategoryFilter).
  const {
    data: categoryList,
    isLoading: categoryListLoading,
    isError: categoryListError,
  } = useCategoryList();

  const fallbackCategories: Category[] = useMemo(() => {
    const known = products
      .map((p) => p.category)
      .filter(
        (cat): cat is string =>
          typeof cat === "string" && cat.length > 0 && cat !== "uncategorised"
      );
    return Array.from(new Set(known))
      .sort()
      .map((slug) => ({ slug, name: slug, url: "" }));
  }, [products]);

  const categoryItems: Category[] =
    categoryList && categoryList.length > 0 ? categoryList : fallbackCategories;
  const isCategoryLoading =
    categoryListLoading && categoryItems.length === 0;
  const showFallbackWarning =
    categoryListError && categoryItems.length > 0;

  // Initialize price to max on mount, AND mirror maxPrice into the store so
  // PageHero (which doesn't see the products list) can call `clearFilter`
  // without us having to plumb the value through.
  useEffect(() => {
    updatePrice(maxPrice);
    setMaxPrice(maxPrice);
  }, [updatePrice, setMaxPrice, maxPrice]);

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
          categories={categoryItems}
          isLoading={isCategoryLoading}
          hasFallbackWarning={showFallbackWarning}
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
    top: 6.5rem;
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

    /* Skeleton placeholder shown while the /products/category-list
       query is pending — same DOM shape as a chip so the layout
       doesn't shift when the real chips arrive. */
    .chip-skeleton {
      ${shimmerFill}
      width: 5rem;
      border-color: transparent;
      cursor: default;
      pointer-events: none;
    }

    /* "+N more" pill under the visible chips — sticky-styled visually
       via a soft fill so it reads as a different affordance. */
    .show-all-pill {
      background: var(--clr-primary-10);
      border-color: transparent;
      color: var(--clr-primary-2);
      font-weight: 700;

      &:hover,
      &:focus-visible {
        background: var(--clr-primary-9);
        color: var(--clr-primary-1);
        border-color: transparent;
        transform: none;
      }
    }
  }

  /* Small note rendered above the chip group when we're rendering the
     products-derived fallback because the API call failed. */
  .fallback-note {
    font-size: 0.72rem;
    color: var(--clr-grey-6);
    margin: 0 0 0.55rem;
    letter-spacing: 0;
    font-style: italic;
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
`;

export default Filter;
