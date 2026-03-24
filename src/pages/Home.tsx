import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const { products } = useShop();
  const [filter, setFilter] = useState('Todos');
  const [sort, setSort] = useState('Recomendados');

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => 
    filter === 'Todos' ? true : p.category === filter
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'Menor Precio') return a.price - b.price;
    if (sort === 'Mayor Precio') return b.price - a.price;
    return 0; // 'Recomendados'
  });

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Eleva tu juego al siguiente nivel</h1>
            <p>Descubre nuestra selección premium de palas, calzado y accesorios para dominar la pista.</p>
            <a href="#catalog" className="btn-primary hero-btn">Ver Catálogo</a>
          </div>
        </div>
      </section>

      <section id="catalog" className="catalog-section container">
        <div className="catalog-header">
          <h2>Catálogo de Productos</h2>
          <div className="catalog-controls">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="select-filter"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="select-filter"
            >
              <option value="Recomendados">Recomendados</option>
              <option value="Menor Precio">Menor Precio</option>
              <option value="Mayor Precio">Mayor Precio</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {sortedProducts.length === 0 && (
            <p className="no-products">No se encontraron productos.</p>
          )}
        </div>
      </section>
    </main>
  );
};
