import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  category: {
    name: string;
  };
}

const API_URL = import.meta.env.VITE_API_URL;

const CatalogPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const url =
        activeCategory && activeCategory !== 'All'
          ? `${API_URL}/products?categoryId=${activeCategory}`
          : `${API_URL}/products`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setActiveCategory(categoryId);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add categories');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
        setNewCategoryName('');
        setShowAddCategoryModal(false);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add products');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          categoryId: newProduct.categoryId,
        }),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        setProducts([...products, addedProduct]);
        setNewProduct({ name: '', price: '', categoryId: '' });
        setShowAddProductModal(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = (productId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to edit products');
      navigate('/login');
      return;
    }

    console.log('Edit product:', productId);
  };

  const handleDeleteProduct = async (productId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to delete products');
      navigate('/login');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-40 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <nav className="flex flex-col space-y-2">
          <button
            className={`text-left py-1 hover:underline ${activeCategory === null ? 'font-bold' : ''}`}
            onClick={() => handleCategoryClick(null)}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              className={`text-left py-1 hover:underline ${activeCategory === category.id ? 'font-bold' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))}

          <button
            className="flex items-center mt-4 text-left py-1 hover:underline"
            onClick={() => setShowAddCategoryModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add More
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-2xl font-bold">PRODUCT CATALOG</h1>
          <div
            className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer"
            onClick={() => {
              const token = localStorage.getItem('token');
              navigate(token ? '/profile' : '/login');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Product Table */}
        <div className="p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Price</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border">
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">${product.price.toFixed(2)}</td>
                  <td className="border p-2">{product.category.name}</td>
                  <td className="border p-2">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEditProduct(product.id)} className="text-blue-500">Edit</button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Product Button */}
          <div className="mt-4">
            <button
              className="bg-green-400 hover:bg-green-500 text-white font-medium py-2 px-6 rounded-full"
              onClick={() => setShowAddProductModal(true)}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Category</h2>
            <form onSubmit={handleAddCategory}>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-4"
                placeholder="Category name"
                required
              />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowAddCategoryModal(false)} className="px-4 py-2 border rounded-md">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <form onSubmit={handleAddProduct}>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleProductInputChange}
                className="w-full px-3 py-2 border rounded-md mb-4"
                placeholder="Product name"
                required
              />
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleProductInputChange}
                className="w-full px-3 py-2 border rounded-md mb-4"
                placeholder="Price"
                required
              />
              <select
                name="categoryId"
                value={newProduct.categoryId}
                onChange={handleProductInputChange}
                className="w-full px-3 py-2 border rounded-md mb-4"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowAddProductModal(false)} className="px-4 py-2 border rounded-md">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
