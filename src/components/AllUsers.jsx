import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "@/api/axios";
import "@/utils/AllUsers.css";

const AVATAR_VARIANTS = [
  "all-users__avatar--violet",
  "all-users__avatar--teal",
  "all-users__avatar--blue",
  "all-users__avatar--orange",
  "all-users__avatar--amber",
];

function getInitials(firstName, lastName) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

function getAvatarVariant(name) {
  let hash = 0;
  for (const c of name) hash += c.charCodeAt(0);
  return AVATAR_VARIANTS[hash % AVATAR_VARIANTS.length];
}

const STATS_CONFIG = [
  { label: "Total users",  key: "total"    },
  { label: "Verified",     key: "verified" },
  { label: "Admins",       key: "admins"   },
];

export default function AllUsers() {
  const [users, setUsers]           = useState([]);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    api
      .get("/api/v1/user/get-all", { withCredentials: true })
      .then((res) => setUsers(res.data.users ?? res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load users. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchQ =
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchR = roleFilter === "all" || u.role === roleFilter;
    return matchQ && matchR;
  });

  const stats = {
    total:    filtered.length,
    verified: filtered.filter((u) => u.isVerified).length,
    admins:   filtered.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="all-users">

      <div className="all-users__topbar">
        <h2 className="all-users__title">All users</h2>

        <div className="all-users__search-wrap">
          <Search className="all-users__search-icon" aria-hidden="true" />
          <input
            type="text"
            className="all-users__search-input"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="all-users__filter-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="all-users__stats">
        {STATS_CONFIG.map(({ label, key }) => (
          <div key={key} className="all-users__stat">
            <p className="all-users__stat-label">{label}</p>
            <p className="all-users__stat-value">{stats[key]}</p>
          </div>
        ))}
      </div>

      <div className="all-users__table-wrap">
        {loading ? (
          <p className="all-users__loading">Loading…</p>
        ) : error ? (
          <p className="all-users__empty">{error}</p>
        ) : (
          <table className="all-users__table">
            <thead className="all-users__thead">
              <tr>
                <th className="all-users__th">User</th>
                <th className={`all-users__th all-users__col--sm-hide`}>Email</th>
                <th className={`all-users__th all-users__col--md-hide`}>Phone</th>
                <th className="all-users__th">Role</th>
                <th className={`all-users__th all-users__col--sm-hide`}>Verified</th>
              </tr>
            </thead>

            <tbody className="all-users__tbody">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="all-users__empty">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const fullName = `${u.firstName} ${u.lastName}`;
                  return (
                    <tr key={u._id}>
                      <td className="all-users__td">
                        <div className="all-users__user-cell">
                          {u.profilePic ? (
                            <img
                              src={u.profilePic}
                              alt={fullName}
                              className="all-users__avatar-img"
                            />
                          ) : (
                            <div
                              className={`all-users__avatar-initials ${getAvatarVariant(fullName)}`}
                              aria-hidden="true"
                            >
                              {getInitials(u.firstName, u.lastName)}
                            </div>
                          )}
                          <span className="all-users__user-name">{fullName}</span>
                        </div>
                      </td>

                      <td className={`all-users__td all-users__td--muted all-users__col--sm-hide`}>
                        {u.email}
                      </td>

                      <td className={`all-users__td all-users__td--muted all-users__col--md-hide`}>
                        {u.phoneNo || "—"}
                      </td>

                      <td className="all-users__td">
                        <span
                          className={`all-users__badge ${
                            u.role === "admin"
                              ? "all-users__badge--admin"
                              : "all-users__badge--user"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className={`all-users__td all-users__col--sm-hide`}>
                        <span
                          className={`all-users__badge ${
                            u.isVerified
                              ? "all-users__badge--verified"
                              : "all-users__badge--unverified"
                          }`}
                        >
                          {u.isVerified ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}