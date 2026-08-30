import React from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import { STAGES, type Stage } from "../types.js";
import type { Application } from "../types.js";

interface Props {
  application: Application;
  onSubmit: (stage: Stage) => void;
  onCancel: () => void;
}

export function UpdateStageForm({ application, onSubmit, onCancel }: Props) {
  useInput((input, key) => {
    if (key.escape) onCancel();
  });

  return (
    <Box flexDirection="column">
      <Text bold>
        Update stage for #{application.id} {application.company} — {application.role}
      </Text>
      <SelectInput
        items={STAGES.map((s) => ({ label: s, value: s }))}
        initialIndex={STAGES.indexOf(application.stage)}
        onSelect={(item) => onSubmit(item.value as Stage)}
      />
      <Text color="gray">Esc to cancel</Text>
    </Box>
  );
}
