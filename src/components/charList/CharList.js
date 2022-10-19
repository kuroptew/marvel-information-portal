import './charList.scss';
import {useState, useEffect, useRef} from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import PropTypes from "prop-types";

const CharList = (props) => {
  const [charList, setCharList] = useState([])
  const {loading, error, getAllCharacters} = useMarvelService()
  const [newItemLoading, setNewItemLoading] = useState(false)
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false)

  useEffect(() => {
    onRequest(offset, true)
  }, [])


  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true)
    getAllCharacters(offset)
      .then(onCharListLoaded)
  }

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList( [...charList, ...newCharList])
    setNewItemLoading(newItemLoading => false)
    setOffset(offset => offset + 9)
    setCharEnded(charEnded => ended)
  }

  const itemRefs = useRef([])

  const focusOnItem = (index) => {
    itemRefs.current.forEach(item => item.classList.remove('char__item_selected'))
    itemRefs.current[index].classList.add('char__item_selected')
    itemRefs.current[index].focus()
  }


  function renderItems(arr) {
    const items = arr.map((item, index) => {
      let imgStyle = item.thumbnail.includes('image_not_available') ? {objectFit: 'unset'} : {objectFit: 'cover'}

      return (
        <li className="char__item"
            key={item.id}
            tabIndex={0}
            ref={el => itemRefs.current[index] = el}
            onClick={() => {
              props.onCharSelected(item.id)
              focusOnItem(index)
            }}
            onKeyPress={(e) => {
              e.preventDefault()
              if (e.key === ' ' || e.key === "Enter") {
                props.onCharSelected(item.id)
                focusOnItem(index)
              }
            }}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
          <div className="char__name">{item.name}</div>
        </li>
      )
    })

    return (
      <ul className="char__grid">
        {items}
      </ul>
    )
  }

  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading && !newItemLoading ? <Spinner/> : null;
  const content = renderItems(charList);

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {content}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{display: charEnded ? 'none' : 'block'}}
        onClick={() => onRequest(offset)}>
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
}

export default CharList;