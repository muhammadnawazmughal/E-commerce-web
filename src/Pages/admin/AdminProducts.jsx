import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Éclat Sublime',
    categoryId: '',
    price: '',
    discountPrice: '',
    stock: 25,
    description: '',
    images: '',
    ingredients: '',
    isFeatured: false
  });
  const [isSaving, setIsSaving] = useState(false);

  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        categoryService.getCategories()
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      if (catRes.data?.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: catRes.data[0]._id }));
      }
    } catch (err) {
      showToast('Failed to load products repository.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: 'Éclat Sublime',
      categoryId: categories[0]?._id || '',
      price: '',
      discountPrice: '',
      stock: 25,
      description: '',
      images: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
      ingredients: 'Hyaluronic Acid, Vitamin C, Niacinamide, Damask Rose Water',
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      brand: prod.brand,
      categoryId: prod.categoryId?._id || prod.categoryId || categories[0]?._id || '',
      price: prod.price,
      discountPrice: prod.discountPrice || '',
      stock: prod.stock,
      description: prod.description,
      images: prod.images?.join(', ') || '',
      ingredients: prod.ingredients?.join(', ') || '',
      isFeatured: prod.isFeatured || false
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you certain you wish to retire formula "${name}"?`)) return;
    try {
      await productService.deleteProduct(id);
      showToast(`Formula "${name}" deleted.`, 'info');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      showToast(err.message || 'Failed to delete product.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        categoryId: formData.categoryId,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock),
        description: formData.description,
        images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
        ingredients: formData.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
        isFeatured: formData.isFeatured
      };

      if (editingProduct) {
        const res = await productService.updateProduct(editingProduct._id, payload);
        showToast('Formula updated successfully!', 'success');
        setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? res.data : p)));
      } else {
        const res = await productService.createProduct(payload);
        showToast('New formula published to salon!', 'success');
        setProducts((prev) => [res.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save product.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Inventory & Formulations
          </span>
          <h1 className="font-serif text-3xl font-bold text-noir-900 mt-1">
            Product Management ({products.length})
          </h1>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 rounded-xl bg-noir-900 hover:bg-gold text-white hover:text-noir-900 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Formulate New Product</span>
        </button>
      </div>

      {/* Search and Table Container */}
      <div className="bg-white rounded-2xl border border-luxury-200 shadow-sm overflow-hidden space-y-4 p-6">
        
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="Search products by title or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-luxury-300 rounded-xl pl-10 pr-4 py-2 text-xs text-noir-900 focus:outline-none focus:border-gold"
          />
          <Search className="w-4 h-4 text-luxury-400 absolute left-3 top-2.5" />
        </div>

        {loading ? (
          <LoadingSpinner text="Querying inventory records..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-luxury-200 bg-[#FAF8F5] text-luxury-700 uppercase tracking-wider font-semibold">
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Discount</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Featured</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-100 text-luxury-800">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&q=80'}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-white border border-luxury-200"
                      />
                      <div>
                        <p className="font-bold text-noir-900 line-clamp-1">{p.name}</p>
                        <span className="text-[10px] text-gold uppercase font-semibold">{p.brand}</span>
                      </div>
                    </td>
                    <td className="p-3.5">{p.categoryId?.name || 'Unassigned'}</td>
                    <td className="p-3.5 font-serif font-bold text-noir-900">${p.price.toFixed(2)}</td>
                    <td className="p-3.5">
                      {p.discountPrice ? (
                        <span className="text-rose-deep font-semibold">${p.discountPrice.toFixed(2)}</span>
                      ) : (
                        <span className="text-luxury-400">—</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        p.stock <= 10 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3.5">
                      {p.isFeatured ? (
                        <span className="text-gold font-bold text-xs">★ Yes</span>
                      ) : (
                        <span className="text-luxury-400">No</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 text-luxury-600 hover:text-noir-900 hover:bg-luxury-100 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id, p.name)}
                        className="p-1.5 text-luxury-400 hover:text-rose-deep hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Formula Specifications' : 'Formulate New Boutique Product'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-luxury-700 uppercase">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
                placeholder="e.g. Cellular Radiant Glow Serum"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-luxury-700 uppercase">Brand *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
                placeholder="Éclat Sublime"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-luxury-700 uppercase">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-luxury-700 uppercase">Regular Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-luxury-700 uppercase">Discount Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
                placeholder="Leave blank if none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-luxury-700 uppercase">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
              />
            </div>

            <div className="space-y-1 flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-gold focus:ring-gold rounded"
                />
                <span className="font-semibold text-noir-900 uppercase">Iconic Featured Item</span>
              </label>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-luxury-700 uppercase">Description *</label>
              <textarea
                rows="3"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
                placeholder="Sensory notes, active benefits, and scientific skin benefits..."
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-luxury-700 uppercase">Image URLs (comma separated)</label>
              <input
                type="text"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
                placeholder="https://images.unsplash.com/..., https://..."
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-luxury-700 uppercase">Key Ingredients (comma separated)</label>
              <input
                type="text"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
                placeholder="Hyaluronic Acid, Vitamin C, Rose Extract"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-luxury-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-luxury-600 hover:text-noir-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-noir-900 hover:bg-gold text-white hover:text-noir-900 font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              {isSaving ? 'Saving...' : editingProduct ? 'Update Formula' : 'Publish Product'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default AdminProducts;
