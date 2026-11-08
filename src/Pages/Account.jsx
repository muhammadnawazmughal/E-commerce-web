import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, MapPin, Package, Shield, Edit3, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const Account = () => {
  const { user, updateProfile, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    isDefault: false
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setIsEditingProfile(false);
    } catch (err) {
      // toast shown in context
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const existingAddresses = user?.addresses || [];
      const updated = [...existingAddresses, newAddress];
      await updateProfile({ addresses: updated });
      setIsAddingAddress(false);
      setNewAddress({
        fullName: user?.name || '',
        phone: user?.phone || '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        isDefault: false
      });
      showToast('New shipping address saved!', 'success');
    } catch (err) {
      showToast('Failed to save address.', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-luxury-200/80 p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gold shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-noir-900 text-gold flex items-center justify-center font-serif text-2xl font-bold border-2 border-gold">
              {user?.name?.[0] || 'U'}
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-serif text-2xl font-bold text-noir-900">{user?.name}</h1>
            {isAdmin && (
              <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold-dark text-[10px] font-bold uppercase tracking-wider">
                Store Administrator
              </span>
            )}
          </div>
          <p className="text-xs text-luxury-500 font-medium">{user?.email}</p>
          <p className="text-xs text-luxury-500">{user?.phone || 'No phone registered'}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-5 py-2.5 rounded-full border border-luxury-300 text-xs font-semibold uppercase tracking-wider text-noir-900 hover:bg-luxury-100 transition-colors flex items-center gap-2"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          {isAdmin && (
            <Link
              to={ROUTES.ADMIN_DASHBOARD}
              className="px-5 py-2.5 rounded-full bg-noir-900 hover:bg-gold text-white hover:text-noir-900 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2"
            >
              <Shield className="w-3.5 h-3.5 text-gold" />
              <span>Admin Center</span>
            </Link>
          )}
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditingProfile && (
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-luxury-200 p-6 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-noir-900">Edit Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-luxury-700 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full mt-1 bg-[#FAF8F5] border border-luxury-300 rounded-xl px-3.5 py-2 text-xs text-noir-900"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-luxury-700 uppercase">Contact Phone</label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full mt-1 bg-[#FAF8F5] border border-luxury-300 rounded-xl px-3.5 py-2 text-xs text-noir-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-luxury-700 uppercase">Avatar Image URL</label>
              <input
                type="url"
                value={profileData.avatar}
                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                className="w-full mt-1 bg-[#FAF8F5] border border-luxury-300 rounded-xl px-3.5 py-2 text-xs text-noir-900"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 text-xs font-medium text-luxury-600 hover:text-noir-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-noir-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Saved Addresses Section */}
      <div className="bg-white rounded-3xl border border-luxury-200/80 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-luxury-200">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-xl font-bold text-noir-900">
              Saved Delivery Addresses
            </h2>
          </div>
          <button
            onClick={() => setIsAddingAddress(!isAddingAddress)}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-noir-900 hover:text-gold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Address</span>
          </button>
        </div>

        {/* Add Address Form */}
        {isAddingAddress && (
          <form onSubmit={handleAddAddress} className="p-6 bg-[#FAF8F5] rounded-2xl border border-luxury-200 space-y-4">
            <h4 className="font-serif font-bold text-sm text-noir-900">New Address Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                className="bg-white border border-luxury-300 rounded-xl px-3.5 py-2 text-xs"
              />
              <input
                type="text"
                placeholder="Phone Number"
                required
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="bg-white border border-luxury-300 rounded-xl px-3.5 py-2 text-xs"
              />
              <input
                type="text"
                placeholder="Street Address"
                required
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="sm:col-span-2 bg-white border border-luxury-300 rounded-xl px-3.5 py-2 text-xs"
              />
              <input
                type="text"
                placeholder="City"
                required
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="bg-white border border-luxury-300 rounded-xl px-3.5 py-2 text-xs"
              />
              <input
                type="text"
                placeholder="State / Region"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="bg-white border border-luxury-300 rounded-xl px-3.5 py-2 text-xs"
              />
              <input
                type="text"
                placeholder="Postal Code"
                required
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                className="bg-white border border-luxury-300 rounded-xl px-3.5 py-2 text-xs"
              />
              <input
                type="text"
                placeholder="Country"
                required
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                className="bg-white border border-luxury-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="px-4 py-2 text-xs text-luxury-600 hover:text-noir-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-noir-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold transition-colors"
              >
                Save Address
              </button>
            </div>
          </form>
        )}

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user?.addresses && user.addresses.length > 0 ? (
            user.addresses.map((addr, idx) => (
              <div
                key={addr._id || idx}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-luxury-200/80 space-y-1.5 text-xs text-luxury-700 relative"
              >
                <div className="flex items-center justify-between font-bold text-noir-900 text-sm">
                  <span>{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] text-gold font-semibold uppercase">Default</span>
                  )}
                </div>
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                <p>{addr.country}</p>
                <p className="text-luxury-500 pt-1">Phone: {addr.phone}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-luxury-500 italic sm:col-span-2">
              No saved addresses yet. Add one for expedited checkout.
            </p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Account;
