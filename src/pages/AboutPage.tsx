import styled from "styled-components";
import PageHero from "../components/PageHero";
import aboutImg from "../assets/hero-bcg.jpeg";

const AboutPage = () => {
  return (
    <main>
      <PageHero title="about" />
      <Wrapper className="page section section-center">
        <img src={aboutImg} alt="nice desk" />
        <article>
          <div className="title">
            <h2>our story</h2>
            <div className="underline"></div>
          </div>
          <p>
            Comfy Sloth is a brand dedicated to providing a haven of relaxation
            and comfort for your home. We offer an extensive range of products
            that combine style and coziness, including furniture, decor items,
            textiles, and accessories. Our carefully curated collection is
            designed to create aesthetically pleasing spaces that promote a
            sense of tranquility and well-being. From plush sofas to soft
            blankets and pillows, we have everything you need to create a cozy
            ambiance. We prioritize high-quality materials and craftsmanship to
            ensure durability and luxurious comfort. Discover the joy of
            unwinding in a space that brings you happiness with "Comfy Sloth"
            and elevate your home into a sanctuary of serenity and relaxation
          </p>
        </article>
      </Wrapper>
    </main>
  );
};

const Wrapper = styled.section`
  display: grid;
  gap: 4rem;
  img {
    width: 100%;
    display: block;
    border-radius: var(--radius);
    height: 500px;
    object-fit: cover;
  }
  p {
    line-height: 2;
    max-width: 45em;
    margin: 0 auto;
    margin-top: 2rem;
    color: var(--clr-grey-5);
  }
  .title {
    text-align: left;
  }
  .underline {
    margin-left: 0;
  }
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export default AboutPage;
