import './comicsList.scss';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';
import {useEffect, useState} from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

const ComicsList = () => {
    const [comicsList, setComicsList]=useState([]);
    const {loading, error, getAllComics}=useMarvelService()
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false)

    useEffect(() => {
        onRequest(offset, true);
    }, [])


    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
          .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList([...comicsList, ...newComicsList])
        setNewItemLoading(newItemLoading => false)
        setOffset( offset + 8)
        setComicsEnded(ended)
    }


    function renderItems(arr){
        const items = arr.map((c, index)=>{
            return (
              <li className="comics__item"
                  key={index}>
                  <a href="#">
                      <img src={c.thumbnail} alt="ultimate war" className="comics__item-img"/>
                      <div className="comics__item-name">{c.title}</div>
                      <div className="comics__item-price">{c.price}</div>
                  </a>
              </li>
            )
        })

        return (
          <ul className="comics__grid">
              {items}
          </ul>
        )
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const content = renderItems(comicsList);

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {content}
            <button className="button button__main button__long"
                    onClick={()=>onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;