import { useEffect, useState } from "react";
import Headings from "../../components/Headings";
import { api } from "../../api/api";
import DoctorInfo from "../../components/DoctorInfo";

const DoctorProfile = () => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/doctor/profile");
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  // Convert user object to array for dynamic cards rendering
  const userData = Object.entries(user).map(([key, value]) => {
    let displayValue;

    if (Array.isArray(value)) displayValue = value.length ? value.join(", ") : "None";
    else if (typeof value === "boolean") displayValue = value ? "Yes" : "No";
    else displayValue = value;

    const fieldName = key
      .replace(/_/g, " ")         // handle snake_case
      .replace(/([A-Z])/g, " $1") // handle camelCase
      .replace(/^./, (str) => str.toUpperCase());

    return { fieldName, value: displayValue };
  });

  return (
    <div className="flex flex-col items-center my-18 px-48">
      <Headings text="See what's on your calendar" className="my-8 text-center" />
      <DoctorInfo data={userData} />
    </div>
  );
};

export default DoctorProfile;
