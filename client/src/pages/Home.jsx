import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const HomeContainer = styled.div`
  width: 100%;
`;

const FeaturedSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #1a1a1a;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
`;

const ProductPrice = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const ViewButton = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
`;

const CategorySection = styled.section`
  padding: 6rem 2rem;
  background: white;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const CategoryCard = styled(motion.div)`
  position: relative;
  height: 300px;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const CategoryOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: white;
`;

const NewsletterSection = styled.section`
  padding: 6rem 2rem;
  background: #1a1a1a;
  color: white;
  text-align: center;
`;

const NewsletterForm = styled.form`
  max-width: 500px;
  margin: 2rem auto 0;
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
`;

const NewsletterButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: white;
  color: #1a1a1a;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  white-space: nowrap;
`;

const TestimonialSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;
`;

const TestimonialCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  text-align: center;
  margin: 1rem;
`;

const TestimonialText = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin: 1rem 0;
  font-style: italic;
`;

const TestimonialAuthor = styled.h4`
  color: #1a1a1a;
  margin-top: 1rem;
`;

const BrandStorySection = styled.section`
  padding: 6rem 2rem;
  background: white;
`;

const BrandStoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BrandStoryImage = styled(motion.img)`
  width: 100%;
  height: auto;
  border-radius: 15px;
`;

const BrandStoryContent = styled.div`
  padding: 2rem;
`;

const InstagramSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;
`;

const InstagramGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const InstagramImage = styled(motion.img)`
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
`;

const featuredProducts = [
  {
    id: 1,
    name: "Midnight Rose",
    price: 129.99,
    image: "/images/perfume1.jpg",
    description: "A mysterious blend of rose and dark woods"
  },
  {
    id: 2,
    name: "Ocean Breeze",
    price: 89.99,
    image: "/images/perfume2.jpg",
    description: "Fresh aquatic notes with a hint of citrus"
  },
  {
    id: 3,
    name: "Golden Amber",
    price: 119.99,
    image: "/images/perfume3.jpg",
    description: "Warm amber with vanilla undertones"
  }
];

const Home = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  return (
    <HomeContainer>
      <Hero />
      
      <FeaturedSection>
        <SectionContainer>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Featured Collections
          </SectionTitle>

          <ProductGrid>
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                as={Link}
                to={`/product/${product.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <ProductImage src={product.image} alt={product.name} />
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>${product.price}</ProductPrice>
                  <ViewButton
                    as={motion.div}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Details
                  </ViewButton>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductGrid>
        </SectionContainer>
      </FeaturedSection>

      <CategorySection>
        <SectionContainer>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Explore Categories
          </SectionTitle>
          <CategoryGrid>
            {['Floral', 'Woody', 'Fresh', 'Oriental'].map((category, index) => (
              <CategoryCard
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              >
                <CategoryImage src={`/images/category-${index + 1}.jpg`} alt={category} />
                <CategoryOverlay>
                  <h3>{category}</h3>
                </CategoryOverlay>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </SectionContainer>
      </CategorySection>

      <TestimonialSection>
        <SectionContainer>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            What Our Customers Say
          </SectionTitle>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {[1, 2, 3, 4, 5].map((_, index) => (
              <SwiperSlide key={index}>
                <TestimonialCard>
                  <TestimonialText>
                    "The fragrances from LaScentlo are absolutely amazing. The attention to detail and quality is unmatched."
                  </TestimonialText>
                  <TestimonialAuthor>Sarah Johnson</TestimonialAuthor>
                </TestimonialCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </SectionContainer>
      </TestimonialSection>

      <BrandStorySection>
        <SectionContainer>
          <BrandStoryGrid>
            <BrandStoryImage
              src="/images/brand-story.jpg"
              alt="Our Story"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
            <BrandStoryContent>
              <SectionTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Our Story
              </SectionTitle>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Founded in 2020, LaScentlo began with a simple vision: to create unique, 
                luxurious fragrances that tell a story and leave a lasting impression.
                Our journey started with a passion for crafting exceptional scents that 
                capture moments and emotions.
              </motion.p>
            </BrandStoryContent>
          </BrandStoryGrid>
        </SectionContainer>
      </BrandStorySection>

      <NewsletterSection>
        <SectionContainer>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Join Our Newsletter
          </SectionTitle>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Subscribe to receive updates, access to exclusive deals, and more.
          </motion.p>
          <NewsletterForm onSubmit={handleNewsletterSubmit}>
            <NewsletterInput
              type="email"
              placeholder="Enter your email"
              required
            />
            <NewsletterButton
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </NewsletterButton>
          </NewsletterForm>
        </SectionContainer>
      </NewsletterSection>

      <InstagramSection>
        <SectionContainer>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Follow Us on Instagram
          </SectionTitle>
          <InstagramGrid>
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <InstagramImage
                key={index}
                src={`/images/instagram-${index + 1}.jpg`}
                alt={`Instagram post ${index + 1}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </InstagramGrid>
        </SectionContainer>
      </InstagramSection>
    </HomeContainer>
  );
};

export default Home; 