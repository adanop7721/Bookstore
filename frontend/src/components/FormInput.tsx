import { InputHTMLAttributes } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
}

const FormInput = ({
  label,
  error,
  registration,
  ...props
}: FormInputProps) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
      )}
      <input
        {...registration}
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;
