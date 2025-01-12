import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import AdminService from '../../services/admin';
import Loading from '../common/Loading';

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

const AddButton = styled.button`
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #333;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f8f9fa;
    font-weight: 600;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.delete ? '#dc3545' : '#0d6efd'};
  cursor: pointer;
  margin-right: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { handleError } = useErrorHandler();

  const initialFormState = {
    name: '',
    description: '',
    price: '',
    category: '',
    size: [],
    stock: '',
    images: []
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await AdminService.getProducts();
      setProducts(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await AdminService.deleteProduct(productId);
        await loadProducts();
      } catch (err) {
        handleError(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await AdminService.updateProduct(editingProduct.id, formData);
      } else {
        await AdminService.createProduct(formData);
      }
      setShowModal(false);
      setFormData(initialFormState);
      setEditingProduct(null);
      await loadProducts();
    } catch (err) {
      handleError(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <Loading />;

  return (
    <Container>
      <Header>
        <Title>Product Management</Title>
        <AddButton onClick={() => setShowModal(true)}>Add Product</AddButton>
      </Header>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <ActionButton onClick={() => handleEdit(product)}>Edit</ActionButton>
                <ActionButton delete onClick={() => handleDelete(product.id)}>Delete</ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <Modal>
          <ModalContent>
            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Description</label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Price</label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Category</label>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="floral">Floral</option>
                  <option value="woody">Woody</option>
                  <option value="fresh">Fresh</option>
                  <option value="oriental">Oriental</option>
                  <option value="citrus">Citrus</option>
                </Select>
              </FormGroup>

              <ButtonGroup>
                <ActionButton type="button" onClick={() => {
                  setShowModal(false);
                  setFormData(initialFormState);
                  setEditingProduct(null);
                }}>
                  Cancel
                </ActionButton>
                <AddButton type="submit">
                  {editingProduct ? 'Update' : 'Create'}
                </AddButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default ProductManagement; 