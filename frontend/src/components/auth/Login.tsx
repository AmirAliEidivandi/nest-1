import { yupResolver } from "@hookform/resolvers/yup";
import { Lock, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";

// Validation schema - Updated to match backend requirements
const loginSchema = yup.object({
  username: yup
    .string()
    .required("نام کاربری الزامی است")
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد"),
  password: yup
    .string()
    .required("رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      // Call the login function from AuthContext
      await login(data.username, data.password);

      toast.success("ورود با موفقیت انجام شد! 🎉");

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "خطا در ورود! لطفاً دوباره تلاش کنید.";

      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">ورود به چیزمارکت</h2>
        <p className="mt-2 text-gray-600">وارد حساب کاربری خود شوید</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          {...register("username")}
          label="نام کاربری"
          type="text"
          placeholder="نام کاربری خود را وارد کنید"
          error={errors.username?.message}
          icon={<User />}
          autoComplete="username"
        />

        <Input
          {...register("password")}
          label="رمز عبور"
          type="password"
          placeholder="رمز عبور خود را وارد کنید"
          error={errors.password?.message}
          icon={<Lock />}
          showPasswordToggle
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="mr-2 text-sm text-gray-600">
              مرا به خاطر بسپار
            </span>
          </label>

          <Link
            to="#"
            className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
          >
            فراموشی رمز عبور؟
          </Link>
        </div>

        <Button type="submit" loading={isLoading} fullWidth size="lg">
          ورود
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 text-gray-500">یا</span>
        </div>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-gray-600">
          حساب کاربری ندارید؟{" "}
          <Link
            to="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            ثبت نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
