import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Image } from "../types";
import { useSingleProductStore } from "../SingleProductStore";

// Module-level canonical fallback used when a product doesn't ship an image.
// Declared outside the component so the reference is stable across renders,
// which keeps the dependency array of the prop-reset useEffect lint-clean.
const fallbackImage: Image = {
  id: "no-image",
  width: 600,
  height: 600,
  url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
  filename: "no-image",
  size: 0,
  type: "image/svg+xml",
  thumbnails: {
    small: { url: "", width: 0, height: 0 },
    large: { url: "", width: 0, height: 0 },
    full: { url: "", width: 0, height: 0 },
  },
};

// Define interface for props
interface ProductImagesProps {
  images: Image[];
}

// Sub-component for main image display
interface MainImageProps {
  image: Image;
}

const MainImage: React.FC<MainImageProps> = ({ image }) => (
  <div className="main-frame">
    <img src={image.url} alt="main product image" className="main" />
    <div className="shine" aria-hidden="true" />
  </div>
);

// Sub-component for image gallery
interface GalleryProps {
  images: Image[];
  mainImage: Image;
  onImageSelect: (image: Image) => void;
}

const Gallery: React.FC<GalleryProps> = ({
  images,
  mainImage,
  onImageSelect,
}) => (
  <div className="gallery" role="tablist" aria-label="Product images">
    {images.map((image, index) => {
      const isActive = image.url === mainImage.url;
      return (
        <button
          key={image.id ?? index}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-label={`Show image ${index + 1}`}
          onClick={() => onImageSelect(image)}
          className={isActive ? "thumb active" : "thumb"}
        >
          <img src={image.url} alt={image.filename} loading="lazy" />
        </button>
      );
    })}
  </div>
);

// Main functional component for product images with gallery
const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  const setImage = useSingleProductStore((state) => state.setImage);

  // First image, or the module-level fallback when the gallery is empty.
  // Used both as the lazy `useState` seed (so the first render has a real
  // image) and inside the prop-reset effect below.
  const firstImage = images[0] ?? fallbackImage;

  const [main, setMain] = useState<Image>(firstImage);

  // Reset `main` + push the new URL into the Zustand store whenever the
  // parent's `images` prop changes (e.g. navigating /products/A -> /products/B).
  // Closes over the freshly-computed `firstImage` from the latest render.
  useEffect(() => {
    setMain(firstImage);
    setImage(firstImage.url);
  }, [images, setImage, firstImage]);

  // Click handler also keeps the store in sync (no separate main-watcher effect).
  const handleImageSelect = useCallback((image: Image) => {
    setMain(image);
    setImage(image.url);
  }, [setImage]);

  // Empty-array early return lives AFTER the hooks so the rules of hooks are upheld.
  if (images.length === 0) {
    return (
      <Wrapper>
        <img src={fallbackImage.url} alt="no image" className="main" />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {images.length > 1 ? (
        <div className="layout">
          <Gallery
            images={images}
            mainImage={main}
            onImageSelect={handleImageSelect}
          />
          <MainImage image={main} />
        </div>
      ) : (
        <MainImage image={main} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .layout {
    display: grid;
    gap: 1rem;
  }

  .main-frame {
    position: relative;
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: var(--clr-grey-10);
    aspect-ratio: 1 / 1;
    box-shadow: var(--shadow-xl);
  }

  img.main {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform 0.7s var(--ease-out);
  }

  .main-frame:hover img.main {
    transform: scale(1.03);
  }

  /* Subtle highlight gradient on hover */
  .shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.18) 0%,
      rgba(255, 255, 255, 0) 50%
    );
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s var(--ease-out);
  }

  .main-frame:hover .shine {
    opacity: 1;
  }

  .gallery {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 88px;
    gap: 0.65rem;
    overflow-x: auto;
    padding-bottom: 0.35rem;

    /* Hide scrollbar but keep usability on small screens */
    scrollbar-width: thin;
  }

  .thumb {
    appearance: none;
    border: 0;
    padding: 0;
    width: 88px;
    height: 88px;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--clr-grey-10);
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    transition:
      transform 0.2s var(--ease-out),
      box-shadow 0.3s var(--ease-out),
      opacity 0.3s var(--ease-out);
    opacity: 0.7;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    &:hover {
      opacity: 1;
      transform: translateY(-2px);
    }

    &:focus-visible {
      outline: none;
      opacity: 1;
      box-shadow: 0 0 0 3px rgba(204, 152, 110, 0.35);
    }

    &.active {
      opacity: 1;
      box-shadow:
        0 0 0 2px var(--clr-white),
        0 0 0 4px var(--clr-primary-5),
        var(--shadow-md);
    }
  }

  /* On desktop, stack thumbnails vertically next to the main image */
  @media (min-width: 768px) {
    .layout {
      grid-template-columns: 88px minmax(0, 1fr);
      gap: 1rem;
      align-items: start;
    }

    .gallery {
      grid-auto-flow: row;
      grid-auto-columns: auto;
      grid-template-rows: repeat(auto-fit, 88px);
      overflow-x: visible;
      padding-bottom: 0;
    }
  }

  @media (max-width: 576px) {
    .main-frame {
      aspect-ratio: 4 / 5;
    }
  }
`;

export default ProductImages;
