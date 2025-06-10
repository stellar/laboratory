import React, { createContext, useContext, useState } from "react";
import type { AnyObject } from "@/types/types";

interface FormErrorContextType {
  formError: AnyObject;
  setFormError: (error: AnyObject) => void;
  clearFormError: (path: string) => void;
}

const FormErrorContext = createContext<FormErrorContextType | undefined>(
  undefined,
);

export const FormErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formError, setFormError] = useState<AnyObject>({});

  const clearFormError = (path: string) => {
    setFormError((prev) => {
      const newError = { ...prev };
      delete newError[path];
      return newError;
    });
  };

  return (
    <FormErrorContext.Provider
      value={{ formError, setFormError, clearFormError }}
    >
      {children}
    </FormErrorContext.Provider>
  );
};

export const useFormError = () => {
  const context = useContext(FormErrorContext);

  if (context === undefined) {
    throw new Error("useFormError must be used within a FormErrorProvider");
  }
  return context;
};
