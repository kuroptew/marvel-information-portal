import './comicsList.scss';
import {useEffect, useState} from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import {Link} from "react-router-dom";

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state')
    }
}

const ComicsList = () => {
    const [comicsList, setComicsList]=useState([]);
    const {getAllComics, process, setProcess}=useMarvelService()
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
          .then(()=>setProcess('confirmed'))
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList([...comicsList, ...newComicsList])
        setNewItemLoading(newItemLoading => false)
        setOffset(  offset=>offset + 8)
        setComicsEnded(ended)
    }

    function renderItems(arr){
        const items = arr.map((c, index)=>{
            return (
              <li className="comics__item"
                  key={index}>
                  <Link to={`/comics/${c.id}`}>
                      <img src={c.thumbnail} alt="ultimate war" className="comics__item-img"/>
                      <div className="comics__item-name">{c.title}</div>
                      <div className="comics__item-price">{c.price}</div>
                  </Link>
              </li>
            )
        })

        return (
          <ul className="comics__grid">
              {items}
          </ul>
        )
    }

    return (
        <div className="comics__list">
            {setContent(process, ()=>renderItems(comicsList), newItemLoading)}
            <button
              disabled={newItemLoading}
              style={{'display' : comicsEnded ? 'none' : 'block'}}
              className="button button__main button__long"
              onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;