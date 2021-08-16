/**
 * @jest-environment jsdom
 */
import { waitFor, screen, within, fireEvent } from "@testing-library/react";
import { render } from "helpers/testHelpers";
import { AppContent } from "views/AppContent";

jest.spyOn(console, "error").mockImplementation(() => {
  // do nothing
});

beforeEach(() => {
  render(<AppContent />);
});

test("renders page header", async () => {
  await waitFor(() => screen.getByTestId("page-header"));

  expect(screen.getByTestId("page-header")).toBeInTheDocument();
  expect(screen.getByTestId("network-picker")).toBeInTheDocument();
});

test("shows maintenance banner on test network", async () => {
  await waitFor(() => screen.getByTestId("network-picker"));

  const networkPickerEl = screen.getByTestId("network-picker");
  const publicLink = within(networkPickerEl).getByLabelText(/public/i);
  const testLink = within(networkPickerEl).getByLabelText(/test/i);

  fireEvent.click(publicLink);
  expect(screen.queryByTestId("maintenance-banner")).not.toBeInTheDocument();

  fireEvent.click(testLink);
  await waitFor(() => screen.queryByTestId("maintenance-banner"));
  expect(screen.queryByTestId("maintenance-banner")).toBeInTheDocument();
});

test("shows custom network modal", async () => {
  await waitFor(() => screen.getByTestId("network-picker"));

  const networkPickerEl = screen.getByTestId("network-picker");
  const customLink = within(networkPickerEl).getByLabelText(/custom/i);

  fireEvent.click(customLink);
  await waitFor(() => screen.queryByTestId("network-picker-custom-modal"));

  const customModalEl = screen.queryByTestId("network-picker-custom-modal");
  expect(customModalEl).toBeInTheDocument();
});

test("renders page navigation", async () => {
  await waitFor(() => screen.getByTestId("page-navigation"));

  const navigationEl = screen.getByTestId("page-navigation");
  expect(navigationEl).toBeInTheDocument();
  expect(screen.getAllByTestId("page-navigation-link")).toHaveLength(7);
});

test("renders page footer", async () => {
  await waitFor(() => screen.getByTestId("page-footer"));

  expect(screen.getByTestId("page-footer")).toBeInTheDocument();
});
