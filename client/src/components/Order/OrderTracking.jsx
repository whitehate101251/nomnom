import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import OrderTrackingService from '../../services/orderTracking';
import { FaBox, FaTruck, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

const TrackingContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const TrackingHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const StatusTimeline = styled.div`
  position: relative;
  margin: 2rem 0;
  padding: 0 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: calc(2rem + 8px);
    bottom: 0;
    width: 2px;
    background: #eee;
  }
`;

const StatusStep = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  position: relative;
`;

const StatusIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.active ? '#4CAF50' : '#eee'};
  color: ${props => props.active ? 'white' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  z-index: 1;
`;

const StatusInfo = styled.div`
  flex: 1;
`;

const StatusTitle = styled.h4`
  margin: 0;
  color: ${props => props.active ? '#1a1a1a' : '#666'};
`;

const StatusTime = styled.p`
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.9rem;
`;

const DeliveryEstimate = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 2rem;
  text-align: center;
`;

const LocationUpdate = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
`;

const OrderTracking = ({ orderId }) => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const loadTrackingInfo = async () => {
      try {
        const [status, shipment, estimate] = await Promise.all([
          OrderTrackingService.getOrderStatus(orderId),
          OrderTrackingService.getShipmentDetails(orderId),
          OrderTrackingService.getDeliveryEstimate(orderId)
        ]);

        setTrackingInfo({ ...status, ...shipment });
        setDeliveryEstimate(estimate);
        setCurrentLocation(shipment.currentLocation);

        // Subscribe to real-time updates
        OrderTrackingService.subscribeToShipmentUpdates(orderId, (update) => {
          setTrackingInfo(prev => ({ ...prev, ...update }));
          if (update.currentLocation) {
            setCurrentLocation(update.currentLocation);
          }
        });
      } catch (error) {
        console.error('Error loading tracking information:', error);
      }
    };

    loadTrackingInfo();

    return () => {
      OrderTrackingService.unsubscribeFromShipmentUpdates(orderId);
    };
  }, [orderId]);

  if (!trackingInfo) return <div>Loading tracking information...</div>;

  const steps = [
    { id: 'ordered', icon: FaBox, title: 'Order Placed' },
    { id: 'processing', icon: FaBox, title: 'Processing' },
    { id: 'shipped', icon: FaTruck, title: 'Shipped' },
    { id: 'delivered', icon: FaCheckCircle, title: 'Delivered' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === trackingInfo.status);

  return (
    <TrackingContainer>
      <TrackingHeader>
        <h2>Order Tracking</h2>
        <p>Order #{orderId}</p>
      </TrackingHeader>

      <StatusTimeline>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentStepIndex;
          
          return (
            <StatusStep
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <StatusIcon active={isActive}>
                <Icon />
              </StatusIcon>
              <StatusInfo>
                <StatusTitle active={isActive}>{step.title}</StatusTitle>
                {trackingInfo[`${step.id}At`] && (
                  <StatusTime>
                    {new Date(trackingInfo[`${step.id}At`]).toLocaleString()}
                  </StatusTime>
                )}
              </StatusInfo>
            </StatusStep>
          );
        })}
      </StatusTimeline>

      {currentLocation && (
        <LocationUpdate>
          <FaMapMarkerAlt /> Current Location: {currentLocation}
        </LocationUpdate>
      )}

      {deliveryEstimate && (
        <DeliveryEstimate>
          Estimated Delivery: {new Date(deliveryEstimate.date).toLocaleDateString()}
          {deliveryEstimate.timeWindow && (
            <div>Time Window: {deliveryEstimate.timeWindow}</div>
          )}
        </DeliveryEstimate>
      )}
    </TrackingContainer>
  );
};

export default OrderTracking; 