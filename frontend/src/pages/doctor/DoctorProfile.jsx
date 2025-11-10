import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

const DoctorProfile = ({ doctor }) => {
  const [doctorData, setDoctorData] = useState(doctor || {});
  const [loading, setLoading] = useState(true);
  const fallback = "N/A";

  const fetchDoctor = async () => {
    try {
      const response = await api.get("/api/doctor/profile");
      if (response.data.success) {
        setDoctorData(response.data.doctor);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch doctor profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-8 md:p-10 space-y-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0096C7] to-[#007fa1] text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{doctorData.name || fallback}</h1>
            <p className="mt-2">Doctor ID: {doctorData.doctorId || fallback}</p>
            <p className="mt-1">{doctorData.email || fallback}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Icon icon="mdi:star" className="text-yellow-400 w-6 h-6" />
              <span className="font-semibold">{doctorData.rating || 0}</span>
            </div>
            {doctorData.isVerified && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Personal Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <p className="text-gray-500 font-medium">Gender</p>
            <p className="text-gray-800 font-semibold">{doctorData.gender || fallback}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <p className="text-gray-500 font-medium">DOB</p>
            <p className="text-gray-800 font-semibold">{doctorData.dob ? new Date(doctorData.dob).toDateString() : fallback}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <p className="text-gray-500 font-medium">Phone</p>
            <p className="text-gray-800 font-semibold">{doctorData.phone || fallback}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <p className="text-gray-500 font-medium">Location</p>
            <p className="text-gray-800 font-semibold">{doctorData.location || fallback}</p>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <p className="text-gray-500 font-medium">Status</p>
          <p className="text-gray-800 font-semibold capitalize">{doctorData.status || fallback}</p>
        </div>

        {/* Professional Info */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            {[
              { title: "Qualifications", items: doctorData.professionalInfo.qualifications },
              { title: "Specializations", items: doctorData.professionalInfo.specializations }
            ].map((section, idx) => (
              <div key={idx} className="flex-1 bg-[#f0f7ff] p-6 rounded-2xl shadow-md hover:shadow-xl transition">
                <p className="font-semibold text-gray-700 mb-3">{section.title}</p>
                {section.items?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item, i) => (
                      <span key={i} className="bg-[#0096C7]/20 text-[#0096C7] px-3 py-1 rounded-full text-sm">{item}</span>
                    ))}
                  </div>
                ) : <p className="text-gray-500">N/A</p>}
              </div>
            ))}
          </div>

          {/* Experience & Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
              <p className="font-semibold text-gray-700 mb-4">Experience</p>
              {doctorData.professionalInfo.experience?.length ? (
                doctorData.professionalInfo.experience.map((exp, idx) => (
                  <div key={idx} className="p-3 bg-[#f9fbff] rounded-lg flex justify-between mb-2">
                    <p>{exp.years} yrs at {exp.hospitalName}</p>
                    <p className="text-gray-500">{exp.location}</p>
                  </div>
                ))
              ) : <p className="text-gray-500">No experience added</p>}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
              <p className="font-semibold text-gray-700 mb-4">Education</p>
              {doctorData.professionalInfo.education?.length ? (
                doctorData.professionalInfo.education.map((edu, idx) => (
                  <div key={idx} className="p-3 bg-[#f9fbff] rounded-lg flex justify-between mb-2">
                    <p>{edu.degree} - {edu.college}</p>
                    <p className="text-gray-500">{edu.completionYear}</p>
                  </div>
                ))
              ) : <p className="text-gray-500">No education added</p>}
            </div>
          </div>
        </div>

        {/* Services */}
        <div>
          <p className="font-semibold text-gray-700 mb-4">Services</p>
          {doctorData.services?.length ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {doctorData.services.map((service, idx) => (
                <div key={idx} className="min-w-[250px] bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition flex-shrink-0">
                  <p className="font-semibold text-gray-700 mb-2">{service.serviceType}</p>
                  <p className="text-gray-800 font-medium mb-3">Fees: ${service.fees}</p>
                  {service.availableDates?.map((d, i) => (
                    <details key={i} className="mb-2">
                      <summary className="cursor-pointer font-medium">{new Date(d.date).toDateString()}</summary>
                      <div className="flex gap-2 flex-wrap mt-1">
                        {d.timeSlots?.map((t, j) => (
                          <span key={j} className="px-3 py-1 bg-[#0096C7]/20 text-[#0096C7] rounded-full text-sm">
                            {t.start} - {t.end}
                          </span>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500">No services added</p>}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
