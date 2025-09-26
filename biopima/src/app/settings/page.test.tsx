import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddUser from "./page";


const mockAddUser = jest.fn();
const mockPush = jest.fn();
const mockResetMessages = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/",
}));

jest.mock("../hooks/useFetchUsers", () => ({
  __esModule: true,
  default: () => ({
    addUser: mockAddUser, 
    error: null,
    successMessage: null,
    resetMessages: mockResetMessages,
  }),
}));

describe("AddUser Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<AddUser />);
    expect(screen.getByRole("textbox", { name: /Institutional Name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /User Name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Email/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Phone Number/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add User/i })).toBeInTheDocument();
  });

  it("submits form with correct data and resets fields", async () => {
    mockAddUser.mockResolvedValueOnce({});

    render(<AddUser />);

    const institutionalInput = screen.getByRole("textbox", { name: /Institutional Name/i });
    const usernameInput = screen.getByRole("textbox", { name: /User Name/i });
    const emailInput = screen.getByRole("textbox", { name: /Email/i });
    const phoneInput = screen.getByRole("textbox", { name: /Phone Number/i });

    fireEvent.change(institutionalInput, { target: { value: "Koko solutions Ltd" } });
    fireEvent.change(usernameInput, { target: { value: "kokosolutions" } });
    fireEvent.change(emailInput, { target: { value: "contact@koko.com" } });
    fireEvent.change(phoneInput, { target: { value: "0734567890" } });

    fireEvent.click(screen.getByRole("button", { name: /Add User/i }));

    await waitFor(() => {
      expect(mockAddUser).toHaveBeenCalledWith({
        username: "kokosolutions",
        email: "contact@koko.com",
        name: "Koko solutions Ltd",
        phone_number: "0734567890",
        user_type: "Institutional operator",
        password: "bioPima123",
      });
    });

 
    expect(institutionalInput).toHaveValue("");
    expect(usernameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(phoneInput).toHaveValue("");
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<AddUser />);
    fireEvent.click(screen.getByRole("button", { name: /Add User/i }));

    await waitFor(() => {
      expect(screen.getByText("Institutional Name is required.")).toBeInTheDocument();
      expect(screen.getByText("User Name is required.")).toBeInTheDocument();
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
      expect(screen.getByText("Phone number is required.")).toBeInTheDocument();
    });

    expect(mockAddUser).not.toHaveBeenCalled();
  });
});