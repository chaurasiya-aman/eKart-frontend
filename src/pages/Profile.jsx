import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "@/utils/Profile.css";
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
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [typeVal, setTypeVal] = useState("profile");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const profileObj = async () => {
    try {
      setLoadingProfile(true);
      const res = await api.get(`${API_URL}/api/v1/user/get-user/${user._id}`);
      setProfileDetails(res.data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const logOutHandler = async () => {
    try {
      setIsLogout(true);
      const res = await api.post(
        `${API_URL}/api/v1/user/logout`,
        {},
        {
          withCredentials: true,
        },
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
      dispatch(setUser(null));
      localStorage.removeItem("serverNoticeSeen");
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
          withCredentials: true,
        },
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
        {},
        {
          withCredentials: true,
        },
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

  if (!user) {
    return (
      <div className="profile-no-user-wrap">
        <div className="profile-no-user-box">
          <div className="profile-no-user-icon">
            <User className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="profile-no-user-text">
            Please login to view your profile.
          </p>
        </div>
      </div>
    );
  }

  if (loadingProfile) {
    return (
      <div className="profile-loading-wrap">
        <div className="profile-loading-box">
          <div className="profile-loading-icon">
            <Loader2 className="animate-spin w-7 h-7 text-indigo-500" />
          </div>
          <p className="profile-loading-text">Loading profile…</p>
        </div>
      </div>
    );
  }

  const infoRow = (label, value) => (
    <div className="profile-info-row">
      <span className="profile-info-label">{label}</span>
      <span className="profile-info-value">{value}</span>
    </div>
  );

  return (
    <>
      <div className="profile-root">
        <Tabs
          value={typeVal}
          onValueChange={setTypeVal}
          className="profile-tabs-wrapper"
        >
          <TabsList className="profile-tabs-list">
            <TabsTrigger
              value="profile"
              className="profile-tab-trigger cursor-pointer"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="profile-tab-trigger cursor-pointer"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="edit-profile"
              className="profile-tab-trigger cursor-pointer"
            >
              Edit Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="profile-card">
              <CardHeader className="pb-0">
                <div className="text-center pt-2">
                  <div className="profile-avatar-ring">
                    {isUploading ? (
                      <div className="profile-avatar-placeholder">
                        <Loader2 className="animate-spin w-7 h-7 text-indigo-500" />
                      </div>
                    ) : profileDetails?.profilePic ? (
                      <img
                        src={profileDetails.profilePic}
                        alt="profile"
                        className="profile-avatar-img"
                      />
                    ) : (
                      <div className="profile-avatar-placeholder">
                        <User className="w-10 h-10 text-indigo-500" />
                      </div>
                    )}

                    <label
                      htmlFor="profileImage"
                      className="profile-camera-btn"
                    >
                      <Camera className="w-3.5 h-3.5 text-white" />
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

                  <div className="profile-name">
                    {profileDetails?.firstName} {profileDetails?.lastName}
                  </div>

                  <div className="profile-email-badge">
                    <CardTitle
                      className="text-[13px] font-normal italic"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {profileDetails?.email || user.email}
                    </CardTitle>
                    {profileDetails?.isVerified && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                  </div>

                  <div className="profile-action-row">
                    <Button
                      onClick={toggle}
                      className="profile-action-btn btn-edit"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      onClick={deleteProfilePic}
                      className="profile-action-btn btn-delete-photo"
                    >
                      {isDeleting && (
                        <Loader2 className="animate-spin w-3.5 h-3.5" />
                      )}
                      Delete Photo
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardDescription as="div" className="profile-card-desc">
                <div className="profile-info-section">
                  <div className="profile-section-label">
                    Contact & Location
                  </div>
                  {infoRow("Phone", profileDetails?.phoneNo || "Not provided")}
                  {infoRow("City", profileDetails?.city || "Not provided")}
                  {infoRow(
                    "Address",
                    profileDetails?.address || "Not provided",
                  )}
                  {infoRow(
                    "Zip Code",
                    profileDetails?.zipCode || "Not provided",
                  )}

                  <div className="profile-section-label">About</div>
                  {infoRow("Bio", profileDetails?.about || "No bio added")}

                  <div className="profile-section-label">Account</div>
                  {infoRow(
                    "Email",
                    profileDetails?.isVerified ? (
                      <span className="profile-status-verified">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="profile-status-unverified">
                        Not Verified
                      </span>
                    ),
                  )}
                </div>

                <div className="profile-logout-section">
                  <Button
                    className="profile-action-btn btn-logout"
                    onClick={logOutHandler}
                  >
                    {isLogout && (
                      <Loader2 className="animate-spin w-3.5 h-3.5" />
                    )}
                    Logout
                  </Button>
                </div>
              </CardDescription>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="profile-card">
              <CardHeader>
                <div className="orders-empty">
                  <div className="orders-icon-wrap">
                    <Layers className="w-9 h-9 text-gray-300" />
                  </div>
                  <p className="orders-no-orders-title">No orders yet</p>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground hidden">
                No orders yet.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit-profile">
            <Card className="profile-card">
              <CardHeader>
                <CardTitle className="profile-edit-title">
                  Edit Profile
                </CardTitle>
                <hr className="profile-edit-divider" />
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
    </>
  );
};

export default Profile;
