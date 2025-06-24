import { render, screen, fireEvent, act } from "@testing-library/react";
import MedicamentosCard, { Medicamento } from "../MedicamentosCard";
import { LanguageProvider } from "../../context/LanguageContext";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockUnsub = jest.fn();

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: "mock-user-id" } } },
        error: null,
      }),
      onAuthStateChange: jest.fn(() => ({
        data: null,
        subscription: { unsubscribe: mockUnsub },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn((cb) => cb({ data: [], error: null })), // <-- Aquí retorna array vacío para que guardado sea false
    })),
  },
}));

const mockMed: Medicamento = {
  id: "1",
  nombre: "Ibuprofeno",
  farmacias: [{ nombre: "Farmacia1", direccion: "Dir", precio: 100, fecha: "2025-06-23" }],
};

function renderWithProvider(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

test("muestra datos y botón guardar", async () => {
  await act(async () => {
    renderWithProvider(<MedicamentosCard medicamento={mockMed} />);
  });
  expect(screen.getByText("Ibuprofeno")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /guardar en frecuentes/i })).toBeInTheDocument();
});

test("al hacer click guarda medicamento y actualiza texto", async () => {
  (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({ ok: true });

  await act(async () => {
    renderWithProvider(<MedicamentosCard medicamento={mockMed} />);
  });

  fireEvent.click(screen.getByRole("button", { name: /guardar en frecuentes/i }));

  // Espera el cambio de texto a "Eliminar de frecuentes"
  await screen.findByRole("button", { name: /eliminar de frecuentes/i });

  expect(global.fetch).toHaveBeenCalledWith(
    "/api/frecuentes",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ user_id: "mock-user-id", medicamento_id: "1" }),
    })
  );
});
