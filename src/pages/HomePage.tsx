import { Contact, Services, Hero, FeaturedProducts, TrustStrip } from "../components";

const HomePage = () => {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <FeaturedProducts />
      <Services />
      <Contact />
    </main>
  );
};

export default HomePage;
