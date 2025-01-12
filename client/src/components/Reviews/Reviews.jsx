import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const ReviewsSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;
`;

const ReviewsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #1a1a1a;
`;

const ReviewCard = styled(motion.div)`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  margin: 1rem;
  text-align: center;
`;

const ReviewText = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ReviewAuthor = styled.h4`
  font-size: 1.2rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const ReviewRating = styled.div`
  color: #ffd700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      text: "The most amazing fragrance I've ever experienced. It lasts all day and the compliments never stop!",
      author: "Sarah Johnson",
      rating: 5
    },
    {
      id: 2,
      text: "Elegant packaging and divine scent. This has become my signature perfume.",
      author: "Michael Chen",
      rating: 5
    },
    {
      id: 3,
      text: "Worth every penny. The attention to detail in creating these fragrances is remarkable.",
      author: "Emma Thompson",
      rating: 5
    },
  ];

  return (
    <ReviewsSection>
      <ReviewsContainer>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          What Our Customers Say
        </SectionTitle>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <ReviewCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <ReviewRating>
                  {"★".repeat(review.rating)}
                </ReviewRating>
                <ReviewText>"{review.text}"</ReviewText>
                <ReviewAuthor>{review.author}</ReviewAuthor>
              </ReviewCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </ReviewsContainer>
    </ReviewsSection>
  );
};

export default Reviews; 