import { useState } from 'react';
import './App.css';

type SearchResult = {
  _id: number;
  ST_NUM: string;
  ST_NAME: string;
  ZIP_CODE: string;
  UNIT_NUM: string;
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
    if (isValid) {
      console.log('Valid address:', search);
    }
    const streetNumber = search.split(' ')[0];
    const streetName = search.split(' ').slice(1).join(' ').toUpperCase();

    try {
      const query = `SELECT * from "a9eb19ad-da79-4f7b-9e3b-6b13e66f8285" WHERE "ST_NUM"='${streetNumber}' AND "ST_NAME" ILIKE '${streetName}%'`;
      const encodedQuery = encodeURIComponent(query);

      const res = await fetch(
        `https://data.boston.gov/api/3/action/datastore_search_sql?sql=${encodedQuery}`
      );

      const data = await res.json();
      console.log(data.result.records);
      setResults(data.result.records);
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
            Example: <strong>123 Main</strong> instead of 123 Main Street
          </small>
        </div>
        {results?.length > 0 && (
          <div id='results'>
            Results:
            {results?.map(result => (
              <div
                key={result._id}
                className='search-result'
                onClick={() => handleResultClick(result)}
              >
                {result.ST_NUM} {result.ST_NAME}
                {result.UNIT_NUM && `, Unit ${result.UNIT_NUM}`},{' '}
                {result.ZIP_CODE}
              </div>
            ))}
          </div>
        )}
        {results.length === 0 && chosenResult && (
          <div id='chosen-result' className='chosen-result'>
            <h3>Property Assessment Details</h3>
            <h4>
              {chosenResult.ST_NUM} {chosenResult.ST_NAME}
              {chosenResult.UNIT_NUM && `, Unit ${chosenResult.UNIT_NUM}`},{' '}
              {chosenResult.ZIP_CODE}
            </h4>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
