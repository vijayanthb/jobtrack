import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import SelectInput from "ink-select-input";
import { STAGES, type Stage, type NewApplication } from "../types.js";

const STEPS = ["company", "role", "stage", "date"] as const;
type Step = (typeof STEPS)[number];

interface Props {
  onSubmit: (app: NewApplication) => void;
  onCancel: () => void;
}

export function AddForm({ onSubmit, onCancel }: Props) {
  const [step, setStep] = useState<Step>("company");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [stage, setStage] = useState<Stage>("applied");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useInput((input, key) => {
    if (key.escape) onCancel();
  });

  if (step === "company") {
    return (
      <Box flexDirection="column">
        <Text bold>Add application — company name:</Text>
        <TextInput
          value={company}
          onChange={setCompany}
          onSubmit={(v) => {
            if (v.trim()) setStep("role");
          }}
        />
        <Text color="gray">Esc to cancel</Text>
      </Box>
    );
  }

  if (step === "role") {
    return (
      <Box flexDirection="column">
        <Text bold>Role / title:</Text>
        <TextInput
          value={role}
          onChange={setRole}
          onSubmit={(v) => {
            if (v.trim()) setStep("stage");
          }}
        />
        <Text color="gray">Esc to cancel</Text>
      </Box>
    );
  }

  if (step === "stage") {
    return (
      <Box flexDirection="column">
        <Text bold>Stage:</Text>
        <SelectInput
          items={STAGES.map((s) => ({ label: s, value: s }))}
          onSelect={(item) => {
            setStage(item.value as Stage);
            setStep("date");
          }}
        />
        <Text color="gray">Esc to cancel</Text>
      </Box>
    );
  }

  // date
  return (
    <Box flexDirection="column">
      <Text bold>Applied date (YYYY-MM-DD):</Text>
      <TextInput
        value={date}
        onChange={setDate}
        onSubmit={(v) => {
          const finalDate = v.trim() || new Date().toISOString().slice(0, 10);
          onSubmit({ company, role, stage, applied_date: finalDate });
        }}
      />
      <Text color="gray">Esc to cancel</Text>
    </Box>
  );
}
