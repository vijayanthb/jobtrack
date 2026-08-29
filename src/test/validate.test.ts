import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidStage } from "../validate.js";

test("accepts every known stage", () => {
  for (const stage of [
    "applied",
    "phone_screen",
    "technical",
    "onsite",
    "offer",
    "rejected",
    "withdrawn",
  ]) {
    assert.equal(isValidStage(stage), true);
  }
});

test("rejects unknown stages", () => {
  assert.equal(isValidStage("bogus"), false);
  assert.equal(isValidStage(""), false);
  assert.equal(isValidStage("Applied"), false); // case-sensitive
});
