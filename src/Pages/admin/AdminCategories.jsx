import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true
  });
  const [isSaving, setIsSaving] = useState(false);

  const { showToast } = useToast();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.isActive ?? true
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you certain you wish to delete category "${name}"?`)) return;
    try {
      await categoryService.deleteCategory(id);
      showToast(`Category "${name}" deleted.`, 'info');
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      showToast(err.message || 'Failed to delete category.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingCategory) {
        const res = await categoryService.updateCategory(editingCategory._id, formData);
        showToast('Category updated successfully!', 'success');
        setCategories((prev) => prev.map((c) => (c._id === editingCategory._id ? res.data : c)));
      } else {
        const res = await categoryService.createCategory(formData);
        showToast('New category published!', 'success');
        setCategories((prev) => [...prev, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save category.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Couture Architecture
          </span>
          <h1 className="font-serif text-3xl font-bold text-noir-900 mt-1">
            Category Lines ({categories.length})
          </h1>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 rounded-xl bg-noir-900 hover:bg-gold text-white hover:text-noir-900 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-luxury-200 shadow-sm overflow-hidden p-6">
        {loading ? (
          <LoadingSpinner text="Retrieving categories..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-luxury-200 bg-[#FAF8F5] text-luxury-700 uppercase tracking-wider font-semibold">
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Slug</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-100 text-luxury-800">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&q=80'}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover bg-white border border-luxury-200 shrink-0"
                      />
                      <span className="font-serif font-bold text-noir-900 text-sm">{cat.name}</span>
                    </td>
                    <td className="p-3.5 font-mono text-luxury-500">{cat.slug}</td>
                    <td className="p-3.5 max-w-xs text-luxury-600 truncate">{cat.description}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-1.5 text-luxury-600 hover:text-noir-900 hover:bg-luxury-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id, cat.name)}
                        className="p-1.5 text-luxury-400 hover:text-rose-deep hover:bg-rose-50 rounded-lg transition-colors"
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

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category Line' : 'Create New Category Line'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-luxury-700 uppercase">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
              placeholder="e.g. Cellular Skincare"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-luxury-700 uppercase">Slug (optional)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
              placeholder="auto-generated if empty"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-luxury-700 uppercase">Description</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
              placeholder="Summary of this beauty line..."
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-luxury-700 uppercase">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-white border border-luxury-300 rounded-xl px-3.5 py-2"
            />
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
              className="px-6 py-2 rounded-full bg-noir-900 hover:bg-gold text-white hover:text-noir-900 font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              {isSaving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default AdminCategories;
