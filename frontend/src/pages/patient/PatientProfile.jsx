import { useEffect, useState } from "react";
import Headings from "../../components/Headings";
import { api } from "../../api/api";
import InfoCards from "../../components/InfoCards";
import ShimmerCard from "../../components/ShimmerCard";

const PatientProfile = () => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/patient/profile");
      setUser(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const userData = user
  ? Object.entries(user)?.reduce((acc, [key, value]) => {
      let displayValue;
      if (Array.isArray(value)) displayValue = value.length ? value.join(", ") : "None";
      else if (typeof value === "boolean") displayValue = value ? "Yes" : "No";
      else displayValue = value;

      const fieldName = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
      acc[fieldName] = displayValue;
      return acc;
    }, {})
  : null;


  return (
    <div className="flex flex-col items-center min-h-screen px-48 pt-32">
    <Headings text="Keep your profile up to date" className="my-8 text-center" />
    <div className="flex-1 w-full">
      {user ? (
        <InfoCards data={userData} />
      ) : (
        <div>
          <ShimmerCard/>
          <ShimmerCard/>
        </div>
       
      )}
    </div>
  </div>
  );
};

export default PatientProfile;
