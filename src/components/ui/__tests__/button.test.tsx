// @ts-nocheck
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  test("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("renders with default variant", () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByText("Default Button");
    expect(button).toBeInTheDocument();
  });

  test("renders with ghost variant", () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByText("Ghost Button");
    expect(button).toBeInTheDocument();
  });

  test("renders disabled button", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText("Disabled Button");
    expect(button).toBeDisabled();
  });

  test("renders with small size", () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByText("Small Button");
    expect(button).toBeInTheDocument();
  });

  test("renders with large size", () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByText("Large Button");
    expect(button).toBeInTheDocument();
  });

  test("renders with icon size", () => {
    render(<Button size="icon">Icon</Button>);
    const button = screen.getByText("Icon");
    expect(button).toBeInTheDocument();
  });
});
