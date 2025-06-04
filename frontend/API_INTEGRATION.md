# API Integration Documentation

## تغییرات انجام شده

### 1. سرویس API (`src/services/api.ts`)

- ایجاد کلاس `ApiService` برای مدیریت درخواست‌های HTTP
- پیاده‌سازی متدهای `register`, `login`, `refreshToken`, و `getUserInfo`
- مدیریت خطاها و token های احراز هویت
- Base URL: `http://localhost:3100`

### 2. Context احراز هویت (`src/contexts/AuthContext.tsx`)

- ایجاد `AuthProvider` برای مدیریت وضعیت احراز هویت
- پیاده‌سازی متدهای `login`, `register`, `logout`, و `refreshUserInfo`
- مدیریت خودکار refresh token
- دریافت خودکار اطلاعات کاربر از API
- ذخیره اطلاعات کاربر در localStorage

### 3. کامپوننت Register (`src/components/auth/Register.tsx`)

- حذف فیلد `phone` و اضافه کردن فیلد `username`
- اتصال به API واقعی به جای mock data
- استفاده از `useAuth` hook
- مدیریت خطاهای API

### 4. کامپوننت Login (`src/components/auth/Login.tsx`)

- تغییر فیلد `email` به `username`
- اتصال به API واقعی
- استفاده از `useAuth` hook
- مدیریت خطاهای API

### 5. ProtectedRoute (`src/components/auth/ProtectedRoute.tsx`)

- استفاده از `AuthContext` به جای localStorage
- اضافه کردن loading state
- بهبود UX با نمایش spinner

### 6. Dashboard (`src/components/dashboard/Dashboard.tsx`)

- نمایش اطلاعات واقعی کاربر از API
- نمایش نام کامل، نام کاربری، ایمیل، نقش‌ها، گروه‌ها و کلاینت‌ها
- بهبود UI برای نمایش اطلاعات کاربر
- استفاده از `useAuth` hook

### 7. Main App (`src/main.tsx`)

- اضافه کردن `AuthProvider` به root component

## API Endpoints

### Register

- **URL**: `POST /auth/register`
- **Body**:
  ```json
  {
    "email": "string",
    "username": "string",
    "password": "string",
    "confirmPassword": "string",
    "firstName": "string",
    "lastName": "string"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "string",
    "refresh_token": "string"
  }
  ```

### Login

- **URL**: `POST /auth/login`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "string",
    "refresh_token": "string"
  }
  ```

### Refresh Token

- **URL**: `POST /auth/refresh`
- **Body**:
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "string",
    "refresh_token": "string"
  }
  ```

### Get User Info

- **URL**: `GET /user/get-info`
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "_id": "string",
    "kid": "string",
    "email": "string",
    "username": "string",
    "firstName": "string",
    "lastName": "string",
    "clients": ["string"],
    "roles": [
      {
        "id": "string",
        "title": "string",
        "client_id": "string"
      }
    ],
    "groups": ["string"],
    "created_at": "string",
    "updated_at": "string"
  }
  ```

## نحوه استفاده

### در کامپوننت‌ها:

```tsx
import { useAuth } from "../contexts/AuthContext";

const MyComponent = () => {
  const { user, isAuthenticated, login, register, logout, refreshUserInfo } =
    useAuth();

  // دسترسی به اطلاعات کاربر
  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username;

  // نمایش نقش‌های کاربر
  const userRoles = user?.roles?.map((role) => role.title).join(", ");

  // استفاده از متدها...
};
```

### برای محافظت از route ها:

```tsx
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <MyProtectedComponent />
    </ProtectedRoute>
  }
/>
```

## ویژگی‌های جدید

### نمایش اطلاعات کاربر در Dashboard

- **نام کامل**: نمایش firstName + lastName
- **نام کاربری**: username
- **ایمیل**: email address
- **نقش‌ها**: لیست roles با نمایش زیبا
- **گروه‌ها**: لیست groups
- **کلاینت‌ها**: لیست clients
- **آواتار**: نمایش حروف اول نام یا نام کاربری

### مدیریت خودکار اطلاعات کاربر

- دریافت خودکار اطلاعات پس از login/register
- refresh خودکار در صورت موجود بودن token
- پاک‌سازی خودکار در صورت خطا

## نکات مهم

1. **Token Management**: Token ها به صورت خودکار در localStorage ذخیره می‌شوند
2. **Auto Refresh**: Token ها و اطلاعات کاربر به صورت خودکار refresh می‌شوند
3. **Error Handling**: خطاهای API به صورت مناسب نمایش داده می‌شوند
4. **Loading States**: حالت loading در طول درخواست‌ها نمایش داده می‌شود
5. **RTL Support**: پشتیبانی کامل از راست به چپ
6. **Real User Data**: نمایش اطلاعات واقعی کاربر از backend
7. **Role-based Display**: نمایش نقش‌ها و گروه‌های کاربر

## تست کردن

1. Backend را روی پورت 3100 اجرا کنید
2. Frontend را اجرا کنید
3. صفحه register یا login را باز کنید
4. فرم را پر کرده و ارسال کنید
5. در صورت موفقیت، به dashboard منتقل می‌شوید
6. اطلاعات واقعی کاربر از backend نمایش داده می‌شود
