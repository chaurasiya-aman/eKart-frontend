import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
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

  const userId = useSelector((state) => state.user.user?._id);
  const userEmail = useSelector((state) => state.user.user?.email);
  const accessToken = localStorage.getItem("accessToken");
  let [isUpdate, setIsUpdate] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      setIsUpdate(true);
      e.preventDefault();

      const res = await api.put(
        `${API_URL}/api/v1/user/profile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Profile updated successfully");
        onProfileUpdated();
        type("profile");
      }
    } catch (error) {
      console.log(error);
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
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          placeholder="About Section"
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
          placeholder="johndoe@gmail.com"
          value={userEmail}
          disabled
          className="cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          type="tel"
          inputMode="numeric"
          value={formData.phoneNo}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setFormData({ ...formData, phoneNo: value });
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <Button type="submit" className="w-full cursor-pointer">
        {isUpdate ? (
          <Loader2 className="animate-spin w-8 h-8 text-white-500" />
        ) : (
          <>Update Profile</>
        )}
      </Button>
    </form>
  );
};

export default EditProfile;
