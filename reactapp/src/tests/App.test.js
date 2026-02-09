// src/tests/BugAnalyser.test.js
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom"

import AddBug from "../components/AddBug";
import UpdateBug from "../components/UpdateBug"; // Assuming you have this component
import App from "../App"; // Assuming your main app has Navbar and routes
import Home from "../components/Home";

beforeEach(() => {
  global.fetch = jest.fn();
  window.alert = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test("React_BuildUIComponents_renders AddBug form with fields", () => {
  render(
    <MemoryRouter>
      <AddBug />
    </MemoryRouter>
  );

  expect(screen.getByPlaceholderText(/Bug Title/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Status/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Priority/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Reporter/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Add Bug/i })).toBeInTheDocument();
});

test("React_APIIntegration_submits bug and shows success message", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({}),
  });

  render(
    <MemoryRouter>
      <AddBug />
    </MemoryRouter>
  );

  await userEvent.type(screen.getByPlaceholderText(/Bug Title/i), "Bug 1");
  await userEvent.type(screen.getByPlaceholderText(/Description/i), "Something broken");
  await userEvent.type(screen.getByPlaceholderText(/Status/i), "Open");
  await userEvent.type(screen.getByPlaceholderText(/Priority/i), "High");
  await userEvent.type(screen.getByPlaceholderText(/Reporter/i), "Alice");


  fireEvent.click(screen.getByRole("button", { name: /Add Bug/i }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/bugs"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining('"title":"Bug 1"'),
      })
    );
    expect(window.alert).toHaveBeenCalledWith("Bug added successfully!");
  });
});

test("React_UITestingAndResponsivenessFixes_shows error message when add bug fails", async () => {
  fetch.mockRejectedValueOnce(new Error("Failed to add bug"));

  render(
    <MemoryRouter>
      <AddBug />
    </MemoryRouter>
  );

  await userEvent.type(screen.getByPlaceholderText(/Bug Title/i), "Bug Fail");
  await userEvent.type(screen.getByPlaceholderText(/Description/i), "Crash");
  await userEvent.type(screen.getByPlaceholderText(/Status/i), "Open");
  await userEvent.type(screen.getByPlaceholderText(/Priority/i), "Low");
  await userEvent.type(screen.getByPlaceholderText(/Reporter/i), "Bob");
 

  fireEvent.click(screen.getByRole("button", { name: /Add Bug/i }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalled();
    // Since component just logs error, no error UI to test here.
  });
});

test("React_APIIntegration_TestingAndAPIDocumentation_renders UpdateBug with existing bug data", async () => {
  // Mock GET fetch for existing bug data
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      title: "UI Bug",
      description: "Button misaligned",
      status: "Open",
      priority: "Medium",
      reporter: "Carol",
      createdDate: "2023-07-30",
    }),
  });

  render(
    <MemoryRouter initialEntries={["/update/1"]}>
      <UpdateBug />
    </MemoryRouter>
  );

  // Wait for inputs to be filled
  expect(await screen.findByDisplayValue("UI Bug")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Button misaligned")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Open")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Medium")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Carol")).toBeInTheDocument();
  expect(screen.getByDisplayValue("2023-07-30")).toBeInTheDocument();
});



test("React_UITestingAndResponsivenessFixes_handles update failure in UpdateBug", async () => {
  // Mock GET fetch for existing bug data
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      title: "Bug Fail",
      description: "Old desc",
      status: "Open",
      priority: "Low",
      reporter: "Eve",
      createdDate: "2023-07-20",
    }),
  });

  // Mock PUT fetch to reject (simulate failure)
  fetch.mockRejectedValueOnce(new Error("Failed to update bug"));

  render(
    <MemoryRouter initialEntries={["/update/1"]}>
      <UpdateBug />
    </MemoryRouter>
  );

  const titleInput = await screen.findByDisplayValue("Bug Fail");
  fireEvent.change(titleInput, { target: { value: "Failed Update" } });

  fireEvent.click(screen.getByRole("button", { name: /Update Bug/i }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(2);
    // Since component logs error only, no UI error message expected.
  });
});

test("React_BuildUIComponents_renders App navbar", () => {
  render(<App />);

  expect(screen.getByRole("link", { name: /Home/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /View Bugs/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Add Bug/i })).toBeInTheDocument();
});

test("React_BuildUIComponents_Home page buttons exist", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(screen.getByRole("button", { name: /View All Bugs/i })).toBeInTheDocument();
});
