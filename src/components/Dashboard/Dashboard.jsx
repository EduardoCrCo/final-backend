import { Link } from "react-router-dom";

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <p>.</p>
      <p>.</p>
      <p>.</p>
      <p>.</p>

      <p>Welcome to your</p>

      <p>Dashboard</p>
      <Link to="/reviews">Go to Reviews</Link>
    </div>
  );
};
