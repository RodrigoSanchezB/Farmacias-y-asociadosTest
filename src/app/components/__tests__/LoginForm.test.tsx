import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";

// Mock del router y contexto
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/context/LanguageContext", () => ({
  useLanguage: () => ({ lang: "es" }),  // idioma en español
}));

describe("LoginForm", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    localStorage.clear();
    pushMock.mockClear();
  });

  it("renderiza los campos correctamente", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ingresar" })).toBeInTheDocument();
  });

  it("permite escribir en los campos", () => {
    render(<LoginForm />);
    const emailInput = screen.getByPlaceholderText("Correo electrónico");
    const passwordInput = screen.getByPlaceholderText("Contraseña");

    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(emailInput).toHaveValue("test@email.com");
    expect(passwordInput).toHaveValue("123456");
  });

  it("hace el login exitoso y redirige", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "abc123", name: "Pedro" }),
    });

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "usuario@correo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "clave123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    await waitFor(() => {
      expect(localStorage.getItem("session")).toContain("abc123");
      expect(pushMock).toHaveBeenCalledWith("/home");
    });
  });

  it("muestra mensaje de error si el login falla", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ msg: "Credenciales inválidas" }),
    });
  
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "mal@correo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "incorrecta" },
    });
  
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
  
    await waitFor(() => {
      expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
    });
  });
});
