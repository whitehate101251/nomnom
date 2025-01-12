import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Rating } from 'react-simple-star-rating';

const ReviewsSection = styled.section`
  padding: 4rem 0;
`;

const ReviewsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ReviewForm = styled(motion.form)`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 3rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 1rem 0;
  min-height: 100px;
`;

const SubmitButton = styled(motion.button)`
  padding: 0.8rem 2rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const ReviewCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewerName = styled.h4`
  font-size: 1.1rem;
  color: #1a1a1a;
`;

const ReviewDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const ReviewText = styled.p`
  color: #666;
  line-height: 1.6;
`;

const ProductReviews = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'John Doe',
      rating: 5,
      text: 'Amazing fragrance! Long-lasting and unique.',
      date: '2024-03-15'
    },
    // Add more reviews...
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      id: reviews.length + 1,
      name: 'Current User', // Replace with actual user name
      rating,
      text: review,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews([newReview, ...reviews]);
    setRating(0);
    setReview('');
  };

  return (
    <ReviewsSection>
      <ReviewsContainer>
        <ReviewForm onSubmit={handleSubmit}>
          <h3>Write a Review</h3>
          <Rating
            onClick={setRating}
            initialValue={rating}
            size={24}
            fillColor="#ffd700"
          />
          <TextArea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your thoughts about this product..."
            required
          />
          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Review
          </SubmitButton>
        </ReviewForm>

        <AnimatePresence>
          {reviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ReviewHeader>
                <div>
                  <ReviewerName>{review.name}</ReviewerName>
                  <Rating
                    readonly
                    initialValue={review.rating}
                    size={16}
                    fillColor="#ffd700"
                  />
                </div>
                <ReviewDate>{review.date}</ReviewDate>
              </ReviewHeader>
              <ReviewText>{review.text}</ReviewText>
            </ReviewCard>
          ))}
        </AnimatePresence>
      </ReviewsContainer>
    </ReviewsSection>
  );
};

export default ProductReviews; 