import { useState } from 'react';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import {
  Header,
  SearchForm,
  SearchButton,
  ButtonLabel,
  Input,
} from './Searchbar.styled';

export default function Searchbar({ onSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSumbit = e => {
    e.preventDefault();

    if (searchQuery.trim() === '') {
      return toast.error('Please enter the query!');
    }

    onSubmit(searchQuery);
    setSearchQuery('');
  };
  const handleChange = e => {
    setSearchQuery(e.target.value);
  };

  return (
    <Header>
      <SearchForm onSubmit={handleSumbit}>
        <SearchButton type="submit">
          <MagnifyingGlassIcon />
          <ButtonLabel>Search</ButtonLabel>
        </SearchButton>
        <Input
          type="text"
          autoComplete="off"
          placeholder="Search images and photos"
          name="searchQuery"
          onChange={handleChange}
        />
      </SearchForm>
    </Header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func,
}