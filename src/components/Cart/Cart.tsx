import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Phone, Server, CreditCard, ArrowLeft, Check } from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';

interface CartItem {
  id: string;
  item_type: string;
  item_data: any;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

interface CartProps {
  onNavigate: (page: string) => void;
}

interface PaymentMethod {
  id: string;
  card_type: string;
  last_four: string;
  is_primary: boolean;
}

export default function Cart({ onNavigate }: CartProps) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      loadCartItems();
      loadPaymentMethod();
    }
  }, [user]);

  const loadPaymentMethod = async () => {
    const { data, error } = await db
      .from('payment_methods')
      .select('*')
      .eq('user_id', user?.id)
      .eq('is_primary', true)
      .maybeSingle();

    if (error) {
      console.error('Error loading payment method:', error);
      return;
    }

    if (data) {
      console.log('Loaded payment method:', data);
      setPaymentMethod(data);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadCartItems = async () => {
    setLoading(true);
    const { data, error } = await db
      .from('cart_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Handle SQLite stringified JSON
      const parsedData = data.map((item: any) => ({
        ...item,
        item_data: typeof item.item_data === 'string' 
          ? JSON.parse(item.item_data) 
          : item.item_data
      }));
      setCartItems(parsedData);
    }
    setLoading(false);
  };

  const removeItem = async (itemId: string) => {
    const { error } = await db
      .from('cart_items')
      .eq('id', itemId)
      .delete();

    if (!error) {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      setNotification({
        type: 'success',
        message: 'Item removed from cart'
      });
    }
  };

  const clearCart = async () => {
    const { error } = await db
      .from('cart_items')
      .eq('user_id', user?.id)
      .delete();

    if (!error) {
      setCartItems([]);
      setNotification({
        type: 'success',
        message: 'Cart cleared'
      });
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || !user) return;

    const { data: paymentMethods } = await db
      .from('payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .limit(1);

    if (!paymentMethods || paymentMethods.length === 0) {
      setNotification({
        type: 'error',
        message: 'Please add a payment method before checking out.'
      });
      setTimeout(() => {
        onNavigate('billing');
      }, 2000);
      return;
    }

    setProcessing(true);

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const subtotal = cartItems.reduce((sum, item) => sum + Number(item.total_price), 0);
    const tax = subtotal * 0.1;
    const totalAmount = subtotal + tax;

    const { data: profileData } = await db
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single();

    const currentBalance = profileData?.balance || 0;
    const newBalance = currentBalance - totalAmount;

    const { error: orderError } = await db
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: 'completed',
        total_amount: totalAmount,
        items: JSON.stringify(cartItems),
        completed_at: new Date().toISOString()
      });

    if (orderError) {
      setNotification({
        type: 'error',
        message: 'Checkout failed. Please try again.'
      });
      setProcessing(false);
      return;
    }

    const { error: transactionError } = await db
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'debit',
        amount: -totalAmount,
        balance_after: newBalance,
        description: `Order ${orderNumber}`,
        reference: orderNumber,
        metadata: JSON.stringify({
          items: cartItems.map(item => ({
            type: item.item_type,
            name: getItemTitle(item),
            quantity: item.quantity,
            price: item.unit_price
          }))
        })
      });

    if (transactionError) {
      console.error('Failed to create transaction:', transactionError);
    }

    const { error: balanceError } = await db
      .from('profiles')
      .eq('id', user.id)
      .update({ balance: newBalance });

    if (balanceError) {
      console.error('Failed to update balance:', balanceError);
    }

    for (const item of cartItems) {
      if (item.item_type === 'phone_number') {
        await db
          .from('phone_numbers')
          .insert({
            user_id: user.id,
            phone_number: item.item_data.phone_number,
            country_code: item.item_data.country_code || 'US',
            number_type: item.item_data.number_type,
            status: 'active',
            monthly_cost: item.item_data.monthly_cost,
            setup_cost: item.item_data.setup_cost,
            business_name: '',
            business_location: item.item_data.region,
            capabilities: item.item_data.capabilities || { voice: true, sms: true, mms: false },
            usage_minutes: 0,
            purchased_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          });
      } else if (item.item_type === 'sip_trunk') {
        await db
          .from('sip_trunks')
          .insert({
            user_id: user.id,
            trunk_name: item.item_data.trunk_name,
            trunk_type: item.item_data.trunk_type,
            status: 'active',
            concurrent_channels: item.item_data.concurrent_channels,
            monthly_cost: item.item_data.monthly_cost,
            per_minute_cost: item.item_data.per_minute_cost,
            inbound_enabled: true,
            outbound_enabled: true,
            sip_uri: `sip-${Math.random().toString(36).substring(7)}.example.com:5060`,
            auth_username: `user_${user.id.substring(0, 8)}`,
            regions: item.item_data.regions || ['US', 'CA'],
            purchased_at: new Date().toISOString()
          });
      } else if (item.item_type === 'product_tier') {
        const billingCycle = item.item_data.billing_cycle || 'monthly';
        const daysToAdd = billingCycle === 'monthly' ? 30 : billingCycle === 'quarterly' ? 90 : 365;
        const licenseKey = `${item.item_data.product_name.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        // 1. Insert into user_subscriptions (for overall management)
        await db
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            product_id: item.item_data.product_id,
            product_name: item.item_data.product_name,
            status: 'active',
            billing_cycle: billingCycle,
            amount: item.unit_price,
            currency: 'MYR',
            started_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString(),
            auto_renew: true,
            usage_count: 0,
            usage_limit: item.item_data.usage_limit || 10000,
            license_key: licenseKey,
            license_type: item.item_data.tier_name.toLowerCase(),
            max_users: item.item_data.max_users || 5,
            features: JSON.stringify(item.item_data.features || {}),
            metadata: JSON.stringify({
              tier_name: item.item_data.tier_name,
              tier_id: item.item_data.tier_id,
              order_number: orderNumber,
              purchased_at: new Date().toISOString()
            })
          });

        // 2. Insert into api_marketplace_keys (specifically for Marketplace tab)
        // This makes it show up in the "My Subscriptions" tab of the Marketplace
        await db
          .from('api_marketplace_keys')
          .insert({
            user_id: user.id,
            product_id: item.item_data.product_id,
            product_name: item.item_data.product_name,
            key_name: `${item.item_data.product_name} Key`,
            api_key: `mk_${Math.random().toString(36).substring(2, 15)}`,
            environment: 'production',
            status: 'active',
            permissions: JSON.stringify(['read', 'write']),
            usage_limit: item.item_data.usage_limit || 5000,
            usage_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
    }

    await clearCart();

    setNotification({
      type: 'success',
      message: `Order ${orderNumber} completed successfully!`
    });

    setProcessing(false);

    const hasSubscriptionItems = cartItems.some(item => item.item_type === 'product_tier');

    setTimeout(() => {
      if (hasSubscriptionItems) {
        onNavigate('subscriptions');
      } else {
        onNavigate('voice-bot');
      }
    }, 2000);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'phone_number':
        return <Phone className="w-6 h-6 text-brand-lime" />;
      case 'sip_trunk':
        return <Server className="w-6 h-6 text-brand-lime" />;
      case 'product_tier':
        return <ShoppingCart className="w-6 h-6 text-brand-lime" />;
      default:
        return <CreditCard className="w-6 h-6 text-brand-lime" />;
    }
  };

  const getItemTitle = (item: CartItem) => {
    if (item.item_type === 'phone_number') {
      return item.item_data.phone_number;
    } else if (item.item_type === 'sip_trunk') {
      return item.item_data.trunk_name;
    } else if (item.item_type === 'product_tier') {
      return `${item.item_data.product_name} - ${item.item_data.tier_name}`;
    }
    return 'Unknown Item';
  };

  const getItemDescription = (item: CartItem) => {
    if (item.item_type === 'phone_number') {
      return `${item.item_data.region} • ${item.item_data.number_type}`;
    } else if (item.item_type === 'sip_trunk') {
      return `${item.item_data.concurrent_channels} channels • ${item.item_data.trunk_type}`;
    } else if (item.item_type === 'product_tier') {
      const setupFee = item.item_data.setup_fee > 0 ? ` + RM ${Number(item.item_data.setup_fee).toFixed(2)} setup` : '';
      return `${item.item_data.description}${setupFee}`;
    }
    return '';
  };

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.total_price), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="flex-1 overflow-auto bg-[#012419]">


      <div className="p-8">
        <button
          onClick={() => onNavigate('product-catalog')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Continue Shopping
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 max-w-md mx-auto">
              <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Your cart is empty</h3>
              <p className="text-slate-400 mb-6">Add items from the marketplace to get started</p>
              <button
                onClick={() => onNavigate('product-catalog')}
                className="bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-lg"
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Cart Items ({cartItems.length})</h2>
                <button
                  onClick={clearCart}
                  className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#39FF14]/20 p-3 rounded-lg">
                      {getItemIcon(item.item_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {getItemTitle(item)}
                      </h3>
                      <p className="text-slate-400 text-sm mb-3">{getItemDescription(item)}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm">Quantity: {item.quantity}</span>
                        <span className="text-slate-400 text-sm">•</span>
                        <span className="text-white font-semibold">RM {Number(item.unit_price).toFixed(2)} each</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white mb-2">
                        RM {Number(item.total_price).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white font-semibold">RM {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tax (10%)</span>
                    <span className="text-white font-semibold">RM {tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex justify-between">
                      <span className="text-white font-bold text-lg">Total</span>
                      <span className="text-white font-bold text-2xl">RM {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {paymentMethod ? (
                  <div className="mb-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="w-5 h-5 text-brand-lime" />
                      <span className="text-slate-400 text-sm">Payment Method</span>
                    </div>
                    <div className="text-white font-medium">
                      {paymentMethod.card_type} ending in {paymentMethod.last_four}
                    </div>
                    <button
                      onClick={() => onNavigate('billing')}
                      className="text-[#39FF14] hover:text-[#39FF14] text-xs mt-2"
                    >
                      Change payment method
                    </button>
                  </div>
                ) : (
                  <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm mb-2">No payment method on file</p>
                    <button
                      onClick={() => onNavigate('billing')}
                      className="text-yellow-400 hover:text-yellow-300 text-xs underline"
                    >
                      Add payment method
                    </button>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={processing || !paymentMethod}
                  className="w-full bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Complete Purchase
                    </>
                  )}
                </button>

                <div className="mt-4 p-4 bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg">
                  <p className="text-[#39FF14] text-xs">
                    Secure checkout • 30-day money-back guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`${
            notification.type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'
          } border backdrop-blur-sm rounded-lg p-4 max-w-md`}>
            <div className="flex items-start gap-3">
              <div className={`${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } rounded-full p-1`}>
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${notification.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {notification.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className="text-white text-sm mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
