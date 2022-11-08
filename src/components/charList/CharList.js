import './charList.scss';
import {useState, useEffect, useRef, useMemo} from "react";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import PropTypes from "prop-types";
import {CSSTransition, TransitionGroup} from "react-transition-group";

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

const CharList = (props) => {
  const [charList, setCharList] = useState([])
  const {getAllCharacters, process, setProcess} = useMarvelService()
  const [newItemLoading, setNewItemLoading] = useState(false)
  const [offset, setOffset] = useState(291);
  const [charEnded, setCharEnded] = useState(false)

  useEffect(() => {
    onRequest(offset, true)
  }, [])


  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true)
    getAllCharacters(offset)
      .then(onCharListLoaded)
      .then(() => setProcess('confirmed'))
  }

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList([...charList, ...newCharList]);
    setNewItemLoading(newItemLoading => false);
    setOffset(offset => offset + 9);
    setCharEnded(ended);
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
        <CSSTransition key={item.id} timeout={500} classNames='char__item'>
          <li
            className='char__item'
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
        </CSSTransition>
      )
    })

    return (
      <ul className="char__grid">
        <TransitionGroup component={null}>
          {items}
        </TransitionGroup>
      </ul>
    )
  }

  const elements = useMemo(()=>{
    return setContent(process, () => renderItems(charList), newItemLoading)
  }, [process])

  return (
    <div className="char__list">
      {elements}
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