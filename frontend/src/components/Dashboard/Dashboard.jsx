import { UserStatsTable } from "./UserStatsTable/UserStatsTable";
import VideoStatsTable from "./VideoStatsTable/VideoStatsTable";
import "../../blocks/dashboard.css";

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <header className="dashboard__header">
          <h1 className="dashboard__title">📊 Panel de Administración</h1>
          <p className="dashboard__subtitle">
            Gestión y estadísticas completas de usuarios y videos
          </p>
        </header>

        <main className="dashboard__content">
          <UserStatsTable />

          <VideoStatsTable />
        </main>
      </div>
    </div>
  );
};
