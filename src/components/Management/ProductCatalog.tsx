import { useState, useEffect } from 'react';
import {
  Package, Search, X, Tag, ShoppingCart, Check, Star,
  MessageSquare, Phone, Video, Bot, Mail, Zap, Filter,
  TrendingUp, Award, Users, Globe, Shield, Sparkles,
  ChevronRight, Info, ArrowRight
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: 'active' | 'inactive';
  features: string[];
}

interface ProductTier {
  id: string;
  product_id: string;
  tier_name: 'Basic' | 'Standard' | 'Premium' | 'Enterprise';
  tier_sku: string;
  description: string;
  price: number;
  price_unit: string;
  setup_fee: number;
  features: Record<string, any>;
  max_users: number | null;
  max_volume: number | null;
  support_level: string;
  is_popular: boolean;
  sort_order: number;
}

interface ProductWithTiers extends Product {
  tiers: ProductTier[];
}

export default function ProductCatalog() {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductWithTiers[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithTiers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'All', name: 'All Products', icon: Package, color: 'green' },
    { id: 'Messaging', name: 'Messaging', icon: MessageSquare, color: 'green' },
    { id: 'Voice', name: 'Voice & Calling', icon: Phone, color: 'green' },
    { id: 'Video', name: 'Video', icon: Video, color: 'green' },
    { id: 'Bot', name: 'AI & Bots', icon: Bot, color: 'green' },
    { id: 'Social', name: 'Social', icon: Users, color: 'green' }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const { data: productsData, error: productsError } = await db
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (productsError) throw productsError;

      const { data: tiersData, error: tiersError } = await db
        .from('product_tiers')
        .select('*')
        .order('sort_order');

      if (tiersError) throw tiersError;

      const productsWithTiers: ProductWithTiers[] = (productsData || []).map((product: any) => {
        let parsedFeatures = [];
        try {
          parsedFeatures = typeof product.features === 'string' ? JSON.parse(product.features) : product.features;
        } catch (e) {
          console.error("Failed to parse product features", e);
        }

        return {
          ...product,
          features: Array.isArray(parsedFeatures) ? parsedFeatures : [],
          tiers: (tiersData || []).filter((tier: any) => tier.product_id === product.id).map((tier: any) => {
            let parsedTierFeatures = {};
            try {
              parsedTierFeatures = typeof tier.features === 'string' ? JSON.parse(tier.features) : tier.features;
            } catch (e) {
              console.error("Failed to parse tier features", e);
            }
            return { ...tier, features: parsedTierFeatures };
          }),
        };
      });

      setProducts(productsWithTiers);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: ProductWithTiers, tier: ProductTier) => {
    if (!user) {
      setNotification({
        type: 'error',
        message: 'Please log in to add items to cart'
      });
      return;
    }

    setAddingToCart(tier.id);

    try {
      const totalPrice = Number(tier.price) + Number(tier.setup_fee);

      const { error } = await db
        .from('cart_items')
        .insert({
          user_id: user.id,
          item_type: 'product_tier',
          item_data: JSON.stringify({
            product_name: product.name,
            product_sku: product.sku,
            tier_name: tier.tier_name,
            tier_sku: tier.tier_sku,
            description: tier.description,
            price: tier.price,
            setup_fee: tier.setup_fee,
            price_unit: tier.price_unit,
            features: tier.features,
            support_level: tier.support_level
          }),
          quantity: 1,
          unit_price: totalPrice,
          total_price: totalPrice
        });

      if (error) throw error;

      setNotification({
        type: 'success',
        message: `${product.name} (${tier.tier_name}) added to cart`
      });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to add to cart'
      });
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Messaging': return 'from-[#39FF14]/20 to-[#32e012]/10 border-[#39FF14]/30';
      case 'Social': return 'from-[#39FF14]/20 to-[#32e012]/10 border-[#39FF14]/20';
      case 'Voice': return 'from-[#39FF14]/20 to-[#32e012]/10 border-[#39FF14]/30';
      case 'Video': return 'from-[#39FF14]/20 to-[#32e012]/10 border-[#39FF14]/30';
      case 'Bot': return 'from-[#39FF14]/20 to-[#32e012]/10 border-[#39FF14]/30';
      default: return 'from-slate-500/20 to-slate-600/20 border-slate-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    return 'text-brand-lime';
  };

  const getTierBadgeColor = (tierName: string) => {
    switch (tierName) {
      case 'Basic': return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
      case 'Standard': return 'bg-[#39FF14]/20/20 text-[#39FF14] border-[#39FF14]/50';
      case 'Premium': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/50';
      case 'Enterprise': return 'bg-gradient-to-r from-[#39FF14]/20 to-[#32e012]/20 text-[#39FF14] border-[#39FF14]/50';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  const formatPrice = (price: number, unit: string) => {
    if (unit === 'month') {
      return `RM ${price.toFixed(2)}/mo`;
    }
    return `RM ${price.toFixed(4)}/${unit}`;
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || Package;
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-[#012419] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-[#012419] to-[#0B1120]">
      {/* Left Sidebar - Glassy Filter Panel */}
      <div className="w-80 bg-white/[0.02] backdrop-blur-xl border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white mb-1">Marketplace</h2>
          <p className="text-sm text-slate-400">Browse and manage resources</p>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
           {/* Search Input */}
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#39FF14] transition-colors" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]/50 focus:bg-slate-900/80 transition-all shadow-inner"
              />
               {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
           </div>

           {/* Categories */}
           <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Categories</h3>
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#39FF14]/20 to-[#32e012]/10 text-[#39FF14] border border-[#39FF14]/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 hover:border hover:border-white/5 border border-transparent'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md ${isActive ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-white/5 text-slate-400 group-hover:text-white'}`}>
                       <Icon className="w-4 h-4" />
                    </div>
                    {category.name}
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto text-[#39FF14]/70" />}
                  </button>
                );
              })}
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header Stats */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Product Catalog</h1>
              <p className="text-slate-400">
                Showing <span className="text-[#39FF14] font-semibold">{filteredProducts.length}</span> available solutions
              </p>
            </div>
            
             <div className="flex gap-3">
                 <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></div>
                    <span className="text-sm text-slate-300">System Online</span>
                 </div>
             </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const Icon = getCategoryIcon(product.category);
              return (
                <div
                  key={product.id}
                  className="group relative bg-[#0B1525]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#39FF14]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#39FF14]/5 hover:-translate-y-1"
                  onClick={() => setSelectedProduct(product)}
                >
                   {/* Glass Gradient Overlay on Hover */}
                   <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/5 to-[#32e012]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  {/* Card Header */}
                  <div className="p-6 border-b border-white/5 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                        <Icon className={`w-8 h-8 ${getCategoryColor(product.category)}`} />
                      </div>
                      <span className="px-2.5 py-1 bg-white/5 text-slate-400 text-xs font-medium rounded-full border border-white/5">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#39FF14] transition-colors tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed h-10">{product.description}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 bg-black/20 relative z-10">
                     <div className="flex items-center gap-2 mb-4">
                        <Tag className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs font-mono text-slate-500">{product.sku}</span>
                      </div>

                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-sm text-slate-400 font-medium">From</span>
                      <span className="text-2xl font-bold text-white tracking-tight">
                        {product.tiers.length > 0 ? formatPrice(product.tiers[0].price, product.tiers[0].price_unit) : 'N/A'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="w-full bg-white/5 hover:bg-[#39FF14]/20 hover:text-[#39FF14] border border-white/10 hover:border-[#39FF14]/30 text-slate-300 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    
                    {/* Tier Dots */}
                     <div className="mt-4 flex items-center justify-center gap-1.5 opacity-50">
                        {product.tiers.map((_, i) => (
                           <div key={i} className={`w-1.5 h-1.5 rounded-full ${i===0 ? 'bg-[#39FF14]' : 'bg-slate-600'}`}></div>
                        ))}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
              <p className="text-slate-400 max-w-md text-center mb-8">
                We couldn't find any items matching "{searchQuery}". Try refining your search or changing categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#39FF14]/5"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-7xl w-full my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`bg-gradient-to-br ${getCategoryGradient(selectedProduct.category)} border-b border-slate-700 p-8 sticky top-0 z-10`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-4 bg-slate-800/50 rounded-xl border border-slate-700/50`}>
                    {(() => {
                      const Icon = getCategoryIcon(selectedProduct.category);
                      return <Icon className={`w-10 h-10 ${getCategoryColor(selectedProduct.category)}`} />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-4xl font-bold text-white">{selectedProduct.name}</h2>
                      <span className="px-3 py-1 bg-slate-900/50 text-slate-300 text-sm font-medium rounded-full border border-slate-700">
                        {selectedProduct.category}
                      </span>
                    </div>
                    <p className="text-slate-300 text-lg mb-3">{selectedProduct.description}</p>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-mono text-slate-400">{selectedProduct.sku}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Pricing Tiers */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-[#39FF14]" />
                Choose Your Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {selectedProduct.tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`relative bg-slate-800/50 border-2 rounded-2xl p-6 transition-all hover:scale-105 ${
                      tier.is_popular
                        ? 'border-[#39FF14] shadow-lg shadow-[#39FF14]/20'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {/* Popular Badge */}
                    {tier.is_popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="bg-gradient-to-r from-[#39FF14] to-[#32e012] text-black text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                          <Star className="w-3 h-3 fill-current" />
                          MOST POPULAR
                        </div>
                      </div>
                    )}

                    {/* Tier Header */}
                    <div className="mb-6">
                      <div className={`inline-block px-3 py-1.5 rounded-lg text-sm font-bold mb-4 border ${getTierBadgeColor(tier.tier_name)}`}>
                        {tier.tier_name}
                      </div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-white">
                          RM {tier.price.toFixed(2)}
                        </span>
                        <span className="text-slate-400">/{tier.price_unit}</span>
                      </div>
                      {tier.setup_fee > 0 && (
                        <p className="text-sm text-slate-400">+ RM {tier.setup_fee.toFixed(2)} setup fee</p>
                      )}
                      <p className="text-sm text-slate-300 mt-3 min-h-[40px]">{tier.description}</p>
                    </div>

                    {/* Features */}
                    <div className="mb-6 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-[#39FF14] flex-shrink-0" />
                        <span className="text-slate-300">{tier.support_level} Support</span>
                      </div>
                      {tier.max_users && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-[#39FF14] flex-shrink-0" />
                          <span className="text-slate-300">Up to {tier.max_users.toLocaleString()} users</span>
                        </div>
                      )}
                      {tier.max_volume && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300">{tier.max_volume.toLocaleString()} volume</span>
                        </div>
                      )}
                      {tier.features && Object.entries(tier.features).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {
                              typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value.toString()
                            }
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => addToCart(selectedProduct, tier)}
                      disabled={addingToCart === tier.id}
                      className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        tier.is_popular
                          ? 'bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black shadow-lg shadow-[#39FF14]/20'
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {addingToCart === tier.id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Buy Now
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-8 bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-[#39FF14] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Need help choosing?</h4>
                    <p className="text-slate-300 text-sm mb-3">
                      Our sales team can help you find the perfect plan for your business needs.
                    </p>
                    <button className="bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`${
            notification.type === 'success' ? 'bg-[#39FF14]/20 border-[#39FF14]/50' : 'bg-red-500/20 border-red-500/50'
          } border backdrop-blur-sm rounded-xl p-4 max-w-md shadow-xl`}>
            <div className="flex items-start gap-3">
              <div className={`${
                notification.type === 'success' ? 'bg-[#39FF14]' : 'bg-red-500'
              } rounded-full p-1`}>
                {notification.type === 'success' ? (
                  <Check className="w-5 h-5 text-black" />
                ) : (
                  <X className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${notification.type === 'success' ? 'text-[#39FF14]' : 'text-red-400'}`}>
                  {notification.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className="text-white text-sm mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
