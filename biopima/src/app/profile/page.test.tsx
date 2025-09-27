import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "./page";
import * as fetchProfileUtils from "../utils/fetchProfile";
import * as useUserSettingsHook from "../hooks/useFetchProfile";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../utils/fetchProfile");
jest.mock("../hooks/useFetchProfile");

jest.mock("../shared-components/Sidebar/Institution", () => {
  const MockedSidebar = () => <div>Sidebar</div>;
  MockedSidebar.displayName = "MockedSidebar";
  return MockedSidebar;
});

describe("Profile page", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (fetchProfileUtils.fetchUser as jest.Mock).mockResolvedValue({
      name: "John Doe",
      email: "john@example.com",
      username: "john123",
      phone_number: "123456789",
      image: null,
    });

    (useUserSettingsHook.useUserSettings as jest.Mock).mockReturnValue({
      updateSettings: jest.fn().mockResolvedValue(true),
      updating: false,
      updateError: false,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "userId") return "userId123";
      if (key === "token") return "token123";
      return null;
    });
  });

  test("renders loading initially", () => {
    render(<Profile />);
    expect(screen.getByText(/loading your profile/i)).toBeInTheDocument();
  });
});
