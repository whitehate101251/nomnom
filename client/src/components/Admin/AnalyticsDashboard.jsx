import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import AdminService from '../../services/admin';
import Loading from '../common/Loading';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Container = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin: 0;
  color: #1a1a1a;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.color || '#f8f9fa'};
  padding: 1.5rem;
  border-radius: 8px;
  color: white;

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
  }

  p {
    margin: 0;
    opacity: 0.8;
  }
`;

const ChartSection = styled.div`
  margin-bottom: 2rem;

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ChartContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  height: 400px;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [userData, setUserData] = useState([]);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, sales, products, users] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getSalesAnalytics(period),
        AdminService.getProductAnalytics(),
        AdminService.getUserAnalytics()
      ]);

      setStats(dashboardStats);
      setSalesData(sales);
      setProductData(products);
      setUserData(users);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container>
      <Header>
        <Title>Analytics Dashboard</Title>
        <FilterSection>
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </Select>
        </FilterSection>
      </Header>

      <StatsGrid>
        <StatCard color="#0088FE">
          <h3>${stats?.totalRevenue.toFixed(2)}</h3>
          <p>Total Revenue</p>
        </StatCard>
        <StatCard color="#00C49F">
          <h3>{stats?.totalOrders}</h3>
          <p>Total Orders</p>
        </StatCard>
        <StatCard color="#FFBB28">
          <h3>{stats?.totalCustomers}</h3>
          <p>Total Customers</p>
        </StatCard>
        <StatCard color="#FF8042">
          <h3>${stats?.averageOrderValue.toFixed(2)}</h3>
          <p>Average Order Value</p>
        </StatCard>
      </StatsGrid>

      <ChartGrid>
        <ChartSection>
          <h3>Sales Overview</h3>
          <ChartContainer>
            <ResponsiveContainer>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#0088FE" name="Revenue" />
                <Line type="monotone" dataKey="orders" stroke="#00C49F" name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartSection>

        <ChartSection>
          <h3>Top Products</h3>
          <ChartContainer>
            <ResponsiveContainer>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#0088FE" name="Sales" />
                <Bar dataKey="revenue" fill="#00C49F" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartSection>

        <ChartSection>
          <h3>Customer Demographics</h3>
          <ChartContainer>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={userData.demographics}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {userData.demographics?.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartSection>

        <ChartSection>
          <h3>User Activity</h3>
          <ChartContainer>
            <ResponsiveContainer>
              <LineChart data={userData.activity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" name="Active Users" />
                <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartSection>
      </ChartGrid>
    </Container>
  );
};

export default AnalyticsDashboard; 