import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { useEffect } from "react";

const Dashboard = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Dashboard",
      },
    ]);
  }, [setBreadcrumbs]);
  return <div>Dummy Dashboard</div>;
};

export default Dashboard;
