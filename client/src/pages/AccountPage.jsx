import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  Crown,
  MapPin,
  Sparkles,
  ShieldCheck,
  Check,
  LogOut,
  Plus,
  Trash2,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { formatPrice, formatDate } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { ProductCard } from '../components/product/ProductCard';

export const AccountPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders'; // 'orders' | 'vip' | 'wishlist' | 'addresses' | 'profile'
  const navigate = useNavigate();

  const { user, logout, updateUser } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();

  const [orders, setOrders] = useState([]);
  const [vipData, setVipData] = useState(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Address modal form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrRecipient, setAddrRecipient] = useState(user?.name || '');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrApartment, setAddrApartment] = useState('');
  const [addrCity, setAddrCity] = useState('Karachi');
  const [addrPostal, setAddrPostal] = useState('');

  // Profile update form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    // Fetch orders
    setIsLoadingOrders(true);
    api
      .get('/orders/my-orders')
      .then((res) => {
        if (res?.orders) setOrders(res.orders);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingOrders(false));

    // Fetch VIP status
    api
      .get('/users/vip-status')
      .then((res) => {
        if (res?.vip) setVipData(res.vip);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/addresses', {
        label: addrLabel,
        recipientName: addrRecipient,
        phone: addrPhone,
        streetAddress: addrStreet,
        apartment: addrApartment,
        city: addrCity,
        postalCode: addrPostal,
        isDefault: user?.addresses?.length === 0,
      });
      if (res?.addresses) {
        updateUser({ addresses: res.addresses });
        setShowAddressForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const res = await api.delete(`/users/addresses/${addressId}`);
      if (res?.addresses) {
        updateUser({ addresses: res.addresses });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', {
        name: profileName,
        phone: profilePhone,
      });
      if (res?.user) {
        updateUser(res.user);
        setProfileMsg('Profile updated successfully.');
        setTimeout(() => setProfileMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Client Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-sm border border-charcoal-200/70 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-3xl font-medium text-charcoal-900">{user?.name}</h1>
            {user?.tier && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gold-light/60 border border-gold-vip/40 text-gold-dark text-[11px] font-semibold uppercase tracking-wider">
                <Crown className="h-3 w-3 text-gold-vip" />
                <span>{user.tier} VIP</span>
              </span>
            )}
          </div>
          <p className="text-xs text-charcoal-500 font-light">
            {user?.email} · Lifetime Spend: {formatPrice(user?.lifetimeSpend || 0)}
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="p-3 bg-ivory-100 rounded-sm border border-charcoal-200 text-center flex-1 md:flex-none md:min-w-[120px]">
            <span className="text-[10px] uppercase tracking-wider text-charcoal-400 block">Privilege Points</span>
            <span className="font-serif text-xl font-bold text-charcoal-900">
              {user?.loyaltyPoints?.toLocaleString() || 100}
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center space-x-1 text-xs text-charcoal-500 hover:text-red-600 transition-colors px-3 py-2 border border-charcoal-200 rounded-sm bg-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-charcoal-200/80 flex space-x-6 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => handleTabChange('orders')}
          className={`pb-3 border-b-2 transition-all whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'orders'
              ? 'border-charcoal-900 text-charcoal-900 font-bold'
              : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('vip')}
          className={`pb-3 border-b-2 transition-all whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'vip'
              ? 'border-gold-vip text-gold-dark font-bold'
              : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
          }`}
        >
          <Crown className="h-4 w-4 text-gold-vip" />
          <span>VIP Privilege Club</span>
        </button>

        <button
          onClick={() => handleTabChange('wishlist')}
          className={`pb-3 border-b-2 transition-all whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'wishlist'
              ? 'border-charcoal-900 text-charcoal-900 font-bold'
              : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
          }`}
        >
          <Heart className="h-4 w-4" />
          <span>Private Wishlist ({wishlistItems.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('addresses')}
          className={`pb-3 border-b-2 transition-all whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'addresses'
              ? 'border-charcoal-900 text-charcoal-900 font-bold'
              : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Address Book</span>
        </button>

        <button
          onClick={() => handleTabChange('profile')}
          className={`pb-3 border-b-2 transition-all whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'profile'
              ? 'border-charcoal-900 text-charcoal-900 font-bold'
              : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {isLoadingOrders ? (
            <p className="text-xs text-charcoal-500 py-6">Retrieving your orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-sm border border-charcoal-200 p-8 space-y-3">
              <p className="font-serif text-2xl text-charcoal-500 italic">No orders placed yet.</p>
              <p className="text-xs text-charcoal-400">Discover our signature silk and lace pieces.</p>
              <Link to="/shop">
                <Button size="sm">Explore Atelier</Button>
              </Link>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord._id}
                className="bg-white rounded-sm border border-charcoal-200/70 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-charcoal-100 pb-3 gap-2">
                  <div>
                    <span className="font-serif text-lg font-bold text-charcoal-900 tracking-wider">
                      {ord.orderNumber}
                    </span>
                    <span className="text-xs text-charcoal-400 ml-3">
                      Placed on {formatDate(ord.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        ord.orderStatus === 'Delivered'
                          ? 'success'
                          : ord.orderStatus === 'Cancelled'
                          ? 'alert'
                          : 'gold'
                      }
                    >
                      {ord.orderStatus}
                    </Badge>

                    <Link to={`/track?order=${ord.orderNumber}`}>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px]">
                        Track Parcel
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="divide-y divide-charcoal-100">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-16 object-cover rounded-sm border"
                        />
                        <div>
                          <p className="font-medium text-charcoal-900">{item.title}</p>
                          <p className="text-[11px] text-charcoal-500">
                            Size: {item.variant.size} · Color: {item.variant.color} · Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-charcoal-900">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-charcoal-100 text-xs">
                  <span className="text-charcoal-500">
                    Payment Method: <strong>{ord.paymentMethod}</strong> ({ord.paymentStatus})
                  </span>
                  <div className="text-right">
                    <span className="text-charcoal-500 mr-2">Total Amount:</span>
                    <strong className="text-base text-charcoal-900">{formatPrice(ord.total)}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: VIP Dashboard */}
      {activeTab === 'vip' && (
        <div className="space-y-8">
          {/* Tier Overview Card */}
          <div className="p-8 rounded-sm bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-berry-dark text-white border border-gold-vip/50 shadow-luxury space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold-vip block">
                  Current Privilege Status
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-normal text-white flex items-center space-x-2 mt-1">
                  <Crown className="h-7 w-7 text-gold-vip" />
                  <span>{vipData?.tier || user?.tier || 'Silver'} Cardholder</span>
                </h3>
              </div>

              <div className="bg-white/10 border border-gold-vip/40 px-5 py-3 rounded-sm text-center">
                <span className="text-[10px] uppercase tracking-wider text-ivory-300 block">Privilege Points Balance</span>
                <span className="font-serif text-2xl font-bold text-gold-vip">
                  {vipData?.points?.toLocaleString() || user?.loyaltyPoints || 100}
                </span>
              </div>
            </div>

            {/* Progress to next tier */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-ivory-300">
                <span>
                  {vipData?.amountNeeded > 0 ? (
                    <>
                      Spend <strong>{formatPrice(vipData.amountNeeded)}</strong> more to reach <strong>{vipData.nextTier}</strong>
                    </>
                  ) : (
                    <span>You hold the highest tier in the Privé Society.</span>
                  )}
                </span>
                <span className="font-semibold text-gold-vip">{vipData?.progressPercentage || 0}%</span>
              </div>
              <div className="w-full h-2 bg-charcoal-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-accent via-gold-vip to-amber-300 rounded-full transition-all duration-700"
                  style={{ width: `${vipData?.progressPercentage || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tier Perks Comparison Table */}
          <div className="bg-white rounded-sm border border-charcoal-200/70 p-6 shadow-soft space-y-4">
            <h4 className="font-serif text-xl font-medium text-charcoal-900">
              Privé Society Tier Privileges
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Privilege</th>
                    <th className="py-3 px-4">Silver (PKR 0+)</th>
                    <th className="py-3 px-4 text-rose-deep font-bold">Rose Gold (PKR 25k+)</th>
                    <th className="py-3 px-4 text-gold-dark font-bold">Black Card (PKR 60k+)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100 text-charcoal-700">
                  <tr>
                    <td className="py-3 px-4 font-medium">Complimentary Nationwide Shipping</td>
                    <td className="py-3 px-4">Over PKR 3,500</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Always Free</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Always Free (Same-day Express)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Secret Drop Early Access</td>
                    <td className="py-3 px-4">Standard</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">12 Hours Early</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">24 Hours Early</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">WhatsApp Atelier Concierge</td>
                    <td className="py-3 px-4">—</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Direct Access</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Dedicated Stylist</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Private Birthday Privilege</td>
                    <td className="py-3 px-4">10% Off</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">20% Off</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">25% Off + Silk Gift</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">VIP Code VIPPRIVILEGE (20% Off)</td>
                    <td className="py-3 px-4 text-charcoal-300">Locked</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Unlocked</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Unlocked</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-sm border border-charcoal-200 p-8 space-y-3">
              <p className="font-serif text-2xl text-charcoal-500 italic">Your wishlist is empty.</p>
              <p className="text-xs text-charcoal-400">Save pieces you adore for quiet contemplation.</p>
              <Link to="/shop">
                <Button size="sm">Browse Collections</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {wishlistItems.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-2xl font-medium text-charcoal-900">Saved Addresses</h3>
            <Button
              onClick={() => setShowAddressForm(!showAddressForm)}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Address</span>
            </Button>
          </div>

          {/* New address form */}
          {showAddressForm && (
            <div className="bg-white p-6 rounded-sm border border-charcoal-200/80 shadow-soft">
              <form onSubmit={handleAddAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Address Label"
                    value={addrLabel}
                    onChange={(e) => setAddrLabel(e.target.value)}
                    placeholder="Home / Office / Residence"
                  />
                  <Input
                    label="Recipient Name *"
                    required
                    value={addrRecipient}
                    onChange={(e) => setAddrRecipient(e.target.value)}
                  />
                  <Input
                    label="Mobile Phone *"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                  />
                  <div>
                    <label className="block text-[11px] font-medium tracking-wider uppercase text-charcoal-600 mb-1">
                      City *
                    </label>
                    <select
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-charcoal-200 rounded-sm text-sm"
                    >
                      {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Multan', 'Quetta'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Street Address *"
                      required
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Apartment / Suite"
                      value={addrApartment}
                      onChange={(e) => setAddrApartment(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="default">
                    Save Address
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddressForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Addresses list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user?.addresses?.map((addr) => (
              <div
                key={addr._id}
                className="bg-white p-5 rounded-sm border border-charcoal-200/70 shadow-sm space-y-2 relative"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs text-charcoal-900 uppercase tracking-wider">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-charcoal-900 text-ivory-50 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-charcoal-900">{addr.recipientName}</p>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {addr.streetAddress} {addr.apartment || ''}<br />
                  {addr.city}, Pakistan<br />
                  Phone: {addr.phone}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="text-[11px] text-red-600 hover:underline flex items-center space-x-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white p-6 sm:p-8 rounded-sm border border-charcoal-200/70 shadow-soft space-y-4">
          <h3 className="font-serif text-xl font-medium text-charcoal-900">Personal Information</h3>
          {profileMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-sm border border-emerald-200">
              {profileMsg}
            </div>
          )}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
            <Input
              label="Email Address (Locked)"
              disabled
              value={user?.email || ''}
            />
            <Input
              label="Mobile Phone"
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
            />
            <Button type="submit" size="default">
              Update Profile
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
