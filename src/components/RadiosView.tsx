import { Card, CardBody, Form } from "react-bootstrap";
import useAssignmentStore from "../stores/useAssignmentStore";

type Props = {};

function RadiosView({}: Props) {
  const { typeView, setTypeView } = useAssignmentStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeView(e.target.id); // Guardamos "actual" o "custom" según el ID
  };

  return (
    <div>
      <Card className="text-center">
        <Card.Header className="fw-bold">View</Card.Header>
        <CardBody>
          <Form.Check
            inline
            label="Actual"
            name="group1"
            type="radio"
            id="actual"
            checked={typeView === "actual"}
            onChange={handleChange}
          />
          <Form.Check
            inline
            label="Custom"
            name="group1"
            type="radio"
            id="custom"
            checked={typeView === "custom"}
            onChange={handleChange}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default RadiosView;
