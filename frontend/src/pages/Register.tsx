import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import FormInput from "../components/FormInput";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/register`, {
        email: data.email,
        password: data.password,
      });

      const { token } = res.data;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";

      if (message === "User already exists") {
        setError("email", { type: "manual", message });
      } else {
        setError("email", { type: "manual", message });
      }
    }
  };

  return (
    <div className="flex size-full items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <FormInput
          type="email"
          placeholder="Email"
          registration={register("email")}
          error={errors.email}
        />
        <FormInput
          type="password"
          placeholder="Password"
          registration={register("password")}
          error={errors.password}
        />
        <FormInput
          type="password"
          placeholder="Confirm Password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
