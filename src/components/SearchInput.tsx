import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { HiSearch } from "react-icons/hi";
import debounce from "lodash.debounce";
import TextInput from "./TextInput";

type Props = {
  setQuery: Dispatch<SetStateAction<string>>;
  placeholder: string;
};

const SearchInput: React.FC<Props> = ({ setQuery, placeholder }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onChange = useCallback(
    (value: string) => {
      setQuery(value);

      router.replace({
        query: {
          q: value,
        },
      });
    },
    [setQuery, router]
  );

  const handleChange = debounce(onChange, 500);

  // If there is a query parameter (?q=...) when the page
  // first opens, we set is as the query.
  useEffect(() => {
    if (router.isReady && !!router.query.q) {
      const queryParam = router.query.q as string;

      setQuery(queryParam);
      if (inputRef?.current) inputRef.current.value = queryParam;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <TextInput
      variant="primary"
      sizeVariant="lg"
      icon={<HiSearch className="text-gray-500 dark:text-gray-400" size={20} />}
      ref={inputRef}
      onChange={(e) => handleChange(e.target.value)}
      type="text"
      placeholder={placeholder}
      required
      title={placeholder}
    />
  );
};

export default SearchInput;
