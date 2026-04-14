import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import Loader from "../Loader.jsx";

describe("Loader", () => {
  it("renders loader container", () => {
    render(<Loader />);

    const loader = document.querySelector(".spinner");
    expect(loader).toBeInTheDocument();
  });

  it("renders two spinner dots", () => {
    render(<Loader />);

    const dot1 = document.querySelector(".dot1");
    const dot2 = document.querySelector(".dot2");

    expect(dot1).toBeInTheDocument();
    expect(dot2).toBeInTheDocument();
  });

  it("has correct structure", () => {
    const { container } = render(<Loader />);

    const spinner = container.querySelector(".spinner");
    const dots = spinner.querySelectorAll("div");

    expect(dots.length).toBe(2);
  });
});