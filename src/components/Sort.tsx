import React, { useCallback } from "react";
import { useFilterContext } from "../Context/FilterContext";
import { BsFillGridFill, BsList } from "react-icons/bs";
import styled from "styled-components";
import { useStore } from "../store";
import { HiChevronDown } from "react-icons/hi";

// Sub-component for view toggle buttons
interface ViewToggleProps {
  gridView: boolean;
  onToggleView: (isGrid: boolean) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ gridView, onToggleView }) => (
  <div className="btn-container" role="group" aria-label="View mode">
    <button
      type="button"
      className={gridView ? "toggle-btn active" : "toggle-btn"}
      onClick={() => onToggleView(true)}
      aria-label="Grid view"
      aria-pressed={gridView}
    >
      <BsFillGridFill />
    </button>
    <button
      type="button"
      className={!gridView ? "toggle-btn active" : "toggle-btn"}
      onClick={() => onToggleView(false)}
      aria-label="List view"
      aria-pressed={!gridView}
    >
      <BsList />
    </button>
  </div>
);

// Sub-component for sort select
interface SortSelectProps {
  sort: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SortSelect: React.FC<SortSelectProps> = ({ sort, onSortChange }) => (
  <div className="select-wrap">
    <label htmlFor="sort" className="visually-hidden">
      Sort by
    </label>
    <select
      name="sort"
      id="sort"
      className="sort-input"
      value={sort}
      onChange={onSortChange}
      aria-label="Sort products"
    >
      <option value="price-lowest">price (lowest)</option>
      <option value="price-highest">price (highest)</option>
      <option value="name-a">name (a–z)</option>
      <option value="name-z">name (z–a)</option>
    </select>
    <HiChevronDown className="chevron" aria-hidden="true" />
  </div>
);

// Main functional component for sorting and view controls
const Sort: React.FC = () => {
  const { sort, updateSort } = useFilterContext();
  const setGridView = useStore((state) => state.setGridView);
  const gridView = useStore((state) => state.comfyStoreQuery.gridView);
  const numberOfProducts = useStore(
    (state) => state.comfyStoreQuery.numberOfProducts
  );

  // Handler for view toggle
  const handleToggleView = useCallback(
    (isGrid: boolean) => {
      setGridView(isGrid);
    },
    [setGridView]
  );

  return (
    <Wrapper>
      <div className="row">
        <ViewToggle gridView={gridView} onToggleView={handleToggleView} />
        <span className="count">
          <strong>{numberOfProducts}</strong>{" "}
          {numberOfProducts === 1 ? "product" : "products"}
        </span>
      </div>
      <SortSelect sort={sort} onSortChange={updateSort} />
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: var(--clr-white);
  border: 1px solid rgba(34, 34, 34, 0.06);
  border-radius: var(--radius-xl);
  padding: 0.85rem 1rem;
  box-shadow: var(--shadow-xs);

  .row {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .count {
    font-size: 0.85rem;
    color: var(--clr-grey-4);
    letter-spacing: 0;

    strong {
      color: var(--clr-grey-1);
      font-weight: 700;
    }
  }

  .btn-container {
    display: inline-flex;
    background: var(--clr-grey-10);
    border-radius: var(--radius-full);
    padding: 0.22rem;
    border: 1px solid rgba(34, 34, 34, 0.06);

    .toggle-btn {
      width: 2rem;
      height: 2rem;
      display: grid;
      place-items: center;
      border: none;
      background: transparent;
      color: var(--clr-grey-5);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition:
        background 0.3s var(--ease-out),
        color 0.3s var(--ease-out);

      svg {
        font-size: 0.85rem;
      }

      &:hover {
        color: var(--clr-grey-2);
      }

      &.active {
        background: var(--clr-grey-1);
        color: var(--clr-white);
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
    display: inline-flex;
    align-items: center;
    margin-left: auto;

    .chevron {
      position: absolute;
      right: 0.85rem;
      width: 0.95rem;
      height: 0.95rem;
      color: var(--clr-grey-5);
      pointer-events: none;
    }

    .sort-input {
      appearance: none;
      -webkit-appearance: none;
      border: 1px solid rgba(34, 34, 34, 0.1);
      background: var(--clr-white);
      border-radius: var(--radius-full);
      padding: 0.5rem 2.4rem 0.5rem 1rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--clr-grey-2);
      letter-spacing: 0;
      cursor: pointer;
      transition:
        border-color 0.3s var(--ease-out),
        box-shadow 0.3s var(--ease-out);

      &:hover {
        border-color: rgba(34, 34, 34, 0.2);
      }

      &:focus {
        outline: none;
        border-color: var(--clr-primary-5);
        box-shadow: 0 0 0 4px rgba(204, 152, 110, 0.15);
      }
    }
  }

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;

    .select-wrap {
      margin-left: 0;
      width: 100%;
    }

    .sort-input {
      width: 100%;
    }
  }
`;

export default Sort;
