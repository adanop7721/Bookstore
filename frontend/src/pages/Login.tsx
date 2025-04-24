import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import FormInput from "../components/FormInput";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
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
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/login`, data);
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";

      if (message === "User does not exist") {
        setError("email", { type: "manual", message });
      } else if (message === "Incorrect password") {
        setError("password", { type: "manual", message });
      } else {
        setError("email", { type: "manual", message });
        setError("password", { type: "manual", message });
      }
    }
  };

  return (
    <div className="flex size-full items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
