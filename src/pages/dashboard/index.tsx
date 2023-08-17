import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/panelHeader";

export function Dashboard() {
  return (
    <Container>
      <DashboardHeader/>
      <h1 className="text-3xl font-bold underline">Pagina Dashboard</h1>
    </Container>
  );
}
