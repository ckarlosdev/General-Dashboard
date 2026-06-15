import {
  Calendar,
  dateFnsLocalizer,
  type EventProps,
  type View,
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  startOfDay,
  endOfDay,
} from "date-fns";
import { enUS } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCallback, useMemo, useEffect, useState } from "react";
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
    view: storeView,
    setView: setStoreView,
    date: storeDate,
    setDate: setStoreDate,
    setCurrentRange,
    currentRange,
    setShowJobModal,
    setJobSelected,
    selectedJobId,
    isJobFocusMode,
  } = useCalendarStore();

  // ESTADOS LOCALES: Evitan el desfase de renderizado sincrónico de RBC
  const [localView, setLocalView] = useState<View>(storeView);
  const [localDate, setLocalDate] = useState<Date>(storeDate);

  const { start, end } = currentRange;

  const { data: events, isLoading } = useEvents(
    start,
    end,
    selectedJobId,
    isJobFocusMode,
  );

  const handleSelectEvent = useCallback(
    (event: any) => {
      const eventDate = new Date(event.start);
      setStoreDate(eventDate);
      setLocalDate(eventDate);
      setJobSelected(event.jobsId);
      setShowJobModal(true);
    },
    [setStoreDate, setLocalDate, setJobSelected, setShowJobModal],
  );

  const components = useMemo(
    () => ({
      event: ({ event }: EventProps<MyJobEvent>) => {
        switch (localView) {
          case "month":
            return <MonthView event={event} />;
          case "week":
            return <WeekView event={event} />;
          case "day":
            return <DayView event={event} />;
          case "agenda":
            return <AgendaView event={event} />;
          default:
            return <span>{event.title}</span>;
        }
      },
    }),
    [localView],
  );

  const eventPropGetter = useCallback(() => {
    const isMonth = localView === "month";
    return {
      style: {
        backgroundColor: isMonth ? "#3174ad" : "#f8f9fa",
        borderRadius: isMonth ? "12px" : "4px",
        opacity: isMonth ? 0.8 : 1,
        color: isMonth ? "white" : "#212529",
        border: isMonth ? "none" : "1px solid #dee2e6",
        borderLeft: isMonth ? "none" : "4px solid #3174ad",
        display: "block",
        padding: isMonth ? "0px 5px" : "8px",
        height: isMonth ? "18px" : "auto",
        overflow: "hidden",
      },
    };
  }, [localView]);

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

  // UNIFICADO: Un solo Effect controla y sincroniza el rango cada vez que cambia la vista o la fecha
  useEffect(() => {
    let s: Date;
    let e: Date;

    if (localView === "day") {
      s = startOfDay(localDate);
      e = endOfDay(localDate);
    } else if (localView === "week") {
      s = startOfWeek(localDate, { weekStartsOn: 1 });
      e = new Date(s);
      e.setDate(s.getDate() + 6);
      e.setHours(23, 59, 59, 999);
    } else {
      // month o agenda
      const monthStart = startOfMonth(localDate);
      const monthEnd = endOfMonth(localDate);
      s = startOfWeek(monthStart, { weekStartsOn: 1 });
      e = endOfWeek(monthEnd, { weekStartsOn: 1 });
    }

    const hasChanged =
      !currentRange ||
      currentRange.start.getTime() !== s.getTime() ||
      currentRange.end.getTime() !== e.getTime();

    if (hasChanged) {
      setCurrentRange({ start: s, end: e });
    }

    // B) Controlar la Vista (Evita que setView explote)
    if (storeView !== localView) {
      setStoreView(localView);
    }

    // C) Controlar la Fecha (Evita que setStoreDate explote al hacer clic en eventos)
    // Comparamos el timestamp (getTime) porque dos objetos Date diferentes en memoria fallan al hacer !==
    if (!storeDate || storeDate.getTime() !== localDate.getTime()) {
      setStoreDate(localDate);
    }
  }, [localView, localDate, setCurrentRange, setStoreView, setStoreDate]);

  const handleNavigate = useCallback(
    (newDate: Date) => {
      setLocalDate(newDate);
      clearSelected();
    },
    [clearSelected],
  );

  const handleView = useCallback(
    (newView: View) => {
      setLocalView(newView);
      clearSelected();
    },
    [clearSelected],
  );

  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date }) => {
      setLocalDate(slotInfo.start);
      clearSelected();
    },
    [clearSelected],
  );

  useEffect(() => {
    setLocalView(storeView);
    setLocalDate(storeDate);
  }, [storeView, storeDate]);

  useEffect(() => {
    let s: Date;
    let e: Date;

    if (localView === "day") {
      s = startOfDay(localDate);
      e = endOfDay(localDate);
    } else if (localView === "week") {
      s = startOfWeek(localDate, { weekStartsOn: 1 });
      e = new Date(s);
      e.setDate(s.getDate() + 6);
      e.setHours(23, 59, 59, 999);
    } else {
      const monthStart = startOfMonth(localDate);
      const monthEnd = endOfMonth(localDate);
      s = startOfWeek(monthStart, { weekStartsOn: 1 });
      e = endOfWeek(monthEnd, { weekStartsOn: 1 });
    }

    setCurrentRange({ start: s, end: e });
  }, [localView, localDate, setCurrentRange]);

  return (
    <div
      style={{
        height: "700px",
        backgroundColor: "white",
        padding: "5px",
        position: "relative",
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            zIndex: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            color: "#3174ad",
          }}
        >
          Loading events...
        </div>
      )}

      <Calendar
        selectable={true}
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
        view={localView} // Controlado por estado local
        date={localDate} // Controlado por estado local
        onNavigate={handleNavigate}
        onView={handleView}
        onSelectEvent={handleSelectEvent}
        dayLayoutAlgorithm="no-overlap"
        popup={true}
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
