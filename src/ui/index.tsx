import React from "react";
import { render } from "ink";
import { App } from "./App.js";

export async function launchUi(): Promise<void> {
  const { waitUntilExit } = render(<App />);
  await waitUntilExit();
}
