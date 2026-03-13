import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, blockUser } from "../../redux/reducer/userSlice";

const Users = () => {
  const dispatch = useDispatch();
  // ✅ state.auth.users — nested inside authSlice
  const { items: users, loading, error } = useSelector((s) => s.auth.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleBlock = (user) => {
    const id = user._id ?? user.userId ?? user.id;
    const action = user.isBlocked ? "Unblock" : "Block";
    if (!window.confirm(`${action} this user?`)) return;
    dispatch(blockUser(id));
  };

  const handleDelete = (user) => {
    const id = user._id ?? user.userId ?? user.id;
    if (!window.confirm("Permanently delete this user?")) return;
    dispatch(deleteUser(id));
  };

  if (loading)
    return (
      <div className="text-sm text-gray-400 mt-10 text-center">Loading users...</div>
    );

  if (error)
    return (
      <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
        {error}
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} total users</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Phone</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">User ID</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">No users found</td>
              </tr>
            )}
            {users.map((user) => {
              const id = user._id ?? user.userId ?? user.id;
              return (
                <tr key={id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-800 font-medium">{user.phone ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isBlocked
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleBlock(user)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          user.isBlocked
                            ? "border-green-300 text-green-700 hover:bg-green-50"
                            : "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                        }`}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;