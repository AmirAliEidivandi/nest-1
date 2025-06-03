import {
  Bell,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    toast.success("خروج با موفقیت انجام شد");
    navigate("/auth/login");
  };

  const stats = [
    {
      title: "کل فروش",
      value: "۱۲,۳۴۵,۶۷۸",
      unit: "تومان",
      change: "+۱۲%",
      icon: TrendingUp,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "سفارشات",
      value: "۱,۲۳۴",
      unit: "سفارش",
      change: "+۸%",
      icon: Package,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "کاربران",
      value: "۵,۶۷۸",
      unit: "کاربر",
      change: "+۱۵%",
      icon: Users,
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "محصولات",
      value: "۸۹۰",
      unit: "محصول",
      change: "+۵%",
      icon: ShoppingBag,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  const menuItems = [
    { title: "داشبورد", icon: TrendingUp, active: true },
    { title: "محصولات", icon: Package, active: false },
    { title: "سفارشات", icon: ShoppingBag, active: false },
    { title: "کاربران", icon: Users, active: false },
    { title: "تنظیمات", icon: Settings, active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="mr-2 text-xl font-bold text-gray-900">
              چیزمارکت
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-6 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {userData.name?.charAt(0) || "ک"}
                  </span>
                </div>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-900">
                  {userData.name || "کاربر"}
                </p>
                <p className="text-xs text-gray-500">
                  {userData.role === "admin" ? "مدیر" : "کاربر"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  item.active
                    ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon className="ml-3 h-5 w-5" />
                {item.title}
              </a>
            ))}
          </div>

          <div className="absolute bottom-0 w-full p-6">
            <Button
              onClick={handleLogout}
              variant="outline"
              fullWidth
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <LogOut className="ml-2 h-4 w-4" />
              خروج
            </Button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:mr-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-6 w-6 text-gray-400" />
              </button>
              <h1 className="mr-4 text-2xl font-semibold text-gray-900">
                داشبورد
              </h1>
            </div>

            <div className="flex items-center space-x-reverse space-x-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو..."
                  className="w-64 pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              خوش آمدید، {userData.name || "کاربر عزیز"}! 👋
            </h2>
            <p className="text-gray-600">
              آمار و اطلاعات مهم فروشگاه شما در اینجا نمایش داده می‌شود.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="mr-2 text-sm text-gray-500">{stat.unit}</p>
                    </div>
                    <p className="text-sm text-green-600">
                      {stat.change} نسبت به ماه قبل
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                فعالیت‌های اخیر
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  {
                    action: "سفارش جدید",
                    details: "سفارش #۱۲۳۴ ثبت شد",
                    time: "۵ دقیقه پیش",
                  },
                  {
                    action: "محصول جدید",
                    details: 'محصول "گوشی هوشمند" اضافه شد',
                    time: "۱۰ دقیقه پیش",
                  },
                  {
                    action: "کاربر جدید",
                    details: "کاربر جدید ثبت نام کرد",
                    time: "۱۵ دقیقه پیش",
                  },
                  {
                    action: "پرداخت",
                    details: "پرداخت سفارش #۱۲۳۳ تایید شد",
                    time: "۲۰ دقیقه پیش",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.details}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
