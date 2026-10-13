import type { DrEquipment, DrRental } from "../types";

export const equipmentTotals = (equipments: DrEquipment[]) => {
  if (!Array.isArray(equipments)) {
    return { qty: 0, totalHours: 0 };
  }

  return equipments.reduce(
    (totals, equipment) => {
      const newHour = Number(equipment.newHour);
      const initialHour = Number(equipment.initialHour);

      let hourDifference = 0;

      if (equipment.type === "Equipment") {
        if (Number.isFinite(newHour) && Number.isFinite(initialHour)) {
          hourDifference = newHour - initialHour;
        }
      }

      totals.qty += 1;
      totals.totalHours += hourDifference;

      return totals;
    },
    { qty: 0, totalHours: 0 },
  );
};

export const countRentals = (data: DrRental[]) => {
  if (!Array.isArray(data)) {
    return { E: 0, A: 0 };
  }

  return data.reduce(
    (acc, item) => {
      if (item.equipmentType === "Equipment") {
        acc.E += 1;
      } else if (item.equipmentType === "Attachment") {
        acc.A += 1;
      }

      return acc;
    },
    { E: 0, A: 0 },
  );
};