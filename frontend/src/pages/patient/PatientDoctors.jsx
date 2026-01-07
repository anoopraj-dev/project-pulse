import { useAsyncAction } from '../../hooks/useAsyncAction';
import { getAllDoctors } from '../../api/patient/patientApis';
import { useEffect, useState } from 'react';
import DoctorCard from '../../components/shared/components/DoctorCard';
import toast from 'react-hot-toast';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const fetchDoctorsAction = useAsyncAction();
  const navigate = useNavigate();

  const fetchAllDoctors = () => {
    fetchDoctorsAction.executeAsyncFn(async () => {
      try {
        const res = await getAllDoctors();

        if (!res?.data?.success) {
          return toast.error(res?.data?.message || 'Failed to load doctors');
        }

        setDoctors(res?.data?.users || []);
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    });
  };

  const handleProfileView = (id) => {
    navigate(`/patient/doctor/${id}`)
    
  }

  const approvedDoctors = doctors.filter(doc => doc.status === 'approved');

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const isLoading = fetchDoctorsAction.loading;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-600">
              <Icon icon="mdi:account-heart-outline" className="text-lg" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Find a doctor
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Available Doctors
            </h1>

            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Browse verified doctors and compare consultation charges before booking.
            </p>
          </div>

          {/* Status */}
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs shadow-sm ring-1 ring-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-slate-700">
                {approvedDoctors.length}{' '}
                <span className="font-medium text-slate-900">
                  doctors available
                </span>
              </span>
            </div>

            {isLoading && (
              <div className="inline-flex items-center gap-2 text-[11px] text-slate-500">
                <Icon icon="mdi:loading" className="animate-spin text-sm" />
                Loading doctors…
              </div>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* Search */}
            <div className="flex w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
              <Icon
                icon="mdi:magnify"
                className="text-lg text-slate-400"
              />
              <input
                type="text"
                placeholder="Search doctor or specialization"
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Hint */}
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-[11px] text-sky-700">
              <Icon icon="mdi:shield-check-outline" className="text-sm" />
              Verified & approved professionals
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div
          className="
            mt-8 grid gap-6
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
          "
        >
          {approvedDoctors.map(doc => (
            <DoctorCard
              key={doc._id}
              doctor={doc}
              onView={()=>handleProfileView(doc._id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && approvedDoctors.length === 0 && (
          <div className="mt-20 flex flex-col items-center text-center text-slate-500">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <Icon icon="mdi:stethoscope" className="text-2xl text-slate-400" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No doctors available
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Approved doctors will appear here once they are added by the admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDoctors;
