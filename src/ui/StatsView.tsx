import React from "react";
import { Box, Text } from "ink";
import { STAGES } from "../types.js";

interface Props {
  counts: { stage: string; count: number }[];
  total: number;
}

export function StatsView({ counts, total }: Props) {
  const countMap = new Map(counts.map((c) => [c.stage, c.count]));

  if (total === 0) {
    return (
      <Box paddingY={1}>
        <Text color="gray">No applications yet.</Text>
      </Box>
    );
  }

  const activeStages = ["applied", "phone_screen", "technical", "onsite"];
  const active = activeStages.reduce((sum, s) => sum + (countMap.get(s) ?? 0), 0);
  const offers = countMap.get("offer") ?? 0;
  const rejected = countMap.get("rejected") ?? 0;

  return (
    <Box flexDirection="column">
      <Text bold>Total applications: {total}</Text>
      <Box flexDirection="column" marginTop={1}>
        {STAGES.map((stage) => {
          const count = countMap.get(stage) ?? 0;
          const pct = ((count / total) * 100).toFixed(1);
          return (
            <Text key={stage}>
              {stage.padEnd(14)} {String(count).padStart(3)}  ({pct}%)
            </Text>
          );
        })}
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text color="cyan">Active pipeline: {active}</Text>
        <Text color="green">Offers: {offers}</Text>
        <Text color="red">Rejected: {rejected}</Text>
      </Box>
    </Box>
  );
}
