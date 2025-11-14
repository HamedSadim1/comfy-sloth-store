import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Image } from "../types";
import { useSingleProductStore } from "../SingleProductStore";

// Define interface for props
interface ProductImagesProps {
  images: Image[];
}

// Sub-component for main image display
interface MainImageProps {
  image: Image;
}

const MainImage: React.FC<MainImageProps> = ({ image }) => (
  <img src={image.url} alt="main image" className="main" />
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
  <div className="gallery">
    {images.map((image, index) => (
      <img
        src={image.url}
        alt={image.filename}
        key={index}
        onClick={() => onImageSelect(image)}
        className={image.url === mainImage.url ? "active" : ""}
      />
    ))}
  </div>
);

// Main functional component for product images with gallery
const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  // Check if the images array is empty or undefined
  if (!images || images.length === 0) {
    return (
      <Wrapper>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
          alt="no image"
          className="main"
        />
      </Wrapper>
    );
  }

  const setImage = useSingleProductStore((state) => state.setImage);

  const [main, setMain] = useState<Image>(images[0]);

  // Update store image when main changes
  useEffect(() => {
    setImage(main.url);
  }, [main, setImage]);

  // Handler for selecting a new main image
  const handleImageSelect = useCallback((image: Image) => {
    setMain(image);
  }, []);

  return (
    <Wrapper>
      <MainImage image={main} />
      <Gallery
        images={images}
        mainImage={main}
        onImageSelect={handleImageSelect}
      />
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .main {
    height: 600px;
  }
  img {
    width: 100%;
    display: block;
    border-radius: var(--radius);
    object-fit: cover;
  }
  .gallery {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 1rem;
    img {
      height: 100px;
      cursor: pointer;
    }
  }
  .active {
    box-shadow: 0px 0px 0px 2px var(--clr-primary-5);
  }
  @media (max-width: 576px) {
    .main {
      height: 300px;
    }
    .gallery {
      img {
        height: 50px;
      }
    }
  }
  @media (min-width: 992px) {
    .main {
      height: 500px;
    }
    .gallery {
      img {
        height: 75px;
      }
    }
  }
`;

export default ProductImages;
