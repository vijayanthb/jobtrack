import React from "react";
import { Box, Text } from "ink";
import type { Application } from "../types.js";

const STAGE_LABEL: Record<string, string> = {
  applied: "Applied",
  phone_screen: "Phone Screen",
  technical: "Technical",
  onsite: "Onsite",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const STAGE_COLOR: Record<string, string> = {
  applied: "gray",
  phone_screen: "cyan",
  technical: "blue",
  onsite: "magenta",
  offer: "green",
  rejected: "red",
  withdrawn: "yellow",
};

function col(text: string, width: number): string {
  const s = text.length > width ? text.slice(0, width - 1) + "…" : text;
  return s.padEnd(width);
}

interface Props {
  applications: Application[];
  selectedIndex: number;
}

export function ApplicationsTable({ applications, selectedIndex }: Props) {
  if (applications.length === 0) {
    return (
      <Box paddingY={1}>
        <Text color="gray">No applications yet. Press "a" to add one.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box>
        <Text bold color="white">
          {col("ID", 4)}
          {col("Company", 20)}
          {col("Role", 28)}
          {col("Stage", 14)}
          {col("Applied", 12)}
          {col("Next", 12)}
        </Text>
      </Box>
      {applications.map((app, i) => {
        const isSelected = i === selectedIndex;
        const stageColor = STAGE_COLOR[app.stage] ?? "white";
        const row =
          col(String(app.id), 4) +
          col(app.company, 20) +
          col(app.role, 28) +
          col(STAGE_LABEL[app.stage] ?? app.stage, 14) +
          col(app.applied_date, 12) +
          col(app.next_step_date ?? "-", 12);

        return (
          <Text key={app.id} backgroundColor={isSelected ? "blueBright" : undefined} color={isSelected ? "black" : stageColor}>
            {isSelected ? "› " : "  "}
            {row}
          </Text>
        );
      })}
    </Box>
  );
}
