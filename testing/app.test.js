import { render } from "@testing-library/react-native";
import App from "../App";

test("renders welcome message", async () => {
  const { findByText } = render(<App />);
  const welcome = await findByText(/welcome to/i);
  expect(welcome).toBeTruthy();
});
