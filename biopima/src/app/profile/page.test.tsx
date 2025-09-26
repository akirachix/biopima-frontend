import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Profile from "./page";
import * as fetchProfileModule from "../utils/fetchProfile";
import { useUserSettings } from "../hooks/useFetchSettings";
import { useRouter } from "next/navigation";

jest.mock("../hooks/useFetchProfile", () => ({
  useUserSettings: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockUserData = {
  name: "Alice Johnson",
  email: "alice@example.com",
  phone_number: "5551234567",
  image: "https://example.com/alice.jpg",
};

describe("Profile Component", () => {
  let mockUpdateSettings: jest.Mock;
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockUpdateSettings = jest.fn().mockResolvedValue(true);
    (useUserSettings as jest.Mock).mockImplementation(() => ({
      updateSettings: mockUpdateSettings,
      updating: false,
      updateError: null,
      success: false,
    }));

    jest.spyOn(fetchProfileModule, "fetchUser").mockResolvedValue(mockUserData);

    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

    window.localStorage.setItem("userId", "456");
    window.localStorage.setItem("token", "securetoken");
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  test("renders loading initially", async () => {
    await act(async () => {
      render(<Profile />);
    });
    expect(screen.getByText(/loading your profile/i)).toBeInTheDocument();
  });

  test("loads and shows user data", async () => {
    await act(async () => {
      render(<Profile />);
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Johnson")).toBeInTheDocument();
      expect(screen.getByDisplayValue("alice@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("5551234567")).toBeInTheDocument();
      expect(screen.getByAltText("Profile")).toHaveAttribute(
        "src",
        mockUserData.image
      );
    });
  });

  test("updates form inputs and submits successfully", async () => {
    await act(async () => {
      render(<Profile />);
    });
    await waitFor(() => screen.getByDisplayValue("Alice"));

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Alicia" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "alicia@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "5557654321" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /update/i }));
    });

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.any(String),
        "456",
        {
          fullName: "Alicia",
          lastName: "Smith",
          email: "alicia@example.com",
          phone: "5557654321",
        },
        null,
        "securetoken"
      );
      expect(
        screen.getByText(/profile updated successfully/i)
      ).toBeInTheDocument();
    });
  });

  test("shows error message if update fails", async () => {
    mockUpdateSettings.mockResolvedValue(false);

    await act(async () => {
      render(<Profile />);
    });
    await waitFor(() => screen.getByDisplayValue("Alice"));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /update/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to update profile/i)).toBeInTheDocument();
    });
  });

  test("validates image file type on image upload", async () => {
    await act(async () => {
      render(<Profile />);
    });
    await waitFor(() => screen.getByDisplayValue("Alice"));

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const invalidFile = new File(["data"], "error.txt", { type: "text/plain" });
    const validFile = new File(["image"], "photo.png", { type: "image/png" });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    });
    expect(
      await screen.findByText(/please select a valid image file/i)
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [validFile] } });
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/please select a valid image file/i)
      ).not.toBeInTheDocument();
    });
  });

  test("handles logout modal open, cancel, and confirm logout", async () => {
    await act(async () => {
      render(<Profile />);
    });
    const logoutBtn = screen.getByTitle(/log out/i);
    fireEvent.click(logoutBtn);

    expect(screen.getByText(/confirm logout/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByText(/confirm logout/i)).not.toBeInTheDocument();

    fireEvent.click(logoutBtn);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /^log out$/i }));
    });

    expect(window.localStorage.getItem("userId")).toBeNull();
    expect(window.localStorage.getItem("token")).toBeNull();
    expect(window.localStorage.getItem("email")).toBeNull();
    expect(mockRouterPush).toHaveBeenCalledWith("/login");
  });
});
