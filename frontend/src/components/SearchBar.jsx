import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setQuery, setResults, clearResult } from '../redux/reducer/searchSlice';

const SearchBar = ({ close }) => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get products from your slice
  const products = useSelector((state) => state.products.list);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // ✅ Filter locally
    const filtered = products.filter((p) =>
      p.name?.toLowerCase().includes(text.toLowerCase()) ||
      p.category?.toLowerCase().includes(text.toLowerCase())
    );

    dispatch(setQuery(text));
    dispatch(setResults(filtered));

    setText("");
    close?.();
    navigate("/"); // go to home to show results
  };

  // ✅ Clear results when input is emptied
  const handleChange = (e) => {
    setText(e.target.value);
    if (!e.target.value.trim()) dispatch(clearResult());
  };

  return (
    <form onSubmit={submitHandler} className="flex gap-2 items-center">
      <input
        required
        type="text"
        placeholder="Search products..."
        value={text}
        onChange={handleChange}
        className="border px-3 py-2 rounded-lg outline-none w-56 focus:ring-2 focus:ring-green-500"
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
        Search
      </button>
    </form>
  );
};

export default SearchBar;