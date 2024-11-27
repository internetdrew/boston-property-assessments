import { useState } from 'react';
import './App.css';
import PropertyReceipt from './components/PropertyReceipt';

export type Property = {
  _id: number;
  ZIP_CODE: string;
  MAIL_STREET_ADDRESS: string;
  MAIL_CITY: string;
  MAIL_STATE: string;
  YR_BUILT: string;
  YR_REMODEL: string;
  BLDG_VALUE: string;
  BLDG_TYPE: string;
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
  GROSS_AREA: string;
  LU_DESC: string;
  CD_FLOOR: string;
};

function App() {
  const [search, setSearch] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [results, setResults] = useState<Property[]>([]);
  const [chosenProperty, setChosenProperty] = useState<Property | null>(null);

  const validateAddress = (address: string): boolean => {
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
      setChosenProperty(null);
      setResults(data.result?.records || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleResultClick = (property: Property) => {
    setSearch('');
    setResults([]);
    setChosenProperty(property);
  };

  return (
    <>
      <header id='header'>
        <h1>Boston Property Assessments</h1>
        <h2>Get property assessment data for Boston-based properties</h2>
        <p id='built-by'>
          An{' '}
          <a
            href='https://www.internetdrew.com'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='InternetDrew website (opens in a new tab)'
          >
            InternetDrew
          </a>{' '}
          Experience
        </p>
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
          <small>Example: Enter "123 Main" not "123 Main Street"</small>
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
        {chosenProperty && <PropertyReceipt property={chosenProperty} />}
      </main>
    </>
  );
}

export default App;
