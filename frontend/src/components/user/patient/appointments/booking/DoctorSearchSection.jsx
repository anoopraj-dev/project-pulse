import SearchInput from "@/components/shared/components/SearchInput";

const DoctorSearchSection = ({
  query,
  setQuery,
  fetchSuggestions,
  handleSelectSuggestion,
}) => {
  return (
    <div className="pb-4">
      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search doctor"
        onSelectSuggestion={handleSelectSuggestion}
        fetchSuggestions={fetchSuggestions}
        role="patient"
        entity="Doctor"
      />
    </div>
  );
};

export default DoctorSearchSection;