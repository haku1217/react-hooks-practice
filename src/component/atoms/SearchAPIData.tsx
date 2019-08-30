import * as React from "react";

// import Counter from "../src/component/atoms/Counter";
import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";


type Props = {
  urlName: string
  initalQuery: string
  apiName: string
  eventName?: any
  selectFormat?: string
}
 
type State = {
  data?: HNResponce
  isLoading: boolean
  isError?: boolean
};

type HNResponce = {
  hits: {
    title: string;
    objectID: string;
    url: string;
  }[];
};

type Action =
  | { type: "FETCH_INIT"}
  | { type: "FETCH_SUCCESS", payload: HNResponce}
  | { type: "FETCH_FAILURE"}

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error();
  }
};

const useDataApi = (initalUrl: string, initalData) => {
  const [url, setUrl] = React.useState<string>(initalUrl);

  const [state, dispatch] = React.useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initalData
  });

  React.useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });

      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};

const SearchAPIData: React.FC<Props> = ({ urlName, initalQuery, apiName, eventName, selectFormat }) => {
  const [query, setQuery] = React.useState(initalQuery);
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    `${urlName}${query}${selectFormat}`,
   `${eventName}`
  );
    console.log(data)
  return (
    <React.Fragment>
      <h3>{apiName}</h3>
      <form
        onSubmit={event => {
          doFetch(`${urlName}${query}`);
          event.preventDefault();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data && data.hits && data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </React.Fragment>
  );
};

export default SearchAPIData;
