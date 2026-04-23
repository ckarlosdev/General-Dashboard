export const calendarFormats = {
  // Cambia "9:00 AM" por "9 AM" para que sea más corto
  timeGutterFormat: (date: Date, culture?: string, localizer?: any) =>
    localizer.format(date, "h a", culture),

  // Formato de la agenda (si la usas)
  eventTimeRangeFormat: (
    { start, end }: any,
    culture?: string,
    localizer?: any,
  ) =>
    localizer.format(start, "h:mm a", culture) +
    " - " +
    localizer.format(end, "h:mm a", culture),
};
