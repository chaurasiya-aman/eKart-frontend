import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, User, Camera, Layers, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import EditProfile from "./EditProfile";
import api from "@/api/axios";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [profileDetails, setProfileDetails] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [typeVal, setTypeVal] = useState("profile");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const profileObj = async () => {
    try {
      const res = await api.get(
        `${API_URL}/api/v1/user/get-user/${user._id}`
      );
      setProfileDetails({ ...res.data.user });
    } catch (error) {
      console.log(error);
    }
  };

  const logOutHandler = async () => {
    try {
      setIsLogout(true);
      const res = await api.post(
        `${API_URL}/api/v1/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => {
          toast.success("Thank You, Visit Again!!!");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      localStorage.removeItem("accessToken");
      dispatch(setUser(null));
      setIsLogout(false);
      navigate("/login");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only images allowed");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const res = await api.put(
        `${API_URL}/api/v1/user/profile/${user?._id}/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setProfileDetails((prev) => ({
        ...prev,
        [e.target.name]: res.data.imageUrl,
      }));

      profileObj();
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Upload failed");
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteProfilePic = async () => {
    try {
      setIsDeleting(true);

      if (profileDetails.profilePicPublicId === "") {
        toast.success("Profile photo is already deleted or not uploaded");
        return;
      }

      await api.delete(
        `${API_URL}/api/v1/user/profile/${user?._id}/delete-profile-pic`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      profileObj();
      toast.success("Profile photo deleted successfully");
    } catch (error) {
      toast.error("Deletion failed");
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggle = () => {
    setTypeVal("edit-profile");
  };

  useEffect(() => {
    if (user?._id) {
      profileObj();
    }
  }, [user]);

  if (!accessToken || !user) {
    return (
      <div className="pt-32 text-center text-gray-600">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen m-2">
      <Tabs
        value={typeVal}
        onValueChange={setTypeVal}
        className="m-auto max-w-[600px]"
      >
        <TabsList className="m-auto">
          <TabsTrigger value="profile" className="cursor-pointer">
            Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="cursor-pointer">
            Orders
          </TabsTrigger>
          <TabsTrigger value="edit-profile" className="cursor-pointer">
            Edit Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="m-auto relative w-24 h-24">
                {isUploading ? (
                  <div className="w-24 h-24 rounded-full border-4 border-blue-100 flex items-center justify-center bg-gray-100">
                    <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                  </div>
                ) : profileDetails?.profilePic ? (
                  <img
                    src={profileDetails.profilePic}
                    alt="profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-gray-700 bg-gray-100 flex items-center justify-center">
                    <User className="w-14 h-14 text-gray-700" />
                  </div>
                )}

                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-white" />
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  name="profilePic"
                  onChange={handleImageChange}
                />
              </div>

              <div className="flex justify-center items-center gap-1 mt-2">
                <CardTitle className="text-sm">
                  <i>{profileDetails?.email || user.email}</i>
                </CardTitle>
                {profileDetails?.isVerified && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>

              <div className="flex justify-center items-center px-20">
                <Button
                  onClick={toggle}
                  className="w-fit cursor-pointer m-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs"
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={deleteProfilePic}
                  className="w-fit cursor-pointer bg-red-500 hover:bg-red-600 text-white text-xs "
                >
                  {isDeleting && (
                    <Loader2 className="animate-spin w-8 h-8 text-red-100" />
                  )}
                  Delete Photo
                </Button>
              </div>

              <CardDescription className="mt-4 space-y-3 text-sm">
                <hr />

                <p>
                  <b>Name:</b> {profileDetails?.firstName}{" "}
                  {profileDetails?.lastName}
                </p>

                <p>
                  <b>Phone:</b> {profileDetails?.phoneNo || "Not provided"}
                </p>

                <p>
                  <b>City:</b> {profileDetails?.city || "Not provided"}
                </p>

                <p>
                  <b>Address:</b> {profileDetails?.address || "Not provided"}
                </p>

                <p>
                  <b>Zip Code:</b> {profileDetails?.zipCode || "Not provided"}
                </p>

                <p>
                  <b>About:</b> {profileDetails?.about || "No bio added"}
                </p>

                <p>
                  <b>Email Status:</b>{" "}
                  {profileDetails?.isVerified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-red-600">Not Verified</span>
                  )}
                </p>

                <hr />

                <Button
                  className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                  onClick={logOutHandler}
                >
                {isLogout && <Loader2 className="animate-spin w-8 h-8 text-white-500" />}
                  Logout
                </Button>
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <Layers className="w-16 h-16 m-auto" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              No orders yet.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit-profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Edit Profile</CardTitle>
              <hr />
              <EditProfile
                onProfileUpdated={profileObj}
                initialData={profileDetails}
                type={setTypeVal}
              />
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
