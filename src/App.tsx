import './App.css';

function App() {
  return (
    <>
      <header id='header'>
        <h1>Boston Property Assessments</h1>
        <h2>Get property assessment data for Boston-based properties</h2>
      </header>
      <main id='search'>
        <form id='search-form'>
          <input type='text' placeholder='Enter a property address' />
          <button>Search</button>
        </form>
      </main>
    </>
  );
}

export default App;
