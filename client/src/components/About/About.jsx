import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutSection = styled.section`
  padding: 6rem 2rem;
  background: #fff;
`;

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled(motion.h2)`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 4rem;
  color: #1a1a1a;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 4rem;
  margin-bottom: 4rem;
`;

const StorySection = styled(motion.div)`
  text-align: center;
`;

const StoryIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
`;

const StoryTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
`;

const StoryText = styled.p`
  color: #666;
  line-height: 1.6;
`;

const TeamSection = styled.div`
  margin-top: 6rem;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const TeamMember = styled(motion.div)`
  text-align: center;
`;

const MemberImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
`;

const MemberName = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
`;

const MemberRole = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const About = () => {
  return (
    <AboutSection>
      <AboutContainer>
        <Title
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Our Story
        </Title>

        <ContentGrid>
          <StorySection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <StoryIcon>🌟</StoryIcon>
            <StoryTitle>Our Beginning</StoryTitle>
            <StoryText>
              Founded in 2020, LaScentlo began with a simple vision: to create unique, 
              luxurious fragrances that tell a story and leave a lasting impression.
            </StoryText>
          </StorySection>

          <StorySection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <StoryIcon>🌿</StoryIcon>
            <StoryTitle>Our Process</StoryTitle>
            <StoryText>
              Each fragrance is carefully crafted using the finest ingredients, 
              blending traditional techniques with modern innovation.
            </StoryText>
          </StorySection>

          <StorySection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <StoryIcon>💫</StoryIcon>
            <StoryTitle>Our Promise</StoryTitle>
            <StoryText>
              We are committed to creating sustainable, cruelty-free products 
              while delivering exceptional quality and unique experiences.
            </StoryText>
          </StorySection>
        </ContentGrid>

        <TeamSection>
          <Title
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Meet Our Team
          </Title>

          <TeamGrid>
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & Creative Director",
                image: "/images/team/sarah.jpg"
              },
              {
                name: "Michael Chen",
                role: "Master Perfumer",
                image: "/images/team/michael.jpg"
              },
              {
                name: "Emma Thompson",
                role: "Product Development",
                image: "/images/team/emma.jpg"
              }
            ].map((member, index) => (
              <TeamMember
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <MemberImage src={member.image} alt={member.name} />
                <MemberName>{member.name}</MemberName>
                <MemberRole>{member.role}</MemberRole>
              </TeamMember>
            ))}
          </TeamGrid>
        </TeamSection>
      </AboutContainer>
    </AboutSection>
  );
};

export default About; 