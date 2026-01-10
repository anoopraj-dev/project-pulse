export const doctorFilterConfig = [
    {
        key: 'specialization',
        label:'Specialization',
        type: 'text',
        placeholder:'e.g. Cardiology',
        typeahead:true,
        mapToBackend: (value) => {
            value? { specialization: value} : {}
        }
    },

    {
        key: 'location',
        label:'Location',
        type: 'text',
        placeholder:'e.g. Kochi',
        typeahead: true,
        mapToBackend: (value) =>{
            value? {location:value} : {}
        }
    }
]