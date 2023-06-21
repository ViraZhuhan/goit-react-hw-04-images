import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import debounce from 'lodash.debounce';
import { getHits } from 'api';
import Searchbar from './Searchbar';
import Skeleton from './Skeleton/Skeleton';
import ImageGallery from './ImageGallery';
import Button from './Button/Button';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import { Container } from './App.styled';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hits, setHits] = useState([]);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const perPage = 12;

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    setStatus(STATUS.PENDING);
    const fetchHits = async () => {
      try {
        const data = await getHits({ searchQuery, perPage, page });

        if (data.hits.length === 0) {
          throw Error(`No matches found with "${searchQuery}"`);
        }

        const hits = data.hits.map(
          ({ id, tags, webformatURL, largeImageURL }) => ({
            id,
            tags,
            webformatURL,
            largeImageURL,
          })
        );

        setHits(prevHits => [...prevHits, ...hits]);
        setTotalPages(Math.ceil(data.totalHits / perPage));
        setStatus(STATUS.RESOLVED);
      } catch (error) {
        setError(error.message);
        setStatus(STATUS.REJECTED);
      }
    };

    fetchHits();
  }, [searchQuery, page]);

  const handleChangeSearchQuery = debounce(searchQuery => {
    setSearchQuery(searchQuery);
    setPage(1);
    setHits([]);
  }, 1000);

  const handleLoardMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const showLoadMoreButton = hits.length !== 0 && page < totalPages;

  return (
    <Container>
      <ToastContainer autoClose={3000} theme={'colored'} />
      <Searchbar onSubmit={handleChangeSearchQuery} />
      {status === STATUS.PENDING && <Skeleton />}
      {hits.length > 0 && <ImageGallery hits={hits} />}
      {showLoadMoreButton && (
        <Button
          onClick={handleLoardMore}
          disabled={status === STATUS.PENDING ? true : false}
        >
          {status === STATUS.PENDING ? 'Loading...' : 'Loard more'}
        </Button>
      )}
      {status === STATUS.REJECTED && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}
