import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../types';
import { Plus, Edit2, Trash2, Loader2, Save, X } from 'lucide-react';

export const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    if (data) setProducts(data);
    setIsLoading(false);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (isAdding) {
      const { error } = await supabase.from('products').insert([editForm]);
      if (!error) {
        setIsAdding(false);
        fetchProducts();
      } else {
        alert(error.message);
      }
    } else if (editingId) {
      const { error } = await supabase.from('products').update(editForm).eq('id', editingId);
      if (!error) {
        setEditingId(null);
        fetchProducts();
      } else {
        alert(error.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        fetchProducts();
      } else {
        alert(error.message);
      }
    }
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId('new');
    setEditForm({ name: '', price: 0, stock: 0, category: '', description: '', imageUrl: '' });
  };

  if (isLoading) return <div className="admin-loading"><Loader2 className="spinner" size={40} /></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestión de Inventario</h1>
        <button onClick={handleAddNew} className="btn-primary" disabled={isAdding}>
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr className="editing-row">
                <td><input type="text" placeholder="URL Imagen" value={editForm.imageUrl || ''} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} /></td>
                <td><input type="text" placeholder="Nombre" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                <td><input type="text" placeholder="Categoría" value={editForm.category || ''} onChange={e => setEditForm({...editForm, category: e.target.value})} /></td>
                <td><input type="number" step="0.01" value={editForm.price || 0} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} /></td>
                <td><input type="number" value={editForm.stock || 0} onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})} /></td>
                <td className="actions-cell">
                  <button onClick={handleSave} className="btn-icon text-success"><Save size={18} /></button>
                  <button onClick={handleCancel} className="btn-icon text-error"><X size={18} /></button>
                </td>
              </tr>
            )}
            
            {products.map(product => (
              <tr key={product.id} className={editingId === product.id ? 'editing-row' : ''}>
                {editingId === product.id ? (
                   <>
                    <td><input type="text" value={editForm.imageUrl || ''} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} /></td>
                    <td><input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                    <td><input type="text" value={editForm.category || ''} onChange={e => setEditForm({...editForm, category: e.target.value})} /></td>
                    <td><input type="number" step="0.01" value={editForm.price || 0} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} /></td>
                    <td><input type="number" value={editForm.stock || 0} onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})} /></td>
                    <td className="actions-cell">
                      <button onClick={handleSave} className="btn-icon text-success"><Save size={18} /></button>
                      <button onClick={handleCancel} className="btn-icon text-error"><X size={18} /></button>
                    </td>
                   </>
                ) : (
                  <>
                    <td><img src={product.imageUrl} alt={product.name} className="admin-product-img" /></td>
                    <td className="fw-600">{product.name}</td>
                    <td><span className="admin-category-badge">{product.category}</span></td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span className={`admin-stock-badge ${product.stock === 0 ? 'error' : product.stock < 5 ? 'warning' : 'success'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button onClick={() => handleEdit(product)} className="btn-icon text-primary"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(product.id)} className="btn-icon text-error"><Trash2 size={18} /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            
            {products.length === 0 && !isAdding && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No hay productos en la base de datos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
