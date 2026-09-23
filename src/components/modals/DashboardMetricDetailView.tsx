import { PhotosDetails } from "../details/PhotosDetails";
import { RentalsDetails } from "../details/RentalsDetails";
import { ToolsDetails } from "../details/ToolDetails";
import { DumpstersDetails } from "./DumpstersDetails";

interface DashboardMetricDetailViewProps {
  type: string;
  data: any;
  startDate: string;
  endDate: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export const DashboardMetricDetailView: React.FC<
  DashboardMetricDetailViewProps
> = ({ type, data, startDate, endDate, onPrevWeek, onNextWeek }) => {
  if (!data) {
    return (
      <div className="text-muted text-center py-3">
        No details available for this metric.
      </div>
    );
  }

  // Según la métrica seleccionada, renderizamos la lista/cards correspondiente
  switch (type) {
    case "Dumpsters":
      return (
        <DumpstersDetails
          data={data.dumpsters}
          startDate={startDate}
          endDate={endDate}
          onPrevWeek={onPrevWeek}
          onNextWeek={onNextWeek}
        />
      );

    case "Photos":
      return (
        <PhotosDetails
          data={data.photos}
          startDate={startDate}
          endDate={endDate}
          onPrevWeek={onPrevWeek}
          onNextWeek={onNextWeek}
        />
      );

    case "Rental":
      return (
        <RentalsDetails
          data={data.rentals}
          startDate={startDate}
          endDate={endDate}
          onPrevWeek={onPrevWeek}
          onNextWeek={onNextWeek}
        />
      );

    case "Tool Owner":
      return (
        <ToolsDetails
          title="Tool Owner Summary"
          data={data.tools}
          startDate={startDate}
          endDate={endDate}
          onPrevWeek={onPrevWeek}
          onNextWeek={onNextWeek}
        />
      );

    case "Tool Rental":
      return (
        <ToolsDetails
          title="Tool Rental Summary"
          data={data.tools}
          startDate={startDate}
          endDate={endDate}
          onPrevWeek={onPrevWeek}
          onNextWeek={onNextWeek}
        />
      );

    case "Tool Other":
      return (
        <ToolsDetails
          title="Tool Other Summary"
          data={data.tools}
          startDate={startDate}
          endDate={endDate}
          onPrevWeek={onPrevWeek}
          onNextWeek={onNextWeek}
        />
      );

    // case "Attachment":
    //   return <AttachmentsDetails data={data.attachments} />;

    default:
      return (
        <div className="text-muted text-center py-3">
          Metric not supported yet.
        </div>
      );
  }
};
