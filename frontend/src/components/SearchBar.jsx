import { useState } from "react";
import { useDispatch } from "react-redux";
import { setQuery } from '../redux/reducer/searchSlice'

const SearchBar = ({ close }) => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(setQuery(text));
    setText("");
    close();
  };

  return (
    <form onSubmit={submitHandler} className="flex gap-2 items-center">
      <input
        required
        type="text"
        placeholder="Search products..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border px-3 py-2 rounded-lg outline-none w-56 focus:ring-2 focus:ring-green-500"
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
        Search
      </button>
    </form>
  );
};

export default SearchBar;