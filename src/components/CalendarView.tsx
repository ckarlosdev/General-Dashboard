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
import { useCallback, useMemo, useEffect } from "react";
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
      const eventDate = new Date(event.start);

      setDate(eventDate);
      setJobSelected(event.jobsId);
      setShowJobModal(true);
    },
    [setDate, setJobSelected, setShowJobModal],
  );

  const components = useMemo(
    () => ({
      event: ({ event }: EventProps<MyJobEvent>) => {
        switch (view) {
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
    [view],
  );

  const eventPropGetter = useCallback(() => {
    const isMonth = view === "month";

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
        cursor: "pointer",
      },
    };
  }, [view]);

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter((event) => {
      if (isJobFocusMode) {
        if (!selectedJobId) {
          return false;
        }

        return event.jobsId === selectedJobId;
      }

      return jobsSelected.includes(event.jobsId);
    });
  }, [jobsSelected, events, isJobFocusMode, selectedJobId]);

  
  useEffect(() => {
    let startRange: Date;
    let endRange: Date;

    if (view === "day") {
      startRange = startOfDay(date);
      endRange = endOfDay(date);
    } else if (view === "week") {
      startRange = startOfWeek(date, {
        weekStartsOn: 1,
      });

      endRange = endOfWeek(date, {
        weekStartsOn: 1,
      });
    } else {
      startRange = startOfWeek(startOfMonth(date), {
        weekStartsOn: 1,
      });

      endRange = endOfWeek(endOfMonth(date), {
        weekStartsOn: 1,
      });
    }

    const sameRange =
      currentRange.start.getTime() === startRange.getTime() &&
      currentRange.end.getTime() === endRange.getTime();

    if (!sameRange) {
      setCurrentRange({
        start: startRange,
        end: endRange,
      });
    }
  }, [view, date]);

  const handleNavigate = useCallback(
    (newDate: Date) => {
      setDate(newDate);

      clearSelected();
    },
    [setDate, clearSelected],
  );

  const handleView = useCallback(
    (newView: View) => {
      setView(newView);

      clearSelected();
    },
    [setView, clearSelected],
  );

  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date; action: "select" | "click" | "doubleClick" }) => {
      if (slotInfo.action === "click" || slotInfo.action === "select") {
        setDate(slotInfo.start);

        clearSelected();
      }
    },
    [setDate, clearSelected],
  );

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
            inset: 0,
            backgroundColor: "rgba(255,255,255,.6)",
            zIndex: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Loading events...
        </div>
      )}

      <Calendar
        longPressThreshold={500}
        dayLayoutAlgorithm="overlap"
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        view={view}
        date={date}
        onNavigate={handleNavigate}
        onView={handleView}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable={true}
        eventPropGetter={eventPropGetter}
        components={components}
        formats={calendarFormats}
        culture="en-US"
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
