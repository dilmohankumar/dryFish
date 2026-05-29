import { useState, useEffect } from "react";
import { userAPI } from "../utils/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [formData, setFormData] = useState({});
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getMe();
      setUser(data.data || data.user);
      setFormData({
        firstName: data.data?.firstName || data.user?.firstName || "",
        lastName: data.data?.lastName || data.user?.lastName || "",
        email: data.data?.email || data.user?.email || "",
        phone: data.data?.phone || data.user?.phone || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      setUser({ ...user, ...formData });
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await userAPI.addAddress(addressForm);
      await loadProfile();
      setShowAddAddress(false);
      setAddressForm({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      });
      alert("Address added successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!user) return <div className="p-8 text-center text-gray-500">No user data</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {/* Profile Section */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-[#1A3A5C] hover:underline"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (Read-only)
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#1A3A5C] text-white rounded-lg hover:bg-[#142d47]"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-semibold">{user.phone || "Not added"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Addresses Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Addresses</h2>
          <button
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="px-4 py-2 bg-[#1A3A5C] text-white rounded-lg hover:bg-[#142d47]"
          >
            {showAddAddress ? "Cancel" : "+ Add Address"}
          </button>
        </div>

        {showAddAddress && (
          <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.zipCode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, zipCode: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={addressForm.country}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Address
              </button>
            </div>
          </form>
        )}

        {user.addresses && user.addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                <p className="font-semibold">{addr.street}</p>
                <p className="text-gray-600 text-sm">
                  {addr.city}, {addr.state} {addr.zipCode}
                </p>
                <p className="text-gray-600 text-sm">{addr.country}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No addresses added yet</p>
        )}
      </div>
    </div>
  );
}
