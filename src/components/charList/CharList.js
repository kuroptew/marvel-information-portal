import './charList.scss';
import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import PropTypes from "prop-types";

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 1544,
    charEnded:false,
  }

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading()
    this.marvelService.getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError)
  }

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    })
  }

  onCharListLoaded = (newCharList) => {
    let ended = false;
    if(newCharList.length < 9){
      ended =true;
    }

    this.setState(({charList, offset}) => (
      {
        charList: [...charList, ...newCharList],
        loading: false,
        newItemLoading: false,
        offset: offset + 9,
        charEnded: ended,
      }
    ))
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    })
  }

  itemRefs=[]

  setRef=(ref)=>{
    this.itemRefs.push(ref)
  }

  focusOnItem=(index)=>{
    this.itemRefs.forEach(item=>item.classList.remove('char__item_selected'))
    this.itemRefs[index].classList.add('char__item_selected')
    this.itemRefs[index].focus()
  }


  renderItems = (arr) => {
    const items = arr.map((item,index) => {
      let imgStyle = item.thumbnail.includes('image_not_available') ? {objectFit: 'unset'} : {objectFit: 'cover'}

      return (
        <li className="char__item"
            key={item.id}
            tabIndex={0}
            ref={this.setRef}
            onClick={() => {
              this.props.onCharSelected(item.id)
              this.focusOnItem(index)
            }}
            onKeyPress={(e)=>{
              e.preventDefault()
              if(e.key === ' ' ||  e.key === "Enter"){
                this.props.onCharSelected(item.id)
                this.focusOnItem(index)
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


  render() {
    const {charList, loading, error,newItemLoading, offset, charEnded} = this.state
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? this.renderItems(charList) : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={{display:charEnded?'none':'block'}}
          onClick={()=>this.onRequest(offset)}>
          <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
}

export default CharList;