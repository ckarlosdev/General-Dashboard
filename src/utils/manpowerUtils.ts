import type { DrEmployee, Employee } from "../types";

const timeToDecimalHours = (time: string) => {
  if (!time || typeof time !== "string" || !time.includes(":")) {
    return 0;
  }
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

export const manpowerTotals = (data: DrEmployee[]) => {
  const totals = data.reduce(
    (totals, employee) => {
      const inDecimal = timeToDecimalHours(employee.inHour);
      const outDecimal = timeToDecimalHours(employee.outHour);
      const hoursWorked =
        outDecimal -
        inDecimal -
        (employee.lunch.toLowerCase() === "true" ? 0.5 : 0);

      totals.qty += 1;
      totals.totalHours += Math.max(0, hoursWorked);

      return totals;
    },
    { qty: 0, totalHours: 0 },
  );
  return totals;
};

export const manpowerRoleCounts = (data: DrEmployee[], employees: Employee[]) => {
  const manpowerCounts = data.reduce(
    (totals, employee) => {
      const empData = employees?.find(
        (emp) => emp.employeesId === employee.employeesId,
      );
      if (!empData) return totals;

      const role = empData.title;
      const inHour = employee.inHour.slice(0, 5);
      const outHour = employee.outHour.slice(0, 5);

      const uniqueKey = `${role}-${inHour}-${outHour}`;

      if (!totals[uniqueKey]) {
        const inDecimal = timeToDecimalHours(inHour);
        const outDecimal = timeToDecimalHours(outHour);
        const rawTotal = outDecimal - inDecimal;
        const totalHours = Math.round(Math.max(0, rawTotal) * 100) / 100;

        totals[uniqueKey] = {
          qty: 0,
          title: role,
          in: inHour,
          out: outHour,
          total: totalHours,
        };
      }

      totals[uniqueKey].qty += 1;

      return totals;
    },
    {} as Record<
      string,
      { qty: number; title: string; in: string; out: string; total: number }
    >,
  );

  return manpowerCounts;
};
