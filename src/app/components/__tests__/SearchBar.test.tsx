import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBar from "../SearchBar";
import { LanguageProvider } from "../../context/LanguageContext";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: "mock-user-id" } } },
        error: null,
      }),
      onAuthStateChange: jest.fn(() => ({
        data: null,
        subscription: { unsubscribe: jest.fn() },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn((cb) => cb({ data: [{ id: "mock-record" }], error: null })),
    })),
  },
}));

function renderWithProvider(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

test("muestra input y botón", () => {
  renderWithProvider(<SearchBar />);
  expect(screen.getByPlaceholderText(/buscar medicamento/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /buscar/i })).toBeInTheDocument();
});

test("al enviar llama a fetch y renderiza resultados", async () => {
  (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => [{ id: "1", nombre: "A", farmacias: [] }],
  });

  renderWithProvider(<SearchBar />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "A" } });
  fireEvent.click(screen.getByRole("button", { name: /buscar/i }));

  expect(screen.getByText(/buscando/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith("/api/medicamentos?nombre=A");
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
