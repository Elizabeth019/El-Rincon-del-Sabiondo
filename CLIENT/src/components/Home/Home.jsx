import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/Card/card";
import { getAllBooks, clearShoppingCart, createSellingTotalDB } from "../../Redux/Action/Index";
import styles from "./Home.module.css";
import Footer from "../../components/Footer/Footer";
import { filterResults, orderPrice } from "../../Redux/Action/Index";
import SearchBar from "../../components/SearchBar/SearchBar";
import axios from "axios";
import  { useState, useEffect, useRef } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from 'react-icons/bs';
import PopUp from '../PopUp/PopUp';
import { useSearchParams } from "react-router-dom";
import { useUserInfo } from "../../context/ProviderUser";
import { TOKEN_STORAGE_CART } from "../../Redux/Action/Actions.types";



const endpoint = import.meta.env.VITE_URL_ENDPOINT;
const initialFilters = {
  category: "",
  price: "",
};

export default function Home() {
  const {user} = useUserInfo();
  const resultados = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const [,setParams] = useSearchParams();
  
  const [ params ] = useSearchParams();
  const paymentId = params.get('payment_id');
  const status = params.get('status');
  const cartStorage = useRef(JSON.parse(localStorage.getItem(TOKEN_STORAGE_CART)));

  const allBooks = useSelector((state) => state.allBooks);
  const filteredBooks = useSelector((state) => state.filtered);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  const filters = useSelector((state) => state.filters);
  const [options, setOptions] = useState([]);
  
  
  const [categoryValue, setCategoryValue] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [buttonText, setButtonText] = useState("Precios menor a mayor");
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleReset = () => {
    dispatch(filterResults(initialFilters));
    setCategoryValue("");
    setPriceValue("");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endpoint}/category`);
        const categories = response.data.categories;
        setOptions(categories);
      } catch ({ message }) {
        console.log(message);
      }
    };
    fetchData();


    if ( paymentId !== null && status === "approved") {
      dispatch(clearShoppingCart());
    }else{
      setParams("")
    }
  }, []);

  useEffect(() => {
    if(user){
      if ( paymentId !== null && status === "approved" && cartStorage.current.length){
        createSellingTotalDB({IdUser: user.IdUser, products: cartStorage.current})
      }
    }
  },[user]);

  useEffect(() => {
    dispatch(getAllBooks());
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [resultados, filteredBooks]);

  let renderBooks = [];
  filteredBooks
    ? (renderBooks = filteredBooks)
    : resultados
    ? (renderBooks = resultados)
    : (renderBooks = allBooks);

  const totalPages = Math.ceil(renderBooks.length / booksPerPage);
  const books = renderBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "category":
        setCategoryValue(value);
        return dispatch(
          filterResults({
            ...filters,
            category: value,
          })
        );

      case "price":
        setPriceValue(value);
        return dispatch(
          filterResults({
            ...filters,
            price: value,
          })
        );

      default:
        break;
    }
  };
  const handleSortClick = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const newButtonText =
      sortOrder === "asc" ? "Precios mayor a menor" : "Precios menor a mayor";

    setSortOrder(newSortOrder);
    setButtonText(newButtonText);

    dispatch(orderPrice(newSortOrder));
  };

  return (
    <div>
     <SearchBar />
      <div className="filtros_posjqlk">
        <select
          className="select_lkow"
          name="category"
          onChange={handleChange}
          value={categoryValue}
        >
          <option value="">Seleccionar</option>
          {options.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="select_lkow"
          id="price"
          name="price"
          onChange={handleChange}
          value={priceValue}
        >
          <option value="">todos</option>
          <option value="lt100">Menos que 100</option>
          <option value="101-200">De 101 a 200</option>
          <option value="201-300">De 201 a 300</option>
          <option value="gt300">Más de 300</option>
        </select>
        <button onClick={handleSortClick}>{buttonText}</button>
        <button className="clear_button" onClick={handleReset}>Limpiar</button>
      </div>
      <div className={styles.homePage}>
        <div className={styles.pageIndicator}>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <BsArrowLeftCircleFill />
          </button>
          {new Array(totalPages).fill("").map((_, index) => (
            <button
              className={currentPage === index + 1 ? styles.active : ""}
              onClick={() => handlePageChange(index + 1)}
              key={index}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <BsArrowRightCircleFill />
          </button>
        </div>
        {/* <div style={{ marginTop: "20px" }}>
        {paymentId !== null && status === "approved" ? (
          <div style={{ textAlign: "center" }}>
            <img
              src={success}
              alt="Purchase Success"
              style={{ width: "300px", height: "300px", margin: "0 auto" }}
            />
            <p>Su compra se procesó correctamente. Si lo desea, puede seguir navegando por nuestro catálogo.</p>
          </div>
        ) : null}
        </div> */}
        <div>
          {(paymentId !== null && status === "approved" && cartStorage.current.length)? (
           <PopUp />
          ) : null}
        </div>
        <div className={styles.boxCardBooks}>
          {books &&
            books.map((book) => <Card key={book.IdBook} props={book} />)}
        </div>
        
        <div className={styles.scrollToTopButton} onClick={handleScrollToTop}>
          Subir
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Footer />
      </div>
    </div>
  );
}

