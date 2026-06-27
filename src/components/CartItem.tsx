import React, { useCallback } from "react";
import styled from "styled-components";
import { formatPrice } from "../utils/helper";
import { FaTrash, FaCheckCircle } from "react-icons/fa";
import { useCartContext } from "../Context/CartContext";
import type { CartItem as CartItemType } from "../Context/CartContext";
import AmountButton from "./AmountButton";
import Button from "./Button";
import ColorSwatch from "./ColorSwatch";
import { gradientText } from "../styles/gradientText";

// Define interface for props
interface CartItemProps {
  items: CartItemType;
}

// Sub-component for item information (image, name, color, price)
interface ItemInfoProps {
  image: string;
  name: string;
  color: string;
  price: number;
  shipping: boolean;
}

const ItemInfo: React.FC<ItemInfoProps> = ({
  image,
  name,
  color,
  price,
  shipping,
}) => (
  <div className="title">
    <div className="image">
      <img src={image} alt={name} loading="lazy" />
    </div>
    <div className="meta">
      <h3 className="name">{name}</h3>
      {color && (
        <p className="color">
          <ColorSwatch color={color} size="xs" />
          <span className="dot-label">Color</span>
        </p>
      )}
      <p className="price-mobile" aria-label={`Price ${formatPrice(price)}`}>
        {formatPrice(price)}
      </p>
      {shipping && (
        <p className="shipping">
          <FaCheckCircle aria-hidden="true" />
          Free shipping
        </p>
      )}
    </div>
  </div>
);

// Main functional component for cart item
const CartItem: React.FC<CartItemProps> = ({ items: cartData }) => {
  const { image, id, name, price, color, stock, amount, shipping } = cartData;

  // Store selectors
  const { removeFromCart, toggleAmount } = useCartContext();

  // Handlers with useCallback for performance
  const handleIncrease = useCallback(() => {
    if (amount < stock) {
      toggleAmount(id, "inc");
    } else {
      console.warn("Cannot increase amount beyond available stock");
    }
  }, [amount, stock, toggleAmount, id]);

  const handleDecrease = useCallback(() => {
    toggleAmount(id, "dec");
  }, [toggleAmount, id]);

  const handleRemove = useCallback(() => {
    removeFromCart(id);
  }, [removeFromCart, id]);

  // Ensure amount is defined, default to 0 if not
  const safeAmount = amount ?? 0;
  const subtotal = price * safeAmount;

  return (
    <Wrapper>
      <ItemInfo
        image={image}
        name={name}
        color={color}
        price={price}
        shipping={shipping === true}
      />
      <p className="price">{formatPrice(price)}</p>
      <div className="stepper">
        <AmountButton
          amount={safeAmount}
          increase={handleIncrease}
          decrease={handleDecrease}
        />
      </div>
      <p className="subtotal" aria-label={`Subtotal ${formatPrice(subtotal)}`}>
        {formatPrice(subtotal)}
      </p>
      <Button
        type="button"
        variant="icon"
        onClick={handleRemove}
        aria-label={`Remove ${name} from cart`}
        iconRight={<FaTrash />}
      />
    </Wrapper>
  );
};

const Wrapper = styled.article`
  display: grid;
  gap: 1rem 1rem;
  background: var(--clr-white);
  border: 1px solid rgba(34, 34, 34, 0.06);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-xs);
  align-items: center;
  transition:
    transform 0.4s var(--ease-out),
    box-shadow 0.4s var(--ease-out),
    border-color 0.4s var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: rgba(204, 152, 110, 0.3);
  }

  /* Image */
  .image {
    width: 96px;
    aspect-ratio: 1 / 1;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--clr-primary-9);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.5s var(--ease-out);
    }
  }

  /* On hover card, gently zoom the image */
  &:hover .image img {
    transform: scale(1.04);
  }

  /* Title cluster (image + meta) */
  .title {
    display: grid;
    grid-template-columns: 96px 1fr;
    gap: 1rem;
    align-items: center;
    min-width: 0;
  }

  .meta {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .name {
    color: var(--clr-grey-1);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0;
    line-height: 1.3;
    margin: 0;
    /* Allow up to two lines, then truncate */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .color {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--clr-grey-5);
    font-size: 0.78rem;
    margin: 0;
    letter-spacing: 0;
  }

  .dot-label {
    text-transform: capitalize;
    letter-spacing: 0.04em;
  }

  .price-mobile {
    color: var(--clr-grey-5);
    font-size: 0.85rem;
    margin: 0.15rem 0 0;
    font-weight: 600;
  }

  .shipping {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: hsl(125, 50%, 32%);
    font-size: 0.75rem;
    font-weight: 600;
    margin: 0.15rem 0 0;
    letter-spacing: 0;
  }

  .shipping svg {
    width: 0.8rem;
    height: 0.8rem;
  }

  /* Per-line desktop/mobile prices */
  .price {
    display: none;
  }

  .subtotal {
    display: none;
  }

  /* Stepper wrapper keeps AmountButton sized the same on both placements */
  .stepper {
    display: grid;
    justify-items: center;
  }

  /* ============== Mobile stacked layout ============== */
  .title {
    grid-column: 1 / -1;
  }

  .stepper {
    grid-column: 1 / -1;
    justify-items: start;
  }

  /* On mobile: gentle two-column row for price line + remove */
  .price-mobile {
    display: block;
  }

  /* Hide desktop-only columns explicitly */
  .price,
  .subtotal {
    display: none;
  }

  /* ============== Desktop grid alignment ============== */
  @media (min-width: 768px) {
    padding: 1.25rem 1.25rem;
    grid-template-columns: 100px 1fr 110px 1fr 40px;
    column-gap: 1rem;
    align-items: center;

    /* Title occupies image + meta cells */
    .title {
      grid-column: 1 / span 2;
      grid-template-columns: 100px 1fr;
      display: grid;
      column-gap: 1rem;
      align-items: center;
      align-self: stretch;
    }

    .image {
      width: 100%;
      height: 100%;
      border-radius: var(--radius-md);
    }

    .price-mobile {
      display: none;
    }

    /* Show desktop-only columns */
    .price,
    .subtotal {
      display: block;
      text-align: right;
      font-size: 0.95rem;
      color: var(--clr-grey-2);
      font-weight: 500;
      margin: 0;
      letter-spacing: 0;
    }

    .subtotal {
      ${gradientText}
      font-weight: 700;
      font-size: 1.05rem;
    }

    .stepper {
      grid-column: 3;
      justify-self: center;
    }
  }
`;

export default CartItem;
