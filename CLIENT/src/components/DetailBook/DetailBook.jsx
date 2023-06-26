import React,{ useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDetailBooks } from '../../Redux/Action/Index';
import { useParams} from "react-router-dom";
function DetailBook(props) {
    const { id } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getDetailBooks(id));
      }, [dispatch, id]);
      const book = useSelector((state) => state.detailBooks);
      console.log('***books blen')
      console.log(book.Authors.name)
    return (
        <div>
        <div class="container">
<div class="row justify-content-center">
    <div class="col-md-7 col-lg-4 mb-5 mb-lg-0 wow fadeIn">
        <div class="card border-0 shadow">
            <img src={book.image} alt="..."/>
            <div class="card-body p-1-9 p-xl-5">
                <div class="mb-4">
                    <h3 class="h4 mb-0">Autor: {book.Authors[0].name}</h3>
                    <br />
                    <h3 class="h4 mb-0">Libro:{book.title}</h3>
                </div>
                
               
            </div>
        </div>
    </div>
    <div class="col-lg-8">
        <div class="ps-lg-1-6 ps-xl-5">
            <div class="mb-5 wow fadeIn">
                <div class="text-start mb-1-6 wow fadeIn">
                    <h2 class="mb-0 text-primary">Descripcion Libro</h2>
                </div>
                <p>{book.description}</p>
            </div>
            <div class="mb-5 wow fadeIn">
                <div class="text-start mb-1-6 wow fadeIn">
                    <h2 class="mb-0 text-primary">Informacion Adional</h2>
                </div>
                <div class="row mt-n4">
                    <div class="col-sm-6 col-xl-4 mt-4">
                        <div class="card text-center border-0 rounded-3">
                            <div class="card-body">
                                <i class="ti-bookmark-alt icon-box medium rounded-3 mb-4"></i>
                                <h3 class="h5 mb-3">Idioma</h3>
                                <p class="mb-0">{book.language}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-4 mt-4">
                        <div class="card text-center border-0 rounded-3">
                            <div class="card-body">
                                <i class="ti-pencil-alt icon-box medium rounded-3 mb-4"></i>
                                <h3 class="h5 mb-3">Numero de Paginas</h3>
                                <p class="mb-0">{book.numberPages}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-4 mt-4">
                        <div class="card text-center border-0 rounded-3">
                            <div class="card-body">
                                <i class="ti-medall-alt icon-box medium rounded-3 mb-4"></i>
                                <h3 class="h5 mb-3">Categorias</h3>
                                <p class="mb-0">{book.Categories[0].name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</div>
</div>
    </div>
    );
}

export default DetailBook;