import { useEffect, useState } from "react";
import DoctorStatusTabs from "../../components/user/admin/doctors/DoctorStatusTabs";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { getAllDoctors } from "../../api/admin/adminApis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/shared/components/DataTable";
import { doctorColumns } from "../../components/shared/configs/TableConfigs";

const ViewDoctors = () => {
  const [activeTab, setActiveTab] = useState("approved");
  const [doctors, setDoctors] = useState(null);
  const fetchAllDoctorsAction = useAsyncAction();
  const navigate = useNavigate();

  const fetchAllDoctors = () => {
    fetchAllDoctorsAction.executeAsyncFn(async () => {
      const response = await getAllDoctors();
      if (!response.success) {
        toast.error("Failed to load data");
        return;
      }
      setDoctors(response.users);
    });
  };

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const handleView = (id) => {
    navigate(`/admin/doctor/${id}`);
  };
  console.log("data from api", doctors);
  const filteredDoctors = doctors?.filter((doc) => doc.status === activeTab);
  console.log(filteredDoctors);

  return (
    <div className="p-12 mt-18 min-h-screen">
      <DoctorStatusTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* <DoctorsTable
        doctors={filteredDoctors}
        onView={handleView}
      /> */}

      <DataTable
        data={filteredDoctors}
        columns={doctorColumns}
        onView={handleView}
      />
    </div>
  );
};

export default ViewDoctors;
