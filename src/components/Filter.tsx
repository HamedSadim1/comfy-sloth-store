import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { formatPrice } from "../utils/helper";
import { FaCheck } from "react-icons/fa";
import { Categories, companies, colors } from "../data";
import { useStore } from "../store";
import useComfys from "../hooks/useComfye";
import { Products } from "../types";

// Define interfaces for sub-component props
interface SearchFormProps {
  onSearch: (text: string) => void;
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
      <div className="form-control">
        <h5>Search</h5>
        <input
          type="text"
          name="text"
          placeholder="search"
          className="search-input"
          ref={ref}
        />
      </div>
    </form>
  );
};

// Sub-component for category filter
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => (
  <div className="form-control">
    <h5>Category</h5>
    <div>
      {categories.map((categoryItem, index) => {
        const isActive =
          categoryItem.toLowerCase() === selectedCategory.toLowerCase();
        return (
          <button
            key={index}
            type="button"
            name="category"
            className={isActive ? "all-btn active" : "all-btn"}
            onClick={() => onCategoryChange(categoryItem.toLowerCase())}
          >
            {categoryItem}
          </button>
        );
      })}
    </div>
  </div>
);

// Sub-component for company filter
const CompanyFilter: React.FC<CompanyFilterProps> = ({
  companies,
  selectedCompany,
  onCompanyChange,
}) => (
  <div className="form-control">
    <h5>Company</h5>
    <select
      name="company"
      id="company"
      className="company"
      value={selectedCompany}
      onChange={(e) => onCompanyChange(e.target.value)}
    >
      {companies.map((company, index) => (
        <option key={index} value={company}>
          {company}
        </option>
      ))}
    </select>
  </div>
);

// Sub-component for color filter
const ColorFilter: React.FC<ColorFilterProps> = ({
  colors,
  selectedColor,
  onColorChange,
}) => (
  <div className="form-control">
    <h5>Colors</h5>
    <div className="colors">
      <button
        name="color"
        onClick={() => onColorChange("all")}
        className={`${selectedColor === "all" ? "all-btn active" : "all-btn"}`}
      >
        all
      </button>
      {colors.map((colorData, index) => (
        <button
          key={index}
          name="color"
          onClick={() => onColorChange(colorData)}
          style={{ background: colorData }}
          className={`${
            selectedColor.toLowerCase() === colorData.toLowerCase()
              ? "color-btn active"
              : "color-btn"
          }`}
        >
          {selectedColor.toLowerCase() === colorData.toLowerCase() && (
            <FaCheck />
          )}
        </button>
      ))}
    </div>
  </div>
);

// Sub-component for price filter
const PriceFilter: React.FC<PriceFilterProps> = ({
  price,
  minPrice,
  maxPrice,
  onPriceChange,
}) => (
  <div className="form-control">
    <h5>Price</h5>
    <p className="price">{formatPrice(price)}</p>
    <input
      type="range"
      name="price"
      id="price"
      value={price}
      onChange={(e) => onPriceChange(parseInt(e.target.value))}
      min={minPrice}
      max={maxPrice}
    />
  </div>
);

// Sub-component for shipping filter
const ShippingFilter: React.FC<ShippingFilterProps> = ({
  freeShipping,
  onShippingChange,
}) => (
  <div className="form-control shipping">
    <label htmlFor="shipping">free shipping</label>
    <input
      type="checkbox"
      name="shipping"
      id="shipping"
      checked={freeShipping}
      onChange={onShippingChange}
    />
  </div>
);

// Sub-component for clear button
const ClearButton: React.FC<ClearButtonProps> = ({ onClear }) => (
  <button type="button" className="clear-btn" onClick={onClear}>
    clear filters
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
  const products: Products[] = data || [];

  // Calculate min and max prices
  const maxPrice = getMaxPrice(products);
  const minPrice = getMinPrice(products);

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
      <div className="content">
        <SearchForm onSearch={handleSearch} />
      </div>
      <CategoryFilter
        categories={Categories}
        selectedCategory={category}
        onCategoryChange={handleCategoryChange}
      />
      <CompanyFilter
        companies={companies}
        selectedCompany={company}
        onCompanyChange={handleCompanyChange}
      />
      <ColorFilter
        colors={colors}
        selectedColor={color}
        onColorChange={handleColorChange}
      />
      <PriceFilter
        price={price}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={handlePriceChange}
      />
      <ShippingFilter
        freeShipping={freeShipping}
        onShippingChange={setFreeShipping}
      />
      <ClearButton onClear={handleClear} />
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .form-control {
    margin-bottom: 1.25rem;
    h5 {
      margin-bottom: 0.5rem;
    }
  }
  .search-input {
    padding: 0.5rem;
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    letter-spacing: var(--spacing);
  }
  .search-input::placeholder {
    text-transform: capitalize;
  }

  button {
    display: block;
    margin: 0.25em 0;
    padding: 0.25rem 0;
    text-transform: capitalize;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-5);
    cursor: pointer;
  }
  .active {
    border-color: var(--clr-grey-5);
  }
  .company {
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    padding: 0.25rem;
  }
  .colors {
    display: flex;
    align-items: center;
  }
  .color-btn {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #222;
    margin-right: 0.5rem;
    border: none;
    cursor: pointer;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 0.5rem;
      color: var(--clr-white);
    }
  }
  .all-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
    opacity: 0.5;
  }
  .active {
    opacity: 1;
  }
  .all-btn .active {
    text-decoration: underline;
  }
  .price {
    margin-bottom: 0.25rem;
  }
  .shipping {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    text-transform: capitalize;
    column-gap: 0.5rem;
    font-size: 1rem;
    max-width: 200px;
  }
  .clear-btn {
    background: var(--clr-red-dark);
    color: var(--clr-white);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius);
  }
  @media (min-width: 768px) {
    .content {
      position: sticky;
      top: 1rem;
    }
  }
`;

export default Filter;
