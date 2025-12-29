import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { fetchDoctorProfile } from "../../api/doctor/doctorApis";
import toast from "react-hot-toast";

export default function DoctorDocuments() {
  const [documents, setDocuments] = useState([]);

  // ------------- Get user -------------
  const getUser = async () => {
    const response = await fetchDoctorProfile();
    if (!response.data.success) return toast.error("Data not found");

    const { professionalInfo } = response.data.user;
    console.log(professionalInfo)
    setDocuments(professionalInfo);
  }
    
  useEffect(() => {
    getUser();
  }, []);

  //------- REMOVE DOCUMENT ---------------
  const handleRemove = (doc) => {
    setDocuments((prev) => prev.filter((d) => d._id !== doc._id));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
  {documents?.experience?.map((exp) => (
    <div key={exp._id} className="mb-6">
      <p className="font-semibold">{exp.hospitalName}</p>

      {exp.experienceCertificate?.length > 0 ? (
        exp.experienceCertificate.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Experience Certificate"
            className="w-40 h-auto mt-2 rounded"
          />
        ))
      ) : (
        <p className="text-sm text-gray-400">No certificate uploaded</p>
      )}
    </div>
  ))}
</div>

  );
}
