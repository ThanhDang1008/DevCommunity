// "use client";

// import { useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
// } from "recharts";

import ListUser from "@modules/user/components/manage/ListUser";

export default function Page() {
  // const [users, setUsers] = useState([
  //   { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  //   { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  //   { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User" },
  // ]);

  // // Trạng thái cho modal (thêm/sửa người dùng)
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [currentUser, setCurrentUser] = useState(null); // Để chỉnh sửa
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   role: "User",
  // });

  // // Mở modal để thêm người dùng mới
  // const openAddModal = () => {
  //   setCurrentUser(null);
  //   setFormData({ name: "", email: "", role: "User" });
  //   setIsModalOpen(true);
  // };

  // // Mở modal để chỉnh sửa người dùng hiện tại
  // const openEditModal = (user: any) => {
  //   setCurrentUser(user);
  //   setFormData({ name: user.name, email: user.email, role: user.role });
  //   setIsModalOpen(true);
  // };

  // // Xử lý thay đổi input trong form
  // const handleInputChange = (e: any) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // // Xử lý gửi form (thêm hoặc chỉnh sửa người dùng)
  // const handleSubmit = (e: any) => {
  //   e.preventDefault();
  //   if (currentUser) {
  //     // Chỉnh sửa người dùng
  //     setUsers(
  //       users.map((user: any) =>
  //         //@ts-ignore
  //         user.id === currentUser.id ? { ...user, ...formData } : user
  //       )
  //     );
  //   } else {
  //     // Thêm người dùng mới
  //     const newUser = {
  //       id: users.length + 1,
  //       ...formData,
  //     };
  //     setUsers([...users, newUser]);
  //   }
  //   setIsModalOpen(false);
  // };

  // // Xóa người dùng
  // const handleDelete = (id: any) => {
  //   if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
  //     setUsers(users.filter((user) => user.id !== id));
  //   }
  // };

  // // Dữ liệu cho Biểu đồ Đường (Tăng trưởng người dùng theo thời gian)
  // const userGrowthData = [
  //   { month: "Tháng 1", new: 10 },
  //   { month: "Tháng 2", new: 20 },
  //   { month: "Tháng 3", new: 15 },
  //   { month: "Tháng 4", new: 30 },
  //   { month: "Tháng 5", new: 25 },
  //   { month: "Tháng 6", new: 40 },
  // ];

  // // Dữ liệu cho Biểu đồ Cột (Phân phối vai trò người dùng)
  // const userRolesData = [
  //   {
  //     role: "Admin",
  //     count: users.filter((user) => user.role === "Admin").length,
  //   },
  //   {
  //     role: "User",
  //     count: users.filter((user) => user.role === "User").length,
  //   },
  // ];

  // // Dữ liệu cho Biểu đồ Tròn (Phần trăm người dùng theo vai trò)
  // const pieData = [
  //   {
  //     name: "Admin",
  //     value: users.filter((user) => user.role === "Admin").length,
  //   },
  //   {
  //     name: "User",
  //     value: users.filter((user) => user.role === "User").length,
  //   },
  // ];
  // const COLORS = ["#4bc0c0", "#9966ff"];

  // // Dữ liệu cho Biểu đồ Khu vực (Hoạt động người dùng theo thời gian)
  // const userActivityData = [
  //   { month: "Tháng 1", logins: 50 },
  //   { month: "Tháng 2", logins: 70 },
  //   { month: "Tháng 3", logins: 60 },
  //   { month: "Tháng 4", logins: 90 },
  //   { month: "Tháng 5", logins: 80 },
  //   { month: "Tháng 6", logins: 100 },
  // ];
  return (
    // <main className="max-w-7xl mx-auto">
    //   {/* Phần tiêu đề */}
    //   <div className="flex justify-between items-center mb-6">
    //     <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
    //     <button
    //       onClick={openAddModal}
    //       className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 transition"
    //     >
    //       Thêm người dùng mới
    //     </button>
    //   </div>

    //   {/* Bảng người dùng */}
    //   <div className="bg-white p-6 rounded-lg shadow-md">
    //     <table className="min-w-full divide-y divide-gray-200">
    //       <thead className="bg-gray-50">
    //         <tr>
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //             ID
    //           </th>
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //             Tên
    //           </th>
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //             Email
    //           </th>
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //             Vai trò
    //           </th>
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //             Hành động
    //           </th>
    //         </tr>
    //       </thead>
    //       <tbody className="bg-white divide-y divide-gray-200">
    //         {users.map((user) => (
    //           <tr key={user.id}>
    //             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    //               {user.id}
    //             </td>
    //             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    //               {user.name}
    //             </td>
    //             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    //               {user.email}
    //             </td>
    //             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    //               {user.role}
    //             </td>
    //             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
    //               <button
    //                 onClick={() => openEditModal(user)}
    //                 className="text-teal-500 hover:text-teal-700 mr-4"
    //               >
    //                 Sửa
    //               </button>
    //               <button
    //                 onClick={() => handleDelete(user.id)}
    //                 className="text-red-500 hover:text-red-700"
    //               >
    //                 Xóa
    //               </button>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>

    //   {/* Modal Thêm/Sửa Người Dùng */}
    //   {isModalOpen && (
    //     <div
    //       className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-10"
    //       onClick={() => setIsModalOpen(false)}
    //     >
    //       <div
    //         className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
    //         onClick={(e) => e.stopPropagation()}
    //       >
    //         <h2 className="text-xl font-bold mb-4">
    //           {currentUser ? "Sửa người dùng" : "Thêm người dùng mới"}
    //         </h2>
    //         <form onSubmit={handleSubmit}>
    //           <div className="mb-4">
    //             <label className="block text-sm font-medium text-gray-700">
    //               Tên
    //             </label>
    //             <input
    //               type="text"
    //               name="name"
    //               value={formData.name}
    //               onChange={handleInputChange}
    //               className="mt-1 p-2 w-full border rounded-lg focus:ring-teal-500 focus:border-teal-500"
    //               required
    //             />
    //           </div>
    //           <div className="mb-4">
    //             <label className="block text-sm font-medium text-gray-700">
    //               Email
    //             </label>
    //             <input
    //               type="email"
    //               name="email"
    //               value={formData.email}
    //               onChange={handleInputChange}
    //               className="mt-1 p-2 w-full border rounded-lg focus:ring-teal-500 focus:border-teal-500"
    //               required
    //             />
    //           </div>
    //           <div className="mb-4">
    //             <label className="block text-sm font-medium text-gray-700">
    //               Vai trò
    //             </label>
    //             <select
    //               name="role"
    //               value={formData.role}
    //               onChange={handleInputChange}
    //               className="mt-1 p-2 w-full border rounded-lg focus:ring-teal-500 focus:border-teal-500"
    //             >
    //               <option value="User">Người dùng</option>
    //               <option value="Admin">Quản trị viên</option>
    //             </select>
    //           </div>
    //           <div className="flex justify-end space-x-2">
    //             <button
    //               type="button"
    //               onClick={() => setIsModalOpen(false)}
    //               className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
    //             >
    //               Hủy
    //             </button>
    //             <button
    //               type="submit"
    //               className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
    //             >
    //               {currentUser ? "Cập nhật" : "Thêm"}
    //             </button>
    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //   )}

    //   {/* Phần Biểu đồ */}
    //   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    //     {/* Biểu đồ Đường: Tăng trưởng người dùng theo thời gian */}
    //     <div className="bg-white p-6 rounded-lg shadow-md">
    //       <h3 className="text-lg font-semibold mb-4">
    //         Tăng trưởng người dùng theo thời gian
    //       </h3>
    //       <div className="h-64">
    //         <LineChart width={500} height={250} data={userGrowthData}>
    //           <CartesianGrid strokeDasharray="3 3" />
    //           <XAxis dataKey="month" />
    //           <YAxis />
    //           <Tooltip />
    //           <Legend />
    //           <Line type="monotone" dataKey="new" stroke="#4bc0c0" />
    //         </LineChart>
    //       </div>
    //     </div>

    //     {/* Biểu đồ Cột: Phân phối vai trò người dùng */}
    //     <div className="bg-white p-6 rounded-lg shadow-md">
    //       <h3 className="text-lg font-semibold mb-4">
    //         Phân phối vai trò người dùng
    //       </h3>
    //       <div className="h-64">
    //         <BarChart width={500} height={250} data={userRolesData}>
    //           <CartesianGrid strokeDasharray="3 3" />
    //           <XAxis dataKey="role" />
    //           <YAxis />
    //           <Tooltip />
    //           <Legend />
    //           <Bar dataKey="count" fill="#4bc0c0" />
    //         </BarChart>
    //       </div>
    //     </div>

    //     {/* Biểu đồ Tròn: Phần trăm người dùng theo vai trò */}
    //     <div className="bg-white p-6 rounded-lg shadow-md">
    //       <h3 className="text-lg font-semibold mb-4">
    //         Phần trăm người dùng theo vai trò
    //       </h3>
    //       <div className="h-64 flex justify-center">
    //         <PieChart width={400} height={250}>
    //           <Pie
    //             data={pieData}
    //             cx={200}
    //             cy={125}
    //             labelLine={false}
    //             outerRadius={80}
    //             fill="#8884d8"
    //             dataKey="value"
    //             label={({ name, percent }) =>
    //               `${name} (${(percent * 100).toFixed(0)}%)`
    //             }
    //           >
    //             {pieData.map((entry, index) => (
    //               <Cell
    //                 key={`cell-${index}`}
    //                 fill={COLORS[index % COLORS.length]}
    //               />
    //             ))}
    //           </Pie>
    //           <Tooltip />
    //         </PieChart>
    //       </div>
    //     </div>

    //     {/* Biểu đồ Khu vực: Hoạt động người dùng theo thời gian */}
    //     <div className="bg-white p-6 rounded-lg shadow-md">
    //       <h3 className="text-lg font-semibold mb-4">
    //         Hoạt động người dùng theo thời gian
    //       </h3>
    //       <div className="h-64">
    //         <AreaChart width={500} height={250} data={userActivityData}>
    //           <CartesianGrid strokeDasharray="3 3" />
    //           <XAxis dataKey="month" />
    //           <YAxis />
    //           <Tooltip />
    //           <Legend />
    //           <Area
    //             type="monotone"
    //             dataKey="logins"
    //             stroke="#9966ff"
    //             fill="#9966ff"
    //             fillOpacity={0.3}
    //           />
    //         </AreaChart>
    //       </div>
    //     </div>
    //   </div>
    // </main>
    <>
     
        <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
        <ListUser />
      
    </>
  );
}
