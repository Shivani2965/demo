import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { DemoStore } from '../../services/demoStore';
import {
  Users,
  Shield,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface UserManagementViewProps {
  currentUser: User;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>(DemoStore.getRegisteredUsers());
  const [search, setSearch] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    try {
      DemoStore.updateUserRole(userId, newRole);
      setUsers(DemoStore.getRegisteredUsers());
      setSuccessToast(`Updated user role to ${newRole}`);
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="pb-2 border-b border-[#EDE6D6]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
          Users & Role Access Management
        </h2>
        <p className="text-xs sm:text-sm text-[#77736D] mt-0.5">
          Enforce Role-Based Access Control (RBAC) across Employee, IT Engineer, and Admin portals.
        </p>
      </div>

      {successToast && (
        <div className="p-3.5 bg-[#DDECCB] border border-[#CDE0B7] text-[#2D4E14] text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#4B7926]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Notice Banner */}
      <div className="p-4 bg-white rounded-3xl border border-[#EDE6D6] text-xs text-[#171717] flex items-start gap-3 shadow-xs">
        <Shield className="w-4 h-4 text-[#171717] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">RBAC Security Enforcement:</span>
          <p className="mt-0.5 text-[#77736D] leading-relaxed">
            Only authenticated administrators can alter role assignments. In accordance with system policy, employee accounts cannot access administrative privilege controls.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#EDE6D6] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#EDE6D6] flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-[#77736D] absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name or email..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#FFFAED] border border-[#EDE6D6] rounded-full text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            />
          </div>
          <span className="text-xs font-mono font-bold text-[#77736D]">
            {users.length} Registered Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F2E4] border-b border-[#EDE6D6] text-[11px] font-bold text-[#77736D] uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Role Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D6] text-xs">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#FFFAED] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#171717]">{u.name}</div>
                    <div className="text-[11px] text-[#77736D] font-mono">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#77736D]">{u.department}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                        u.role === 'admin'
                          ? 'bg-[#EBDDF5] text-[#3E2459] border-[#DFCEEC]'
                          : u.role === 'engineer'
                          ? 'bg-[#F6E58D] text-[#5C4D0A] border-[#EAD77B]'
                          : 'bg-[#FFFAED] text-[#171717] border-[#EDE6D6]'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-[#2D4E14] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4B7926]" />
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="text-xs bg-[#FFFAED] border border-[#EDE6D6] rounded-full px-3 py-1 font-semibold text-[#171717]"
                    >
                      <option value="employee">Employee</option>
                      <option value="engineer">IT Engineer</option>
                      <option value="admin">Admin / Manager</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
