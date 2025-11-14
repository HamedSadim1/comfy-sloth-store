import React, { useCallback } from "react";
import { useFilterContext } from "../Context/FilterContext";
import { BsFillGridFill, BsList } from "react-icons/bs";
import styled from "styled-components";
import { useStore } from "../store";

// Sub-component for view toggle buttons
interface ViewToggleProps {
  gridView: boolean;
  onToggleView: (isGrid: boolean) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ gridView, onToggleView }) => (
  <div className="btn-container">
    <button
      type="button"
      className={gridView ? "active" : ""}
      onClick={() => onToggleView(true)}
      aria-label="Grid view"
    >
      <BsFillGridFill />
    </button>
    <button
      type="button"
      className={!gridView ? "active" : ""}
      onClick={() => onToggleView(false)}
      aria-label="List view"
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
  <form>
    <label htmlFor="sort">Sort by</label>
    <select
      name="sort"
      id="sort"
      className="sort-input"
      value={sort}
      onChange={onSortChange}
    >
      <option value="price-lowest">price (lowest)</option>
      <option value="price-highest">price (highest)</option>
      <option value="name-a">name (a - z)</option>
      <option value="name-z">name (z - a)</option>
    </select>
  </form>
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
      <ViewToggle gridView={gridView} onToggleView={handleToggleView} />
      <p>{numberOfProducts} products found</p>
      <hr />
      <SortSelect sort={sort} onSortChange={updateSort} />
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  margin-bottom: 2rem;
  column-gap: 2rem;
  @media (max-width: 576px) {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 0.75rem;
    .btn-container {
      width: 50px;
    }
    label {
      display: inline-block;
      margin-right: 0.5rem;
    }
  }
  @media (min-width: 768px) {
    column-gap: 2rem;
  }
  p {
    text-transform: capitalize;
    margin-bottom: 0;
  }

  .btn-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 0.5rem;
    button {
      background: transparent;
      border: 1px solid var(--clr-black);
      color: var(--clr-black);
      width: 1.5rem;
      border-radius: var(--radius);
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      svg {
        font-size: 1rem;
      }
    }
    .active {
      background: var(--clr-black);
      color: var(--clr-white);
    }
  }

  .sort-input {
    border-color: transparent;
    font-size: 1rem;
    text-transform: capitalize;
    padding: 0.25rem 0.5rem;
  }
  label {
    font-size: 1rem;
    text-transform: capitalize;
  }
`;

export default Sort;
