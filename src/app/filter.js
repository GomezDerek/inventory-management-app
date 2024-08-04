// inspired from https://mui.com/material-ui/react-autocomplete/
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { Button, Stack } from '@mui/material';

const filter = createFilterOptions();

export default function InventoryFilter(props) {
  const [value, setValue] = React.useState(null);

  return (
    <Stack
        display={'flex'}
        flexDirection={'row'}

    >
    <Autocomplete 
      id="free-solo-with-text-demo"

      sx={{ 
        width: "400px",
        '& .MuiFormLabel-root' : {
        }
      }}

      freeSolo
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            // title: newValue,
            name: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          console.log('x');
          setValue({
            // title: newValue.inputValue,
            name: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}

    //   options={top100Films}
      options={props.states.inventory}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        // also executes when a dropdown suggestion is clicked
        if (typeof option === 'string') {
          console.log(option);
          return option;
        }
        // Add "xxx" option created dynamically
        //executes as user types
        if (option.inputValue) {
        //   console.log(option.inputValue);
          return option.inputValue;
        }
        // Regular option
        //executes as user focuses on the input box
        // return option.title;
        // console.log(option.name);
        return option.name;
      }}

      /* filter dropdown from user input */
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        // const isExisting = options.some((option) => inputValue === option.title);
        const isExisting = options.some((option) => inputValue === option.name );
        if (inputValue !== '' && !isExisting) {
        filtered.push({
            inputValue,
            // title: `Add "${inputValue}"`,
            name: `Add "${inputValue}"`
        });
        }

        return filtered;
      }}

      /* I think this is the option drop-down */
      renderOption={(props2, option) => {
        const { key, ...optionProps } = props2;
        return (
          <li 
            className="search-suggestion"
            key={key} 
            {...optionProps} 
            // onClick={()=>{
            //     setValue(option.name);
            //     props.states.setFilteredInv(option.name);
            //     console.log(document.getElementsByClassName('search-suggestion'));
            // }}
          >
                {/* {option.title} */}
                {option.name}
          </li>
        );
      }}

      /* placeholder text */
      renderInput={(params) => (
        <TextField {...params} label="🔍Search inventory" />
      )}
    />
    <Button 
        variant="outlined"
        onClick={()=>{
            // props.states.setFilteredInv(value);
            // console.log(`${props.states.displayInv.toString()}`);
            // props.states.setDisplayInv(value);
            // console.log(props.states.displayInv);
            props.states.setFilterOn('true');
        }}
    >
        Search
    </Button>
    </Stack>
  );

}// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

const top100Films = [
  { name: 'The Shawshank Redemption', year: 1994 },
  { name: 'The Godfather', year: 1972 },
  { name: 'The Godfather: Part II', year: 1974 },
  { name: 'The Dark Knight', year: 2008 },
  { name: '12 Angry Men', year: 1957 },
  { name: "Schindler's List", year: 1993 },
  { name: 'Pulp Fiction', year: 1994 },
  {
    name: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { name: 'The Good, the Bad and the Ugly', year: 1966 },
  { name: 'Fight Club', year: 1999 },
  {
    name: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    name: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { name: 'Forrest Gump', year: 1994 },
  { name: 'Inception', year: 2010 },
  {
    name: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { name: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { name: 'Goodfellas', year: 1990 },
  { name: 'The Matrix', year: 1999 },
  { name: 'Seven Samurai', year: 1954 },
  {
    name: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { name: 'City of God', year: 2002 },
  { name: 'Se7en', year: 1995 },
  { name: 'The Silence of the Lambs', year: 1991 },
  { name: "It's a Wonderful Life", year: 1946 },
  { name: 'Life Is Beautiful', year: 1997 },
  { name: 'The Usual Suspects', year: 1995 },
  { name: 'Léon: The Professional', year: 1994 },
  { name: 'Spirited Away', year: 2001 },
  { name: 'Saving Private Ryan', year: 1998 },
  { name: 'Once Upon a Time in the West', year: 1968 },
  { name: 'American History X', year: 1998 },
  { name: 'Interstellar', year: 2014 },
  { name: 'Casablanca', year: 1942 },
  { name: 'City Lights', year: 1931 },
  { name: 'Psycho', year: 1960 },
  { name: 'The Green Mile', year: 1999 },
  { name: 'The Intouchables', year: 2011 },
  { name: 'Modern Times', year: 1936 },
  { name: 'Raiders of the Lost Ark', year: 1981 },
  { name: 'Rear Window', year: 1954 },
  { name: 'The Pianist', year: 2002 },
  { name: 'The Departed', year: 2006 },
  { name: 'Terminator 2: Judgment Day', year: 1991 },
  { name: 'Back to the Future', year: 1985 },
  { name: 'Whiplash', year: 2014 },
  { name: 'Gladiator', year: 2000 },
  { name: 'Memento', year: 2000 },
  { name: 'The Prestige', year: 2006 },
  { name: 'The Lion King', year: 1994 },
  { name: 'Apocalypse Now', year: 1979 },
  { name: 'Alien', year: 1979 },
  { name: 'Sunset Boulevard', year: 1950 },
  {
    name: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { name: 'The Great Dictator', year: 1940 },
  { name: 'Cinema Paradiso', year: 1988 },
  { name: 'The Lives of Others', year: 2006 },
  { name: 'Grave of the Fireflies', year: 1988 },
  { name: 'Paths of Glory', year: 1957 },
  { name: 'Django Unchained', year: 2012 },
  { name: 'The Shining', year: 1980 },
  { name: 'WALL·E', year: 2008 },
  { name: 'American Beauty', year: 1999 },
  { name: 'The Dark Knight Rises', year: 2012 },
  { name: 'Princess Mononoke', year: 1997 },
  { name: 'Aliens', year: 1986 },
  { name: 'Oldboy', year: 2003 },
  { name: 'Once Upon a Time in America', year: 1984 },
  { name: 'Witness for the Prosecution', year: 1957 },
  { name: 'Das Boot', year: 1981 },
  { name: 'Citizen Kane', year: 1941 },
  { name: 'North by Northwest', year: 1959 },
  { name: 'Vertigo', year: 1958 },
  {
    name: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { name: 'Reservoir Dogs', year: 1992 },
  { name: 'Braveheart', year: 1995 },
  { name: 'M', year: 1931 },
  { name: 'Requiem for a Dream', year: 2000 },
  { name: 'Amélie', year: 2001 },
  { name: 'A Clockwork Orange', year: 1971 },
  { name: 'Like Stars on Earth', year: 2007 },
  { name: 'Taxi Driver', year: 1976 },
  { name: 'Lawrence of Arabia', year: 1962 },
  { name: 'Double Indemnity', year: 1944 },
  {
    name: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { name: 'Amadeus', year: 1984 },
  { name: 'To Kill a Mockingbird', year: 1962 },
  { name: 'Toy Story 3', year: 2010 },
  { name: 'Logan', year: 2017 },
  { name: 'Full Metal Jacket', year: 1987 },
  { name: 'Dangal', year: 2016 },
  { name: 'The Sting', year: 1973 },
  { name: '2001: A Space Odyssey', year: 1968 },
  { name: "Singin' in the Rain", year: 1952 },
  { name: 'Toy Story', year: 1995 },
  { name: 'Bicycle Thieves', year: 1948 },
  { name: 'The Kid', year: 1921 },
  { name: 'Inglourious Basterds', year: 2009 },
  { name: 'Snatch', year: 2000 },
  { name: '3 Idiots', year: 2009 },
  { name: 'Monty Python and the Holy Grail', year: 1975 },
];