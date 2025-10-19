import { useEffect, useState } from "react";

const App = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [editingUserId, setEditingUserId] = useState(null); 

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:4000/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingUserId) {
      await fetch(`http://localhost:4000/api/users/${editingUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    // Reset form and refresh list
    setForm({ name: "", email: "", age: "" });
    setEditingUserId(null);
    fetchUsers();
  };

  // Handle edit button click
  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, age: user.age });
    setEditingUserId(user._id);
  };

  // Delete user
  const handleDelete = async (id) => {
    await fetch(`http://localhost:4000/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4 border mt-10 rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">User Management</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          className="border p-2 w-full mb-2"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border p-2 w-full mb-2"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="border p-2 w-full mb-2"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />
        <button
          type="submit"
          className={`${
            editingUserId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded w-full`}
        >
          {editingUserId ? "Update User" : "Add User"}
        </button>
        {editingUserId && (
          <button
            type="button"
            onClick={() => {
              setEditingUserId(null);
              setForm({ name: "", email: "", age: "" });
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded w-full mt-2 hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>
      
      <ul>
        {users.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">Age: {user.age}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
