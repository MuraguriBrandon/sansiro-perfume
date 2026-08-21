import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Check, ChevronDown, CircleHelp, Filter, Minus, Plus, Search, ShoppingBag, Sparkles, X } from 'lucide-react';
import './styles.css';

const fallbackProducts = [
  ['E32', 'Intense Ultramarine', 'Givenchy', 'Men', 'Fresh'], ['E69', 'Dunhill', 'Dunhill', 'Men', 'Woody'], ['E70', 'Code Black', 'Giorgio Armani', 'Men', 'Woody'], ['E72', 'Red', 'Lacoste', 'Men', 'Fresh'], ['E77', 'Fuel for Life', 'Diesel', 'Men', 'Woody'], ['E500', 'One Million', 'Dunhill', 'Men', 'Warm'], ['E530', 'Sauvage', 'Christian Dior', 'Men', 'Fresh'], ['M656', 'Invictus', 'Paco Rabanne', 'Men', 'Fresh'],
  ['K1', 'Burberry', 'Burberry', 'Women', 'Floral'], ['K12', 'Weekend', 'Burberry', 'Women', 'Floral'], ['K64', 'Hypnotic Poison', 'Christian Dior', 'Women', 'Warm'], ['K67', 'Escada', 'Escada', 'Women', 'Floral'], ['K79', 'Chance', 'Chanel', 'Women', 'Fresh'], ['K88', 'Boss Intense', 'Hugo Boss', 'Women', 'Warm'], ['K90', 'Amor Amor', 'Cacharel', 'Women', 'Floral'], ['K95', 'Coco Mademoiselle', 'Chanel', 'Women', 'Warm'], ['K112', 'Lacoste Femme', 'Lacoste', 'Women', 'Fresh'], ['K118', 'Hypnose', 'Lancome', 'Women', 'Warm'], ['K122', 'Bright Crystal', 'Versace', 'Women', 'Fresh'], ['K242', 'Olympea', 'Paco Rabanne', 'Women', 'Warm'], ['K251', 'Good Girl', 'Caroline Herrera', 'Women', 'Warm'], ['K261', 'Scandal', 'Jean Paul', 'Women', 'Warm'],
].map(([code, name, brand, gender, scentGroup], index) => ({ id: code, code, name, brand, gender, scentGroup, price: 350, price8ml: 350, price15ml: 500, stock: index % 7 === 0 ? 0 : index % 5 === 0 ? 3 : 12, stock8ml: index % 7 === 0 ? 0 : index % 5 === 0 ? 3 : 12, stock15ml: 0, description: `A signature ${scentGroup.toLowerCase()} fragrance in the Sansiro collection, made for everyday moments that deserve a little more character.`, image: '' }));

function normalizeProduct(product, index) {
  const stock8ml = Number(product.stock8ml ?? product.stock_8ml ?? product.stock ?? product.inventory ?? 0);
  return { ...product, id: product.id ?? product.code ?? `product-${index}`, price: Number(product.price8ml ?? product.price ?? 350), price8ml: Number(product.price8ml ?? product.price ?? 350), price15ml: Number(product.price15ml ?? product.price_15ml ?? 500), stock: stock8ml, stock8ml, stock15ml: Number(product.stock15ml ?? product.stock_15ml ?? 0), gender: product.gender ?? product.category ?? 'Unisex', scentGroup: product.scentGroup ?? product.scent_group ?? product.family ?? 'Signature' };
}

function variantFor(product, size) {
  const is15ml = size === '15ml';
  return { ...product, size, price: is15ml ? product.price15ml : product.price8ml, stock: is15ml ? product.stock15ml : product.stock8ml, image: is15ml ? (product.image15ml || (product.gender.toLowerCase() === 'women' ? '/female-15ml.jpg' : '/male-15ml.jpg')) : (product.image || (product.gender.toLowerCase() === 'women' ? '/female-perfumes.jpg' : '/male-perfumes.jpg')) };
}

function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [query, setQuery] = useState('');
  const [gender, setGender] = useState('All');
  const [scentGroup, setScentGroup] = useState('All');
  const [catalogSize, setCatalogSize] = useState('8ml');
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState('fallback');

  useEffect(() => {
    let active = true;
    fetch('/api/products').then((response) => {
      if (!response.ok) throw new Error('Products unavailable');
      return response.json();
    }).then((data) => {
      if (!active) return;
      const items = Array.isArray(data) ? data : data.products;
      if (Array.isArray(items) && items.length) { setProducts(items.map(normalizeProduct)); setApiStatus('live'); }
    }).catch(() => { if (active) setApiStatus('fallback'); });
    return () => { active = false; };
  }, []);

  const scentGroups = useMemo(() => ['All', ...new Set(products.map((product) => product.scentGroup).filter(Boolean))], [products]);
  const filteredProducts = useMemo(() => products.filter((product) => {
    const searchable = `${product.name} ${product.brand} ${product.code}`.toLowerCase();
    return (gender === 'All' || product.gender === gender) && (scentGroup === 'All' || product.scentGroup === scentGroup) && searchable.includes(query.toLowerCase());
  }), [products, gender, scentGroup, query]);
  const catalogVariants = useMemo(() => products.map((product) => variantFor(product, catalogSize)), [products, catalogSize]);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);

  function addToCart(product, size = '8ml') {
    const variant = variantFor(product, size);
    if (!variant.stock) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === variant.id && item.size === size);
      return existing ? current.map((item) => item.id === variant.id && item.size === size ? { ...item, quantity: Math.min(item.quantity + 1, variant.stock) } : item) : [...current, { ...variant, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function updateQuantity(id, delta, size) {
    setCart((current) => current.flatMap((item) => item.id !== id || item.size !== size ? [item] : item.quantity + delta <= 0 ? [] : [{ ...item, quantity: Math.min(item.quantity + delta, item.stock) }]));
  }

  return <>
    <header className="site-header"><a className="brand" href="#top"><span className="brand-mark">S</span><span>SANSIRO <em>PERFUMES</em></span></a><nav><a href="#catalog">Catalog</a><a href="#about">Find your scent</a></nav><button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Open cart"><ShoppingBag size={19} /><span>Bag</span>{cartCount > 0 && <b>{cartCount}</b>}</button></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><p className="eyebrow"><Sparkles size={15} /> Small bottles, lasting impressions</p><h1>Wear the room<br /><i>before you enter.</i></h1><p className="hero-text">Curated fragrance oils inspired by the world's most memorable scents. Find your signature for just <strong>KSh 350.</strong></p><a className="hero-link" href="#catalog">Explore the collection <ArrowRight size={16} /></a></div><div className="hero-art"><img src="/male-perfumes.jpg" alt="Sansiro black-cap perfume collection" /><div className="art-note">EST. 2024<br /><small>NAIROBI</small></div></div></section>
      <section className="catalog-section" id="catalog"><div className="section-heading"><div><p className="eyebrow">The collection</p><h2>{catalogSize} collection</h2></div><span className="api-note">{apiStatus === 'live' ? <><Check size={14} /> Live collection</> : 'Curated collection'}</span></div>
        <div className="toolbar"><div className="size-switch" aria-label="Choose bottle size"><span>Size</span><button className={catalogSize === '8ml' ? 'active' : ''} onClick={() => setCatalogSize('8ml')}>8ml <small>KSh 350</small></button><button className={catalogSize === '15ml' ? 'active' : ''} onClick={() => setCatalogSize('15ml')}>15ml <small>KSh 500</small></button></div><div className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search scent, brand or code" /></div><div className="filter-pills"><button className={gender === 'All' ? 'active' : ''} onClick={() => setGender('All')}>All scents</button><button className={gender === 'Men' ? 'active' : ''} onClick={() => setGender('Men')}>For men</button><button className={gender === 'Women' ? 'active' : ''} onClick={() => setGender('Women')}>For ladies</button></div><label className="select-wrap"><Filter size={15} /><select value={scentGroup} onChange={(event) => setScentGroup(event.target.value)}>{scentGroups.map((group) => <option key={group} value={group}>{group === 'All' ? 'All scent families' : group}</option>)}</select><ChevronDown size={15} /></label></div>
        {filteredProducts.length === 0 ? <EmptyState kind="filter" reset={() => { setGender('All'); setScentGroup('All'); setQuery(''); }} /> : <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={catalogVariants.find((variant) => variant.id === product.id)} onOpen={() => setSelected({ ...product, initialSize: catalogSize })} onAdd={() => addToCart(product, catalogSize)} />)}</div>}
      </section>
      <section className="contact-strip" id="about"><div><p className="eyebrow">Visit us in person</p><h2>Let your nose<br />make the choice.</h2></div><div className="contact-details"><p>Star Mall, Shop B11</p><p><a href="tel:0719712242">0719 712 242</a> <span>/</span> <a href="tel:0745549558">0745 549 558</a></p><p>@sansiroperfumes</p></div></section>
    </main>
    {selected && <ProductModal product={selected} close={() => setSelected(null)} add={(size) => { addToCart(selected, size); setSelected(null); }} />}
    {cartOpen && <CartDrawer cart={cart} total={cartTotal} close={() => setCartOpen(false)} update={updateQuantity} />}
  </>;
}

function ProductCard({ product, onOpen, onAdd }) { const unavailable = product.stock <= 0; const genderClass = product.gender.toLowerCase() === 'women' ? 'women' : 'men'; const image = product.image; return <article className={`product-card ${genderClass} ${unavailable ? 'unavailable' : ''}`}><button className="product-visual" onClick={onOpen} aria-label={`View ${product.name}`}><img src={image} alt="" /><span className="code">{product.code}</span><span className="zoom">View details <ArrowRight size={13} /></span></button><div className="card-body"><div><p className="product-brand">{product.brand}</p><h3>{product.name}</h3></div><span className={`stock-badge ${unavailable ? 'out' : product.stock < 5 ? 'low' : ''}`}>{unavailable ? 'Out of stock' : product.stock < 5 ? 'Only a few left' : 'In stock'}</span><div className="card-footer"><strong>KSh {product.price.toLocaleString()}</strong><button className="add-button" disabled={unavailable} onClick={onAdd}>{unavailable ? 'Unavailable' : `Add ${product.size}`}</button></div></div></article> }
function EmptyState({ kind, reset }) { return <div className="empty-state"><div className="empty-icon">{kind === 'stock' ? <CircleHelp size={24} /> : <Search size={24} />}</div><h3>{kind === 'stock' ? 'The shelves are taking a breather.' : 'No scents found.'}</h3><p>{kind === 'stock' ? 'Everything is currently sold out. Check back soon for a fresh delivery.' : 'Try another search or clear the filters to see the full collection.'}</p>{kind !== 'stock' && <button onClick={reset}>Clear filters</button>}</div> }
function ProductModal({ product, close, add }) { const [size, setSize] = useState(product.initialSize || '8ml'); const variant = variantFor(product, size); const genderClass = product.gender.toLowerCase() === 'women' ? 'women' : 'men'; return <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && close()}><div className={`modal ${genderClass}`}><button className="close-button" onClick={close} aria-label="Close details"><X size={19} /></button><div className="modal-visual"><img src={variant.image} alt={`${product.gender} Sansiro perfume collection`} /><span className="code">{product.code}</span></div><div className="modal-copy"><p className="eyebrow">{product.gender} / {product.scentGroup}</p><h2>{product.name}</h2><p className="modal-brand">Inspired by {product.brand}</p><p className="modal-description">{product.description}</p><div className="size-options"><span>Choose size</span><div><button className={size === '8ml' ? 'selected' : ''} onClick={() => setSize('8ml')}>8ml · KSh {product.price8ml}</button><button className={size === '15ml' ? 'selected' : ''} onClick={() => setSize('15ml')}>15ml · KSh {product.price15ml}</button></div></div><div className="modal-meta"><span>{variant.size} perfume oil</span><span>{variant.stock > 0 ? `${variant.stock} available` : 'Currently unavailable'}</span></div><div className="modal-buy"><strong>KSh {variant.price.toLocaleString()}</strong><button disabled={!variant.stock} onClick={() => add(size)}>{variant.stock ? `Add ${size}` : 'Out of stock'}</button></div></div></div></div> }
function CartDrawer({ cart, total, close, update }) { return <div className="overlay cart-overlay" onMouseDown={(event) => event.target === event.currentTarget && close()}><aside className="cart-drawer"><div className="drawer-head"><div><p className="eyebrow">Your selection</p><h2>Shopping bag</h2></div><button className="close-button" onClick={close} aria-label="Close cart"><X size={19} /></button></div>{cart.length === 0 ? <div className="drawer-empty"><ShoppingBag size={30} /><h3>Your bag is waiting.</h3><p>Add a scent and it will appear here.</p><button onClick={close}>Browse collection</button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={`${item.id}-${item.size}`}><div className="cart-thumb"><span>{item.code}</span></div><div className="cart-item-info"><strong>{item.name}</strong><small>{item.size} / {item.brand} / KSh {item.price}</small><div className="quantity"><button onClick={() => update(item.id, -1, item.size)} aria-label="Decrease quantity"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => update(item.id, 1, item.size)} aria-label="Increase quantity"><Plus size={13} /></button></div></div><b>KSh {(item.price * item.quantity).toLocaleString()}</b></div>)}</div><div className="drawer-total"><span>Total</span><strong>KSh {total.toLocaleString()}</strong></div><a className="checkout" href={`https://wa.me/254719712242?text=${encodeURIComponent(`Hello Sansiro, I would like to order: ${cart.map((item) => `${item.quantity} x ${item.name} (${item.size})`).join(', ')}. Total KSh ${total}.`)}`} target="_blank" rel="noreferrer">Order on WhatsApp <ArrowRight size={16} /></a></>}</aside></div> }

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
