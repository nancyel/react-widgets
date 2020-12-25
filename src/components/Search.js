import React, { useState, useEffect } from 'react';
import wikepedia from '../apis/wikipedia';

const Search = () => {
  const [term, setTerm] = useState('programming');
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const [results, setResults] = useState([]);

  // Run any time term changes; queue up a change to debouncedTerm
  // If the user changes term, clear the previous timer and set up another.
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(term);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [term]);

  // Run when debouncedTerm is processed, 
  // invoke the search function that makes an API call
  useEffect(() => {
    const search = async () => {
    const { data } = await wikepedia.get('', {
      params: {
        srsearch: debouncedTerm
      }
    })
    
    setResults(data.query.search);
    };

    if (debouncedTerm) {
      search();
    }
  }, [debouncedTerm]);

  const renderedResults = results.map((result) => {
    return (
      <div key={result.pageid} className="item">
        <div className="right floated content">
          <a 
            className="ui button"
            href={`https://en.wikipedia.org?curid=${result.pageid}`}
            target="_blank"
          >
            Go
          </a>
        </div>
        <div className="content">
          <div className="header">
            {result.title}
          </div>
          <span dangerouslySetInnerHTML={{ __html: result.snippet }}></span>
        </div>
      </div>
    )
  });

  return (
    <div>
      <div className="ui form">
        <div className="field">
          <label>Enter Search Term</label>
          <input 
            value={term}
            onChange={(e) => setTerm(e.target.value)} 
            type="text" 
          />
        </div>
      </div>
      <div className="ui celled list">{renderedResults}</div>
    </div>
  )
};

export default Search;