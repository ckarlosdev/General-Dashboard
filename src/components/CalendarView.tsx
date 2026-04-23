import {
  Calendar,
  dateFnsLocalizer,
  type EventProps,
  type View,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, endOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCallback, useEffect, useMemo } from "react";
import "../styles/general.css";
import type { MyJobEvent } from "../types";
import AgendaView from "./events/AgendaView";
import DayView from "./events/DayView";
import WeekView from "./events/WeekView";
import useAssignmentStore from "../stores/useAssignmentStore";
import { calendarFormats } from "../utils/calendarUtils";
import useCalendarStore from "../stores/useCalendarStore";
import { useEvents } from "../hooks/useCalendar";
import MonthView from "./events/MonthView";

type Props = {};

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarView({}: Props) {
  const { jobsSelected, clearSelected } = useAssignmentStore();

  const {
    view,
    setView,
    date,
    setDate,
    setCurrentRange,
    currentRange,
    setShowJobModal,
    setJobSelected,
    selectedJobId,
    isJobFocusMode,
  } = useCalendarStore();

  const { start, end } = currentRange;

  const { data: events, isLoading } = useEvents(
    start,
    end,
    selectedJobId,
    isJobFocusMode,
  );

  const handleSelectEvent = useCallback(
    (event: any) => {
      setDate(new Date(event.start));
      setJobSelected(event.jobsId);
      setShowJobModal(true);
    },
    [setDate, setJobSelected, setShowJobModal],
  );

  const components = {
    event: ({ event }: EventProps<MyJobEvent>) => {
      if (view === "month") {
        // Vista super pequeña solo con ID
        return <MonthView event={event} />;
      }

      if (view === "week") {
        return <WeekView event={event} />;
      }

      if (view === "day") {
        return <DayView event={event} />;
      }

      if (view === "agenda") {
        return <AgendaView event={event} />;
      }

      return <span>{event.title}</span>;
    },
  };

  const eventPropGetter = () => {
    const isMonth = view === "month";
    return {
      style: {
        backgroundColor: isMonth ? "#3174ad" : "#f8f9fa", // Azul en mes, gris muy claro en día
        borderRadius: isMonth ? "12px" : "4px",
        opacity: isMonth ? 0.8 : 1,
        color: isMonth ? "white" : "#212529", // Texto blanco en mes, oscuro en día
        border: isMonth ? "none" : "1px solid #dee2e6",
        borderLeft: isMonth ? "none" : "4px solid #3174ad", // Línea azul lateral en vista día
        display: "block",
        padding: isMonth ? "0px 5px" : "8px",
        height: isMonth ? "18px" : "auto",
        overflow: "hidden",
      },
    };
  };

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter((event) => {
      if (isJobFocusMode) {
        if (!selectedJobId) return false;
        return event.jobsId === selectedJobId;
      }

      return jobsSelected.includes(event.jobsId);
    });
  }, [jobsSelected, events, isJobFocusMode, selectedJobId]);

  // const handleRangeChange = useCallback(
  //   (range: Date[] | { start: Date; end: Date }) => {
  //     if (view === "month" || view === "agenda") {
  //       const start = Array.isArray(range) ? range[0] : range.start;
  //       const end = Array.isArray(range) ? range[range.length - 1] : range.end;

  //       const normalizedStart = new Date(start);
  //       normalizedStart.setHours(0, 0, 0, 0);
  //       const normalizedEnd = new Date(end);
  //       normalizedEnd.setHours(23, 59, 59, 999);

  //       setCurrentRange({ start: normalizedStart, end: normalizedEnd });
  //     }
  //   },
  //   [view, setCurrentRange],
  // );

  const handleRangeChange = useCallback(
    (range: Date[] | { start: Date; end: Date }) => {
      // RBC envía un array en Month y Week, y un objeto en Day
      let s: Date, e: Date;

      if (Array.isArray(range)) {
        s = range[0];
        e = range[range.length - 1];
      } else {
        s = range.start;
        e = range.end;
      }

      const normalizedStart = new Date(s);
      normalizedStart.setHours(0, 0, 0, 0);
      const normalizedEnd = new Date(e);
      normalizedEnd.setHours(23, 59, 59, 999);

      setCurrentRange({ start: normalizedStart, end: normalizedEnd });
    },
    [setCurrentRange], // Quitamos 'view' de aquí para que no dependa de él
  );

  useEffect(() => {
    if (view === "day" || view === "week") {
      let s: Date, e: Date;

      if (view === "day") {
        // Creamos la fecha base
        s = new Date(date);
        s.setHours(0, 0, 0, 0); // Inicio absoluto del día

        e = new Date(date);
        e.setHours(23, 59, 59, 999); // Fin absoluto del día
      } else {
        // week
        s = startOfWeek(date, { weekStartsOn: 1 });
        s.setHours(0, 0, 0, 0);

        e = new Date(s);
        e.setDate(s.getDate() + 6);
        e.setHours(23, 59, 59, 999);
      }
      setCurrentRange({ start: s, end: e });
    }
  }, [date, view, setCurrentRange]);

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
    clearSelected();
    if (view === "day") {
      const s = new Date(newDate);
      s.setHours(0, 0, 0, 0);
      const e = new Date(newDate);
      e.setHours(23, 59, 59, 999);
      setCurrentRange({ start: s, end: e });
    }
  };

  // const handleView = (newView: View) => {
  //   setView(newView);
  //   clearSelected();
  // };

  const handleView = (newView: View) => {
    setView(newView);
    clearSelected();

    if (newView === "month") {
      const s = startOfMonth(date);
      const e = endOfMonth(date);
      setCurrentRange({
        start: startOfWeek(s, { weekStartsOn: 1 }),
        end: endOfWeek(e, { weekStartsOn: 1 }),
      });
    }
  };

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    setDate(slotInfo.start);
    clearSelected();
  };

  if (isLoading) return <span>Loading events...</span>;
  // if (isError) return <span style={{ color: "red" }}> Error </span>;
  // console.log(currentRange);

  return (
    <div style={{ height: "700px", backgroundColor: "white", padding: "5px" }}>
      <Calendar
        selectable={true} // <-- OBLIGATORIO para poder hacer clic en los cuadros
        longPressThreshold={1}
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventPropGetter}
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        formats={calendarFormats}
        culture="en-US"
        components={components}
        view={view} // Vista actual (Mes, Semana, etc.)
        date={date} // Fecha que se está mostrando
        onNavigate={handleNavigate} // Función para cambiar de mes/día (Ant/Sig)
        onView={handleView} // Función para cambiar entre Mes/Semana/Día
        onSelectEvent={handleSelectEvent}
        dayLayoutAlgorithm="no-overlap"
        popup={true}
        onRangeChange={handleRangeChange}
        messages={{
          next: "Next",
          previous: "Prev",
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          agenda: "Agenda",
        }}
      />
    </div>
  );
}

export default CalendarView;
