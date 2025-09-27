//@ts-nocheck
"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

export default function Page() {
  // Sample blog post data
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Introduction to React",
      category: "Tech",
      views: 1200,
      comments: 45,
    },
    {
      id: 2,
      title: "Healthy Recipes",
      category: "Lifestyle",
      views: 800,
      comments: 30,
    },
    {
      id: 3,
      title: "Travel Tips",
      category: "Travel",
      views: 1500,
      comments: 60,
    },
  ]);

  // State for the modal (add/edit post)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Tech",
    views: 0,
    comments: 0,
  });

  // Open modal for adding a new post
  const openAddModal = () => {
    setCurrentPost(null);
    setFormData({ title: "", category: "Tech", views: 0, comments: 0 });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing post
  const openEditModal = (post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      views: post.views,
      comments: post.comments,
    });
    setIsModalOpen(true);
  };

  // Close modal when clicking outside
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "views" || name === "comments" ? parseInt(value) || 0 : value,
    });
  };

  // Handle form submission (add or edit post)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentPost) {
      setPosts(
        posts.map((post) =>
          post.id === currentPost.id ? { ...post, ...formData } : post
        )
      );
    } else {
      const newPost = {
        id: posts.length + 1,
        ...formData,
      };
      setPosts([...posts, newPost]);
    }
    setIsModalOpen(false);
  };

  // Delete a post
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  // Key Metrics Data
  const totalPosts = posts.length;
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
  const activeUsers = 120; // Sample static value

  // Data for the Line Chart (Blog Views Over Time)
  const viewsOverTimeData = [
    { month: "Jan", views: 5000 },
    { month: "Feb", views: 7000 },
    { month: "Mar", views: 6000 },
    { month: "Apr", views: 9000 },
    { month: "May", views: 8000 },
    { month: "Jun", views: 11000 },
  ];

  // Data for the Bar Chart (Views by Category)
  const viewsByCategoryData = [
    {
      category: "Tech",
      views: posts
        .filter((post) => post.category === "Tech")
        .reduce((sum, post) => sum + post.views, 0),
    },
    {
      category: "Lifestyle",
      views: posts
        .filter((post) => post.category === "Lifestyle")
        .reduce((sum, post) => sum + post.views, 0),
    },
    {
      category: "Travel",
      views: posts
        .filter((post) => post.category === "Travel")
        .reduce((sum, post) => sum + post.views, 0),
    },
  ];

  // Data for the Pie Chart (Percentage of Posts by Category)
  const pieData = [
    {
      name: "Tech",
      value: posts.filter((post) => post.category === "Tech").length,
    },
    {
      name: "Lifestyle",
      value: posts.filter((post) => post.category === "Lifestyle").length,
    },
    {
      name: "Travel",
      value: posts.filter((post) => post.category === "Travel").length,
    },
  ];
  const COLORS = ["#4bc0c0", "#9966ff", "#ff9f40"];

  // Data for the Area Chart (Comments Over Time)
  const commentsOverTimeData = [
    { month: "Jan", comments: 150 },
    { month: "Feb", comments: 200 },
    { month: "Mar", comments: 180 },
    { month: "Apr", comments: 250 },
    { month: "May", comments: 220 },
    { month: "Jun", comments: 300 },
  ];
  return (

      <div>
        <div className="min-h-screen bg-gray-100 p-6">
          {/* <Head>
            <title>Blog Analytics</title>
            <meta
              name="description"
              content="Blog Analytics with Tailwind CSS and Next.js"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head> */}

          <main className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Blog Analytics</h1>
              <button
                onClick={openAddModal}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 transition"
              >
                Add New Post
              </button>
            </div>

            {/* Key Metrics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-500 text-sm">TOTAL POSTS</p>
                <p className="text-3xl font-bold">{totalPosts}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-500 text-sm">TOTAL VIEWS</p>
                <p className="text-3xl font-bold">
                  {totalViews.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-500 text-sm">NEW COMMENTS</p>
                <p className="text-3xl font-bold">{totalComments}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-500 text-sm">ACTIVE USERS</p>
                <p className="text-3xl font-bold">{activeUsers}</p>
              </div>
            </div>

            {/* Blog Posts Table */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.comments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(post)}
                          className="text-teal-500 hover:text-teal-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart: Blog Views Over Time */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Blog Views Over Time
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={viewsOverTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="#4bc0c0" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart: Views by Category */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Views by Category
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={viewsByCategoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#4bc0c0" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart: Percentage of Posts by Category */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Percentage of Posts by Category
                </h3>
                <div className="h-64 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Area Chart: Comments Over Time */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Comments Over Time
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={commentsOverTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="comments"
                        stroke="#9966ff"
                        fill="#9966ff"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Modal for Add/Edit Post */}
            {isModalOpen && (
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
                onClick={closeModal}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-xl font-bold mb-4">
                    {currentPost ? "Edit Post" : "Add New Post"}
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="Tech">Tech</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Travel">Travel</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Views
                      </label>
                      <input
                        type="number"
                        name="views"
                        value={formData.views}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Comments
                      </label>
                      <input
                        type="number"
                        name="comments"
                        value={formData.comments}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
                      >
                        {currentPost ? "Update" : "Add"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

  );
}
