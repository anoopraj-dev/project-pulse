import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fallback = "N/A";

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await api.get("/api/doctor/profile");
        if (response.data.success) {
          setDoctorData(response.data.user);
        } else {
          toast.error(response.data.message || "Failed to fetch profile");
        }
      } catch (error) {
        toast.error("Failed to fetch doctor profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (!doctorData) return <div className="text-center mt-20 text-red-600">Doctor profile not found.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 pt-30 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0096C7] to-[#007fa1] text-white rounded-lg p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">{`Dr. ${doctorData.name} `|| fallback}</h1>
          <p className="text-lg mt-1">Doctor ID: <span className="font-mono">{doctorData.doctorId || fallback}</span></p>
          <p className="mt-1">{doctorData.email || fallback}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <Icon icon="mdi:star" className="text-yellow-400 w-8 h-8" />
            <span className="text-2xl font-semibold">{doctorData.rating?.toFixed(1) || "0.0"}</span>
          </div>
          {doctorData.isVerified && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm select-none">
              Verified
            </span>
          )}
        </div>
      </header>

      {/* Personal Info and Status */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Gender", value: doctorData.gender },
          { label: "Date of Birth", value: doctorData.dob ? new Date(doctorData.dob).toLocaleDateString() : null },
          { label: "Phone", value: doctorData.phone },
          { label: "Location", value: doctorData.location },
          { label: "Status", value: doctorData.status },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white p-6 rounded-xl shadow transition hover:shadow-xl">
            <h3 className="text-gray-500 font-medium mb-2">{label}</h3>
            <p className="text-gray-900 font-semibold">{value || fallback}</p>
          </div>
        ))}
      </section>

      {/* Professional Info */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-8">Professional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Qualifications and Specializations */}
          <div className="space-y-8">
            {[
              { title: "Qualifications", items: doctorData.professionalInfo?.qualifications || [] },
              { title: "Specializations", items: doctorData.professionalInfo?.specializations || [] },
            ].map(({ title, items }) => (
              <div key={title} className="bg-[#f0f7ff] rounded-lg p-6 shadow hover:shadow-md">
                <h3 className="mb-4 font-semibold text-xl">{title}</h3>
                {items.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No {title.toLowerCase()} added.</p>
                )}
              </div>
            ))}
          </div>

          {/* Experience and Education */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow hover:shadow-md">
              <h3 className="mb-4 font-semibold text-xl">Experience</h3>
              {doctorData.professionalInfo?.experience?.length ? (
                doctorData.professionalInfo.experience.map((exp, idx) => (
                  <div key={idx} className="border-b last:border-b-0 pb-3 mb-3 last:mb-0">
                    <p className="font-medium">{exp.years} yr{exp.years > 1 ? "s" : ""} at {exp.hospitalName}</p>
                    <p className="text-gray-600">{exp.location}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No experience added.</p>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow hover:shadow-md">
              <h3 className="mb-4 font-semibold text-xl">Education</h3>
              {doctorData.professionalInfo?.education?.length ? (
                doctorData.professionalInfo.education.map((edu, idx) => (
                  <div key={idx} className="border-b last:border-b-0 pb-3 mb-3 last:mb-0">
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-gray-600">{edu.college} &middot; {edu.completionYear}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No education added.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Services Offered</h2>
        {doctorData.services?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {doctorData.services.map((service, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{service.serviceType}</h3>
                <p className="mb-2">Fees: ${service.fees}</p>
                {service.availableDates?.map((dateItem, i) => (
                  <details key={i} className="mb-1">
                    <summary className="cursor-pointer font-medium">{new Date(dateItem.date).toDateString()}</summary>
                    <div className="mt-1 flex gap-2 flex-wrap">
                      {dateItem.timeSlots?.map((slot, j) => (
                        <span key={j} className="bg-[#0096C7]/30 text-[#005f95] rounded-full px-3 py-1 text-sm font-semibold">
                          {slot.start} - {slot.end}
                        </span>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No services added.</p>
        )}
      </section>
    </div>
  );
};

export default DoctorProfile;
