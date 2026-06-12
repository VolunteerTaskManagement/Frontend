import { Box, Field } from "@chakra-ui/react";

import Dropdown from "../common/Dropdown";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const Calendar = ({ label, value, onChange }: Props) => {
  const years = Array.from({ length: 60 }, (_, i) => 1405 - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const [year = "", month = "", day = ""] = value.split("/");

  const updateDate = (
    newYear: string,
    newMonth: string,
    newDay: string
  ) => {
    onChange(`${newYear}/${newMonth}/${newDay}`);
  };

  const dayOptions = days.map((d) => ({
    label: String(d),
    value: String(d),
  }));

  const monthOptions = [
    { label: "فروردین", value: "1" },
    { label: "اردیبهشت", value: "2" },
    { label: "خرداد", value: "3" },
    { label: "تیر", value: "4" },
    { label: "مرداد", value: "5" },
    { label: "شهریور", value: "6" },
    { label: "مهر", value: "7" },
    { label: "آبان", value: "8" },
    { label: "آذر", value: "9" },
    { label: "دی", value: "10" },
    { label: "بهمن", value: "11" },
    { label: "اسفند", value: "12" },
  ];

  const yearOptions = years.map((y) => ({
    label: String(y),
    value: String(y),
  }));

  return (
    <Field.Root w="full">
      <Box w="full" textAlign="right" pr="6">
        <Field.Label display="inline" fontWeight="bold">
          {label}
        </Field.Label>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr 1fr"
        gap="12px"
        px="4"
      >
        <Dropdown
          placeholder="روز"
          options={dayOptions}
          value={day}
          onChange={(newDay) => updateDate(year, month, newDay)}
          showLabel={false}
          px="0"
          centerText
        />

        <Dropdown
          placeholder="ماه"
          options={monthOptions}
          value={month}
          onChange={(newMonth) => updateDate(year, newMonth, day)}
          showLabel={false}
          px="0"
          centerText
        />

        <Dropdown
          placeholder="سال"
          options={yearOptions}
          value={year}
          onChange={(newYear) => updateDate(newYear, month, day)}
          showLabel={false}
          px="0"
          centerText
        />
      </Box>
    </Field.Root>
  );
};

export default Calendar;
