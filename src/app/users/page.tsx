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
  Trash2
} from "lucide-react";

export default function UsersDirectoryPage() {
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
      alert("Name and Email are required!");
      return;
    }
    const success = await registerUser({
      name: newName,
      email: newEmail.toLowerCase().trim(),
      role: newRole,
      password: newPassword
    });
    if (success) {
      alert("Account created successfully!");
      setShowCreateModal(false);
      setNewName("");
      setNewEmail("");
      setNewRole("student");
      setNewPassword("password123");
      const list = await getUsersRegistry();
      setRegisteredUsers(list);
    }
  };

  const startEditUser = (u: UserProfile) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditRole(u.role);
    setShowEditModal(true);
  };

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const success = await updateUserInRegistry(editingUser.email, editName, editRole);
    if (success) {
      alert("Profile updated successfully!");
      setShowEditModal(false);
      setEditingUser(null);
      const list = await getUsersRegistry();
      setRegisteredUsers(list);
    }
  };

  const handleDeleteUser = async (emailToDelete: string) => {
    if (confirm(`Are you sure you want to revoke access for ${emailToDelete}?`)) {
      await deleteUserFromRegistry(emailToDelete);
      const updated = registeredUsers.filter(u => u.email !== emailToDelete);
      setRegisteredUsers(updated);
    }
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

  const filteredUsersList = allUsersList.filter(u => {
    if (roleFilter === "all") return true;
    return u.role.toLowerCase() === roleFilter.toLowerCase();
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff" }}>User Accounts Directory</h2>
            
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
            
            <button onClick={() => setShowCreateModal(true)} className="gradient-button" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", fontSize: "0.85rem", borderRadius: "8px" }}>
              <UserPlus size={14} /> Add User
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "500px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  <th style={{ padding: "10px" }}>Profile Name</th>
                  <th style={{ padding: "10px" }}>Email</th>
                  <th style={{ padding: "10px" }}>Role</th>
                  <th style={{ padding: "10px" }}>Status</th>
                  <th style={{ padding: "10px" }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.9rem" }}>
                {filteredUsersList.map((regUser, idx) => (
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
                    <td style={{ padding: "12px 10px" }}>
                      {regUser.status === "Dynamic" ? (
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button 
                            onClick={() => startEditUser(regUser)}
                            style={{ background: "none", border: "none", color: "#a78bfa", display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", fontWeight: "bold", cursor: "pointer" }}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(regUser.email)}
                            style={{ background: "none", border: "none", color: "#ef4444", display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", fontWeight: "bold", cursor: "pointer" }}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>System Default</span>
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
      </main>
    </div>
  );
}
