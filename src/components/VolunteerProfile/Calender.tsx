import { Box, Field } from "@chakra-ui/react";

import Dropdown from "../common/Dropdown";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  futureOnly?: boolean;
}

const Calendar = ({ label, value, onChange, futureOnly=false }: Props) => {
  const toEnglishDigits = (value: string) =>
    value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
  
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = formatter.formatToParts(new Date());
  const currentYear = Number(toEnglishDigits(parts.find(p => p.type === "year")!.value));
  const currentMonth = Number(toEnglishDigits(parts.find(p => p.type === "month")!.value));
  const currentDay = Number(toEnglishDigits(parts.find(p => p.type === "day")!.value));

  const years = futureOnly
    ? Array.from({ length: 10 }, (_, i) => currentYear + i)
    : Array.from({ length: 60 }, (_, i) => currentYear - 18 - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const [yStr = "", mStr = "", dStr = ""] = value.split("/");
  const year = yStr ? String(Number(yStr)) : "";
  const month = mStr ? String(Number(mStr)) : "";
  const day = dStr ? String(Number(dStr)) : "";

  const updateDate = (
    newYear: string,
    newMonth: string,
    newDay: string
  ) => {
    onChange(`${newYear}/${newMonth}/${newDay}`);
  };

  const faNumber = new Intl.NumberFormat("fa-IR", { useGrouping: false });

  const dayOptions = days.filter((d) => {
    if (!futureOnly) return true;
    if (!year || !month) return true;
    if (Number(year) > currentYear) return true;
    if (Number(month) > currentMonth) return true;
    return d >= currentDay;
  })
  .map((d) => ({
    label: faNumber.format(d),
    value: String(d),
  }));

  const allMonths = [
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
  const monthOptions = allMonths.filter((m) => {
    if (!futureOnly) return true;
    if (!year) return true;
    if (Number(year) > currentYear) return true;
    return Number(m.value) >= currentMonth;
  });

  const yearOptions = years.map((y) => ({
    label: faNumber.format(y),
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
