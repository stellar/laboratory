/**
 * @jest-environment jsdom
 */
import { waitFor, screen } from "@testing-library/react";
import { render } from "helpers/testHelpers";
import { Introduction } from "views/Introduction";

test("renders introduction page", async () => {
  render(<Introduction />);
  await waitFor(() => screen.getByTestId("page-introduction"));
  expect(screen.getByTestId("page-introduction")).toBeInTheDocument();
});
