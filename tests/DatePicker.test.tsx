/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "../src/components/DatePicker";

afterEach(cleanup);

const popup = () => document.querySelector(".w-72") as HTMLElement | null;

describe("DatePicker popup positioning", () => {
  it("renders the calendar popup in a portal on document.body so it is not clipped by overflow ancestors", async () => {
    const user = userEvent.setup();
    const { container } = render(<DatePicker />);

    await user.click(screen.getByRole("textbox"));

    const calendar = popup();
    expect(calendar).not.toBeNull();
    expect(container.contains(calendar)).toBe(false);
    expect(document.body.contains(calendar)).toBe(true);
  });

  it("positions the popup below-start of the input by default", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    await user.click(screen.getByRole("textbox"));

    expect(popup()).toHaveAttribute("data-placement", "bottom-start");
  });

  it("closes the calendar when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    await user.click(screen.getByRole("textbox"));
    expect(popup()).not.toBeNull();

    await user.keyboard("{Escape}");
    expect(popup()).toBeNull();
  });

  it("closes the calendar when clicking outside the picker", async () => {
    const user = userEvent.setup();
    render(
      <>
        <DatePicker />
        <div>outside</div>
      </>,
    );

    await user.click(screen.getByRole("textbox"));
    expect(popup()).not.toBeNull();

    await user.click(screen.getByText("outside"));
    expect(popup()).toBeNull();
  });

  it("calls onChange and closes when a date is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DatePicker onChange={onChange} />);

    await user.click(screen.getByRole("textbox"));
    await user.click(screen.getByRole("button", { name: "15" }));

    expect(onChange).toHaveBeenCalled();
    expect(popup()).toBeNull();
  });
});
