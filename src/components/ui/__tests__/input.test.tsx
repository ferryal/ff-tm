// @ts-nocheck
import { render, screen } from "@testing-library/react";
import { Input } from "../input";

describe("Input", () => {
  test("renders input element", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  test("renders input with placeholder", () => {
    render(<Input placeholder="Test input" />);
    const input = screen.getByPlaceholderText("Test input");
    expect(input).toBeInTheDocument();
  });

  test("renders with type password", () => {
    render(<Input type="password" placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");
  });

  test("renders disabled input", () => {
    render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByPlaceholderText("Disabled");
    expect(input).toBeDisabled();
  });

  test("renders with custom value", () => {
    render(<Input value="Hello" onChange={() => {}} />);
    const input = screen.getByDisplayValue("Hello") as HTMLInputElement;
    expect(input.value).toBe("Hello");
  });
});
