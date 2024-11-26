import { useState } from 'react';
import './App.css';
import { isUnit } from './constants';

type SearchResult = {
  _id: number;
  ZIP_CODE: string;
  MAIL_STREET_ADDRESS: string;
  MAIL_CITY: string;
  MAIL_STATE: string;
  YR_BUILT: string;
  YR_REMODEL: string;
  BLDG_VALUE: string;
  LU: string;
  TOTAL_VALUE: string;
  LIVING_AREA: string;
  BED_RMS: string;
  FULL_BTH: string;
  HLF_BTH: string;
  LAND_VALUE: string;
  GROSS_TAX: string;
  NUM_PARKING: string;
  FIREPLACES: string;
  KITCHEN_TYPE: string;
  LAND_SF: string;
  RES_FLOOR: string;
};

function App() {
  const [search, setSearch] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [chosenResult, setChosenResult] = useState<SearchResult | null>(null);

  const validateAddress = (address: string): boolean => {
    // This regex checks for:
    // - One or more numbers at the start
    // - Followed by whitespace
    // - Followed by words (street name)
    // - Optionally followed by common street types (St, Ave, Road, etc.)
    const addressRegex =
      /^\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)?$/i;
    return addressRegex.test(address.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setIsValid(validateAddress(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const streetNumber = search.split(' ')[0];
    const streetName = search.split(' ').slice(1).join(' ').toUpperCase();

    try {
      const query = `SELECT * from "a9eb19ad-da79-4f7b-9e3b-6b13e66f8285" WHERE "ST_NUM"='${streetNumber}' AND "ST_NAME" ILIKE '${streetName}%'`;
      const encodedQuery = encodeURIComponent(query);

      const res = await fetch(
        `https://data.boston.gov/api/3/action/datastore_search_sql?sql=${encodedQuery}`
      );

      const data = await res.json();
      setResults(data.result?.records || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setSearch('');
    setResults([]);
    setChosenResult(result);
  };

  return (
    <>
      <header id='header'>
        <h1>Boston Property Assessments</h1>
        <h2>Get property assessment data for Boston-based properties</h2>
      </header>
      <main>
        <div id='search'>
          <form id='search-form' onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Enter building number and street name'
              value={search}
              onChange={handleInputChange}
            />
            <button disabled={!isValid}>Search</button>
          </form>
          <small>
            Example: ✅ 123 Main <strong>vs</strong> ❌ 123 Main Street
          </small>
        </div>
        {results?.length > 0 && (
          <div id='results'>
            <p>Possible Matches</p>
            {results?.map(result => (
              <div
                key={result._id}
                className='search-result'
                onClick={() => handleResultClick(result)}
              >
                {result.MAIL_STREET_ADDRESS}
                <br />
                {result.MAIL_CITY}, {result.MAIL_STATE}, {result.ZIP_CODE}
              </div>
            ))}
          </div>
        )}
        {results.length === 0 && chosenResult && (
          <div id='chosen-result' className='chosen-result'>
            <h3>Property Assessment Details</h3>
            <h4>
              {chosenResult.MAIL_STREET_ADDRESS},{chosenResult.ZIP_CODE}
              <br />
              {chosenResult.MAIL_CITY}, {chosenResult.MAIL_STATE}
            </h4>

            <section className='receipt-section'>
              <h4>
                {isUnit(chosenResult.LU) ? 'Unit' : 'Building'} Information
              </h4>
              <p>Year Built: {chosenResult.YR_BUILT || 'N/A'}</p>
              <p>Last Remodel: {chosenResult.YR_REMODEL || 'N/A'}</p>
              <p>Floors: {chosenResult.RES_FLOOR || 'N/A'}</p>
              <p>Living Area: {chosenResult.LIVING_AREA || 'N/A'} sq ft</p>
              <p>Bedrooms: {chosenResult.BED_RMS || 'N/A'}</p>
              <p>Full Bathrooms: {chosenResult.FULL_BTH || 'N/A'}</p>
              <p>Half Bathrooms: {chosenResult.HLF_BTH || 'N/A'}</p>
            </section>

            <section className='receipt-section'>
              <h4>Assessment Values</h4>
              <p>
                {isUnit(chosenResult.LU) ? 'Unit' : 'Building'}: $
                {chosenResult.BLDG_VALUE || 'N/A'}
              </p>
              {!isUnit(chosenResult.LU) && (
                <p>Land: ${chosenResult.LAND_VALUE || 'N/A'}</p>
              )}
              <p>Total: ${chosenResult.TOTAL_VALUE || 'N/A'}</p>
              <p>Annual Tax: {chosenResult.GROSS_TAX || 'N/A'}</p>
            </section>

            <section className='receipt-section'>
              <h4>Features</h4>
              <p>Parking Spaces: {chosenResult.NUM_PARKING || 'N/A'}</p>
              <p>Fireplaces: {chosenResult.FIREPLACES || 'N/A'}</p>
              <p>
                Kitchen: {chosenResult.KITCHEN_TYPE?.split('- ')[1] || 'N/A'}
              </p>
              {!isUnit(chosenResult.LU) && (
                <p>Lot Size: {chosenResult.LAND_SF || 'N/A'} sq ft</p>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
