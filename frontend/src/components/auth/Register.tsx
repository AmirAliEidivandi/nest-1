import { yupResolver } from "@hookform/resolvers/yup";
import { Lock, Mail, Phone, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Button from "../ui/Button";
import Input from "../ui/Input";

// Validation schema
const registerSchema = yup.object({
  firstName: yup
    .string()
    .required("نام الزامی است")
    .min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  lastName: yup
    .string()
    .required("نام خانوادگی الزامی است")
    .min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد"),
  email: yup
    .string()
    .required("ایمیل الزامی است")
    .email("فرمت ایمیل صحیح نیست"),
  phone: yup
    .string()
    .required("شماره موبایل الزامی است")
    .matches(/^09\d{9}$/, "فرمت شماره موبایل صحیح نیست"),
  password: yup
    .string()
    .required("رمز عبور الزامی است")
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "رمز عبور باید شامل حروف کوچک، بزرگ و عدد باشد"
    ),
  confirmPassword: yup
    .string()
    .required("تکرار رمز عبور الزامی است")
    .oneOf([yup.ref("password")], "رمز عبور و تکرار آن باید یکسان باشند"),
  acceptTerms: yup.boolean().oneOf([true], "پذیرش قوانین الزامی است"),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      console.log("Register data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful registration
      toast.success("ثبت نام با موفقیت انجام شد! 🎉");

      // Save user data to localStorage (temporary)
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 1,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          role: "user",
        })
      );

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast.error("خطا در ثبت نام! لطفاً دوباره تلاش کنید.");
      console.error("Register error:", error);
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
        <h2 className="text-3xl font-bold text-gray-900">عضویت در چیزمارکت</h2>
        <p className="mt-2 text-gray-600">حساب کاربری جدید ایجاد کنید</p>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register("firstName")}
            label="نام"
            type="text"
            placeholder="نام خود را وارد کنید"
            error={errors.firstName?.message}
            icon={<User />}
            autoComplete="given-name"
          />

          <Input
            {...register("lastName")}
            label="نام خانوادگی"
            type="text"
            placeholder="نام خانوادگی خود را وارد کنید"
            error={errors.lastName?.message}
            icon={<User />}
            autoComplete="family-name"
          />
        </div>

        <Input
          {...register("email")}
          label="ایمیل"
          type="email"
          placeholder="example@domain.com"
          error={errors.email?.message}
          icon={<Mail />}
          autoComplete="email"
        />

        <Input
          {...register("phone")}
          label="شماره موبایل"
          type="tel"
          placeholder="09123456789"
          error={errors.phone?.message}
          icon={<Phone />}
          autoComplete="tel"
        />

        <Input
          {...register("password")}
          label="رمز عبور"
          type="password"
          placeholder="رمز عبور قوی انتخاب کنید"
          error={errors.password?.message}
          icon={<Lock />}
          showPasswordToggle
          autoComplete="new-password"
        />

        <Input
          {...register("confirmPassword")}
          label="تکرار رمز عبور"
          type="password"
          placeholder="رمز عبور را دوباره وارد کنید"
          error={errors.confirmPassword?.message}
          icon={<Lock />}
          showPasswordToggle
          autoComplete="new-password"
        />

        <div className="space-y-3">
          <label className="flex items-start">
            <input
              {...register("acceptTerms")}
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
            />
            <span className="mr-2 text-sm text-gray-600 leading-5">
              <Link
                to="#"
                className="text-blue-600 hover:text-blue-500 hover:underline"
              >
                قوانین و مقررات
              </Link>{" "}
              و{" "}
              <Link
                to="#"
                className="text-blue-600 hover:text-blue-500 hover:underline"
              >
                حریم خصوصی
              </Link>{" "}
              را مطالعه کرده و می‌پذیرم.
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
          )}
        </div>

        <Button type="submit" loading={isLoading} fullWidth size="lg">
          ثبت نام
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

      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-600">
          قبلاً ثبت نام کرده‌اید؟{" "}
          <Link
            to="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
