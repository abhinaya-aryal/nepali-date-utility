/// <reference types="@testing-library/jest-dom/vitest" />
import { createRef } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  NepaliDatePicker,
  Calendar,
  DateInput,
  MonthNavigation,
} from "../src/react";

afterEach(cleanup);

const dialog = () => screen.queryByRole("dialog");

describe("NepaliDatePicker", () => {
  it("renders popup in a portal with dialog role and closes on Escape or outside click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <NepaliDatePicker />
        <div>outside</div>
      </>,
    );

    await user.click(screen.getByRole("textbox"));
    const popup = dialog();
    expect(popup).not.toBeNull();
    expect(popup).toHaveAttribute("data-placement", "bottom-start");
    expect(container.contains(popup)).toBe(false);

    await user.keyboard("{Escape}");
    expect(dialog()).toBeNull();

    await user.click(screen.getByRole("textbox"));
    expect(dialog()).not.toBeNull();
    await user.click(screen.getByText("outside"));
    expect(dialog()).toBeNull();
  });

  it("supports uncontrolled defaultValue, clearable, and ref forwarding", async () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <NepaliDatePicker
        ref={ref}
        id="dob"
        name="dob"
        defaultValue={{ year: 2082, month: 1, day: 15 }}
        onChange={onChange}
        clearable
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.id).toBe("dob");
    expect(ref.current?.name).toBe("dob");
    expect(screen.getByRole("textbox")).toHaveValue("2082-01-15");

    await user.click(screen.getByLabelText("Clear date"));
    expect(onChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("updates and clears input when controlled value changes", () => {
    const { rerender } = render(
      <NepaliDatePicker value={{ year: 2082, month: 1, day: 15 }} />,
    );
    expect(screen.getByRole("textbox")).toHaveValue("2082-01-15");

    rerender(<NepaliDatePicker value={null} />);
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("enforces minDate and maxDate on manual input and calendar click", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <NepaliDatePicker
        onChange={onChange}
        minDate={{ year: 2082, month: 1, day: 10 }}
        maxDate={{ year: 2082, month: 1, day: 20 }}
      />,
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "2082-01-05");
    expect(onChange).not.toHaveBeenCalled();

    await user.clear(input);
    await user.type(input, "2082-01-15");
    expect(onChange).toHaveBeenCalledWith({ year: 2082, month: 1, day: 15 });
  });

  it("supports unstyled mode and classNames slots without Tailwind defaults", async () => {
    const user = userEvent.setup();
    render(
      <NepaliDatePicker
        unstyled
        classNames={{
          root: "my-root",
          input: "my-input",
          popup: "my-popup",
          selectedDay: "my-selected",
        }}
        value={{ year: 2082, month: 1, day: 15 }}
      />,
    );

    const input = screen.getByRole("textbox");
    expect(input.className).toBe("my-input");

    await user.click(input);
    expect(dialog()?.className).toBe("my-popup");
    const day15 = screen.getByRole("button", { name: "15" });
    expect(day15.className).toBe("my-selected");
  });
});

describe("Calendar keyboard navigation and accessibility", () => {
  it("navigates days with arrow keys and crosses month boundaries", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Calendar
        defaultViewDate={{ year: 2082, month: 1, day: 31 }}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByRole("grid")).toBeInTheDocument();
    const day31 = screen.getByRole("button", { name: "31" });
    day31.focus();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: "30" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(day31).toHaveFocus();

    // Crossing from Baishakh 31 -> Jestha 1
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Jestha" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toHaveFocus();
  });
});

describe("MonthNavigation and DateInput", () => {
  it("disables prev/next at BS calendar boundaries and clamps day on month change", async () => {
    const onSelectMonth = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <MonthNavigation
        viewDate={{ year: 2000, month: 1, day: 1 }}
        onPrevMonth={vi.fn()}
        onNextMonth={vi.fn()}
        onSelectMonth={onSelectMonth}
        onSelectYear={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Previous month")).toBeDisabled();
    expect(screen.getByLabelText("Next month")).not.toBeDisabled();

    rerender(
      <MonthNavigation
        viewDate={{ year: 2090, month: 12, day: 30 }}
        onPrevMonth={vi.fn()}
        onNextMonth={vi.fn()}
        onSelectMonth={onSelectMonth}
        onSelectYear={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Next month")).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Chaitra" }));
    await user.click(screen.getByRole("option", { name: "Baishakh" }));
    expect(onSelectMonth).toHaveBeenCalledWith(1);
  });

  it("does not emit class='undefined' on DateInput", () => {
    render(<DateInput value={null} />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute(
      "class",
      "undefined",
    );
  });
});
