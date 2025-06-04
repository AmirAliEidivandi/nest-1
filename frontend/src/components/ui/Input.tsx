import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { type InputHTMLAttributes, forwardRef, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      showPasswordToggle = false,
      type,
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState(type);

    const togglePassword = () => {
      setShowPassword(!showPassword);
      setInputType(showPassword ? "password" : "text");
    };

    const inputClasses = clsx(
      "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400",
      "focus:outline-none focus:ring-blue-500 focus:border-blue-500",
      "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
      error &&
        "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500",
      icon && "pr-10",
      showPasswordToggle && type === "password" && "pl-10",
      className
    );

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">{icon}</div>
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            className={inputClasses}
            {...props}
          />

          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              className="absolute inset-y-0 left-0 pl-3 flex items-center"
              onClick={togglePassword}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              )}
            </button>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
