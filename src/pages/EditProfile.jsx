import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import api from "@/api/axios";

const EditProfile = ({ onProfileUpdated, initialData, type }) => {
  const [formData, setFormData] = useState({
    about: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    zipCode: "",
    city: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);

  const userId = useSelector((state) => state.user.user?._id);
  const userEmail = useSelector((state) => state.user.user?.email);
  const accessToken = localStorage.getItem("accessToken");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdate(true);
      const res = await api.put(
        `${API_URL}/api/v1/user/profile/${userId}`,
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) {
        toast.success("Profile updated successfully");
        onProfileUpdated();
        type("profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdate(false);
    }
  };

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        about: initialData.about || "",
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phoneNo: initialData.phoneNo || "",
        address: initialData.address || "",
        zipCode: initialData.zipCode || "",
        city: initialData.city || "",
      });
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-5 mt-4 px-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">About</Label>
        <Input
          id="about"
          name="about"
          placeholder="Tell us about yourself"
          value={formData.about}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={userEmail}
          disabled
          className="cursor-not-allowed opacity-60"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="10-digit number"
          value={formData.phoneNo}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setFormData((prev) => ({ ...prev, phoneNo: value }));
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          placeholder="Enter your address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip">Zip Code</Label>
          <Input
            id="zip"
            name="zipCode"
            placeholder="Zip code"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isUpdate}>
        {isUpdate ? <Loader2 className="animate-spin w-5 h-5" /> : "Update Profile"}
      </Button>
    </form>
  );
};

export default EditProfile;