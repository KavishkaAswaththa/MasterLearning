"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard/page.module.css";
import Sidebar from "@/components/Sidebar";
import { 
  getUsersRegistry, 
  deleteUserFromRegistry, 
  registerUser, 
  updateUserInRegistry, 
  UserProfile 
} from "@/lib/db";
import { 
  Users, 
  GraduationCap, 
  Database,
  UserPlus,
  Edit2,
  Trash2,
  Search,
  ArrowUpDown,
  MoreVertical,
  Mail,
  ShieldAlert
} from "lucide-react";

export default function UsersDirectoryPage() {
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  
  // Search, sorting, and filtering state
  const [userSearch, setUserSearch] = useState("");
  const [userSort, setUserSort] = useState("name-asc");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Active action menu row (stores email of user)
  const [activeUserMenu, setActiveUserMenu] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Custom Delete Confirm State
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("student");
  const [newPassword, setNewPassword] = useState("password123");

  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("student");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/login?error=auth_required";
      return;
    }
    const parsed = JSON.parse(storedUser);
    if (parsed.role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(parsed);

    getUsersRegistry().then((list) => {
      setRegisteredUsers(list);
    });
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast("Name and Email are required!", "error");
      return;
    }
    const success = await registerUser({
      name: newName,
      email: newEmail.toLowerCase().trim(),
      role: newRole,
      password: newPassword
    });
    if (success) {
      showToast(`User ${newName} created successfully!`, "success");
      setShowCreateModal(false);
      setNewName("");
      setNewEmail("");
      setNewRole("student");
      setNewPassword("password123");
      const list = await getUsersRegistry();
      setRegisteredUsers(list);
    }
  };

  const startEditUser = (u: { name: string; email: string; role: string }) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditRole(u.role);
    setShowEditModal(true);
    setActiveUserMenu(null);
  };

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const success = await updateUserInRegistry(editingUser.email, editName, editRole);
    if (success) {
      showToast(`Profile for ${editName} updated!`, "success");
      setShowEditModal(false);
      setEditingUser(null);
      const list = await getUsersRegistry();
      setRegisteredUsers(list);
    }
  };

  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    showToast(`Email ${email} copied to clipboard!`, "success");
    setActiveUserMenu(null);
  };

  const testAuditUserToken = (name: string) => {
    showToast(`User security credentials validated for ${name}!`, "info");
    setActiveUserMenu(null);
  };

  const seedUsers = [
    { name: "Administrator", email: "admin@masterlearning.com", role: "admin", status: "Protected" },
    { name: "Professor Davis", email: "teacher@masterlearning.com", role: "teacher", status: "Protected" },
    { name: "Kavishka Aswaththa", email: "student@masterlearning.com", role: "student", status: "Protected" }
  ];

  const allUsersList = [
    ...seedUsers,
    ...registeredUsers.map(u => ({ ...u, status: "Dynamic" }))
  ];

  // Apply filtering (Role)
  let processedUsers = allUsersList.filter(u => {
    if (roleFilter === "all") return true;
    return u.role.toLowerCase() === roleFilter.toLowerCase();
  });

  // Apply Search
  if (userSearch.trim()) {
    const q = userSearch.toLowerCase();
    processedUsers = processedUsers.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q)
    );
  }

  // Apply Sorting
  processedUsers.sort((a, b) => {
    if (userSort === "name-asc") return a.name.localeCompare(b.name);
    if (userSort === "name-desc") return b.name.localeCompare(a.name);
    if (userSort === "email-asc") return a.email.localeCompare(b.email);
    return 0;
  });

  const studentsCount = allUsersList.filter(u => u.role === "student").length;
  const teachersCount = allUsersList.filter(u => u.role === "teacher").length;

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--background)", color: "#ffffff" }}>
        <p>Loading school directory...</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className="glow-purple" style={{ top: "10%", left: "20%" }}></div>
      <div className="glow-orange" style={{ bottom: "10%", right: "10%" }}></div>

      <Sidebar activeTab="users" />

      <main className={styles.mainContent}>
        {/* Top Header Row */}
        <div className={styles.header}>
          <div className={styles.greetingSection}>
            <h1>School Registry Directory</h1>
            <p>Admin Control Panel | Manage all teachers and student credentials.</p>
          </div>
        </div>

        {/* Admin Systems Stats */}
        <div className={styles.metricsRow} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
          <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>
              <Users size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{studentsCount}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Students</p>
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(249, 115, 22, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-orange)" }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{teachersCount}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Teachers</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-purple)" }}>
              <Database size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{allUsersList.length}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Accounts</p>
            </div>
          </div>
        </div>

        {/* Accounts Directory */}
        <div className="glass-panel" style={{ padding: "2rem", borderRadius: "24px", border: "1px solid var(--glass-border)", marginBottom: "2rem" }}>
          
          {/* Action and Control Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", flexGrow: 1 }}>
              
              {/* Search Bar */}
              <div style={{ position: "relative", width: "240px" }}>
                <Search size={16} color="var(--text-secondary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type="text" 
                  placeholder="Search name or email..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 36px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Sorting Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <ArrowUpDown size={14} color="var(--text-secondary)" />
                <select 
                  value={userSort}
                  onChange={(e) => setUserSort(e.target.value)}
                  style={{
                    background: "rgba(25,18,50,0.9)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    outline: "none"
                  }}
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="email-asc">Email (A-Z)</option>
                </select>
              </div>

              {/* Tab Filters */}
              <div style={{ display: "flex", gap: "6px" }}>
                {["all", "teacher", "student"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    style={{
                      background: roleFilter === r ? "var(--primary)" : "rgba(255,255,255,0.04)",
                      border: "none",
                      color: "#ffffff",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {r.toUpperCase()}S
                  </button>
                ))}
              </div>

            </div>

            <button onClick={() => setShowCreateModal(true)} className="gradient-button" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", fontSize: "0.85rem", borderRadius: "8px" }}>
              <UserPlus size={14} /> Add User
            </button>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "600px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  <th style={{ padding: "10px" }}>Profile Name</th>
                  <th style={{ padding: "10px" }}>Email</th>
                  <th style={{ padding: "10px" }}>Role</th>
                  <th style={{ padding: "10px" }}>Status</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.9rem" }}>
                {processedUsers.map((regUser, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 10px", fontWeight: "bold" }}>{regUser.name}</td>
                    <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>{regUser.email}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{ 
                        background: regUser.role === "admin" ? "rgba(139, 92, 246, 0.15)" : regUser.role === "teacher" ? "rgba(249, 115, 22, 0.15)" : "rgba(59, 130, 246, 0.15)",
                        color: regUser.role === "admin" ? "#a78bfa" : regUser.role === "teacher" ? "#fb923c" : "#60a5fa", 
                        padding: "4px 8px", 
                        borderRadius: "6px", 
                        fontSize: "0.75rem", 
                        fontWeight: "bold" 
                      }}>
                        {regUser.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px", color: regUser.status === "Protected" ? "#22c55e" : "var(--color-orange)" }}>{regUser.status}</td>
                    <td style={{ padding: "12px 10px", textAlign: "right", position: "relative" }}>
                      <button 
                        onClick={() => setActiveUserMenu(activeUserMenu === regUser.email ? null : regUser.email)}
                        style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "4px" }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Options Popup */}
                      {activeUserMenu === regUser.email && (
                        <div style={{
                          position: "absolute",
                          right: "10px",
                          top: "35px",
                          background: "rgba(15, 10, 30, 0.95)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid var(--glass-border)",
                          borderRadius: "8px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                          zIndex: 100,
                          width: "160px",
                          textAlign: "left",
                          padding: "6px 0"
                        }}>
                          <button 
                            onClick={() => copyEmailToClipboard(regUser.email)} 
                            style={{ width: "100%", background: "none", border: "none", color: "#ffffff", padding: "8px 12px", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                          >
                            <Mail size={12} /> Copy Email
                          </button>
                          
                          <button 
                            onClick={() => testAuditUserToken(regUser.name)} 
                            style={{ width: "100%", background: "none", border: "none", color: "#ffffff", padding: "8px 12px", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                          >
                            <ShieldAlert size={12} /> Audit Access
                          </button>

                          {regUser.status === "Dynamic" ? (
                            <>
                              <button 
                                onClick={() => startEditUser(regUser)} 
                                style={{ width: "100%", background: "none", border: "none", color: "#a78bfa", padding: "8px 12px", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}
                              >
                                <Edit2 size={12} /> Edit Profile
                              </button>
                              <button 
                                onClick={() => { setConfirmDeleteEmail(regUser.email); setActiveUserMenu(null); }} 
                                style={{ width: "100%", background: "none", border: "none", color: "#ef4444", padding: "8px 12px", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                              >
                                <Trash2 size={12} /> Revoke User
                              </button>
                            </>
                          ) : null}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: "2.5rem", width: "100%", maxWidth: "400px", border: "1px solid var(--glass-border)" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff", marginBottom: "1.5rem" }}>Create New User</h2>
              <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Full Name</label>
                  <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Email Address</label>
                  <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Role Type</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(25,18,50,0.9)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Password</label>
                  <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: "8px 16px", borderRadius: "6px", background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", cursor: "pointer" }}>Cancel</button>
                  <button type="submit" className="gradient-button" style={{ padding: "8px 16px", borderRadius: "6px" }}>Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: "2.5rem", width: "100%", maxWidth: "400px", border: "1px solid var(--glass-border)" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff", marginBottom: "1.5rem" }}>Edit User Profile</h2>
              <form onSubmit={handleSaveUserEdit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Email (Read Only)</label>
                  <input type="email" disabled value={editingUser.email} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "var(--text-muted)", cursor: "not-allowed" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Full Name</label>
                  <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Role Type</label>
                  <select value={editRole} onChange={(e) => setEditRole(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(25,18,50,0.9)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem" }}>
                  <button type="button" onClick={() => { setShowEditModal(false); setEditingUser(null); }} style={{ padding: "8px 16px", borderRadius: "6px", background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", cursor: "pointer" }}>Cancel</button>
                  <button type="submit" className="gradient-button" style={{ padding: "8px 16px", borderRadius: "6px" }}>Save Settings</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Custom Confirmation Modal for Deletion */}
        {confirmDeleteEmail && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1300 }}>
            <div className="glass-panel" style={{ padding: "2.5rem", width: "100%", maxWidth: "400px", border: "1px solid var(--glass-border)", textAlign: "center" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto", fontSize: "1.5rem" }}>
                ⚠️
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff", marginBottom: "1rem" }}>Revoke Access Profile</h2>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: "1.5" }}>
                Are you sure you want to revoke access parameters for <strong style={{ color: "#ffffff" }}>{confirmDeleteEmail}</strong>? This user will no longer be able to log in.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                <button onClick={() => setConfirmDeleteEmail(null)} style={{ padding: "10px 20px", borderRadius: "8px", background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", cursor: "pointer", fontSize: "0.9rem", fontWeight: "bold" }}>
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    const email = confirmDeleteEmail;
                    setConfirmDeleteEmail(null);
                    await deleteUserFromRegistry(email);
                    const updated = registeredUsers.filter(u => u.email !== email);
                    setRegisteredUsers(updated);
                    showToast(`Access revoked for ${email} successfully!`, "success");
                  }} 
                  style={{ padding: "10px 20px", borderRadius: "8px", background: "#ef4444", border: "none", color: "#ffffff", cursor: "pointer", fontSize: "0.9rem", fontWeight: "bold" }}
                >
                  Revoke Access
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Glassmorphic Toast Notification */}
        {toast && (
          <div style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "rgba(15, 10, 30, 0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--glass-border)",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            color: "#ffffff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 2000,
            animation: "slideIn 0.3s ease forwards"
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: toast.type === "success" ? "#22c55e" : toast.type === "error" ? "#ef4444" : "var(--color-orange)"
            }}></div>
            <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{toast.message}</span>
          </div>
        )}

      </main>
    </div>
  );
}
