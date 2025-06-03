import { ShoppingBag } from "lucide-react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Outlet />
        </div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700">
          <div className="flex flex-col items-center justify-center h-full text-white p-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <ShoppingBag className="h-16 w-16 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">چیزمارکت</h1>
              <p className="text-xl text-blue-100">
                بهترین مکان برای خرید آنلاین
              </p>
            </div>

            <div className="text-center space-y-4 text-blue-100">
              <div className="flex items-center space-x-reverse space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>تحویل سریع و مطمئن</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>بهترین قیمت‌ها</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>پشتیبانی ۲۴ ساعته</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
