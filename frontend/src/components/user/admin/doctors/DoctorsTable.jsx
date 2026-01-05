
const DoctorsTable = ({ doctors, onView}) => {
  return (
    <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
      <table className="min-w-full divide-y divide-gray-100 ">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50 to-gray-50">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              SL.NO
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Joined
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Specialization
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Experience
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Qualification
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white  ">
          { doctors && doctors.length > 0 ? (doctors?.map((doc, index) => (
            <tr 
              key={doc._id} 
              className={`hover:bg-gray-50/50 transition-all duration-150   ${
                index % 2 === 0 ? 'bg-slate-50/30' : ''
              }`}
            > 
              <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                {index+1}
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                {new Date(doc.createdAt).toLocaleDateString('en-IN')}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full ring-2 ring-gray-100 overflow-hidden shadow-sm">
                    <img
                      src={doc.profilePicture}
                      alt={doc.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-gray-900">{doc.name}</span>
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                {doc.professionalInfo?.specializations?.[0] || '—'}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {doc.professionalInfo?.experience?.reduce((total,curr)=>curr.years+=total,0) || 0} yrs
                </span>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                {doc.professionalInfo?.qualifications?.[0] || '—'}
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                
                  <button
                    onClick={() => onView(doc._id)}
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    View 
                  </button>
                
              </td>
            </tr>
          ))):(
            <tr>
      <td
        colSpan={7}
        className="px-6 py-10 text-center text-gray-500 font-medium"
      >
        No data available
      </td>
    </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsTable;
