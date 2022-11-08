import './charInfo.scss';
import {useEffect, useState} from "react";
import PropTypes from 'prop-types'
import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";

const CharInfo = ({charId}) => {
  const [char, setChar] = useState(null)
  const {getCharacter, clearError, process, setProcess} = useMarvelService();

  useEffect(() => {
    updateChar()
  }, [charId])


  const updateChar = () => {
    if (!charId) {
      return;
    }

    clearError()
    getCharacter(charId)
      .then(onCharLoaded)
      .then(()=>setProcess('confirmed'))
  }


  const onCharLoaded = (char) => {
    setChar(char)
  }

  return (
    <div className="char__info">
      {setContent(process, View, char)}
    </div>
  )
}

const View = ({data}) => {
  const {name, description, thumbnail, homepage, wiki, comics} = data
  let imgStyle = thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : {objectFit: 'cover'}
  comics.length = comics.length > 10 ? 10 : comics.length
  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} style={imgStyle}/>
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">
        {description}
      </div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {
          !comics.length
            ? 'There is no comics with this character'
            : comics.map((com, i) => {
              return (
                <li key={i} className="char__comics-item">
                  {com.name}
                </li>
              )
            })
        }
      </ul>
    </>
  )
}

CharInfo.propTypes = {
  charId: PropTypes.number
}

export default CharInfo;