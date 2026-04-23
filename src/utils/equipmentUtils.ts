import type { DrEquipment, DrRental } from "../types";

export const equipmentTotals = (equipments: DrEquipment[]) => {
  const totals = equipments.reduce(
    (totals, equipment) => {
      const hourDifference =
        equipment.type === "Equipment"
          ? Number(equipment.newHour) - Number(equipment.initialHour)
          : 0;

      totals.qty += 1;
      totals.totalHours += hourDifference;
      return totals;
    },
    { qty: 0, totalHours: 0 },
  );
  return totals;
};

export const countRentals = (data: DrRental[]) => {
  const totals = data.reduce(
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

  return totals;
};


