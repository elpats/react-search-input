import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {createFilter} from './util'

class Search extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: this.props.value || ''
    }
    this.updateSearch = this.updateSearch.bind(this)
    this.filter = this.filter.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (
      typeof nextProps.value !== 'undefined' &&
      nextProps.value !== this.props.value
    ) {
      const e = {
        target: {
          value: nextProps.value
        }
      }
      this.updateSearch(e)
    }
  }

  render () {
    const {
      className,
      onChange,
      caseSensitive,
      sortResults,
      throttle,
      filterKeys,
      value,
      fuzzy,
      unidecode,
      inputClassName,
      ...inputProps
    } = this.props // eslint-disable-line no-unused-vars
    inputProps.type = inputProps.type || 'search'
    inputProps.value = this.state.searchTerm
    inputProps.onChange = this.updateSearch
    inputProps.className = inputClassName
    inputProps.placeholder = inputProps.placeholder || 'Search'
    return (
      <div className={className}>
        <input {...inputProps} />
      </div>
    )
  }

  updateSearch (e) {
    const searchTerm = e.target.value
    this.setState(
      {
        searchTerm: searchTerm
      },
      () => {
        if (this._throttleTimeout) {
          clearTimeout(this._throttleTimeout)
        }

        this._throttleTimeout = setTimeout(
          () => this.props.onChange(searchTerm),
          this.props.throttle
        )
      }
    )
  }

  filter (keys) {
    const {filterKeys, caseSensitive, fuzzy, unidecode, sortResults} = this.props
    return createFilter(this.state.searchTerm, keys || filterKeys, {
      caseSensitive,
      fuzzy,
      unidecode,
      sortResults
    })
  }
}

Search.defaultProps = {
  className: '',
  onChange () {},
  caseSensitive: false,
  fuzzy: false,
  unidecode: false,
  throttle: 200
}

Search.propTypes = {
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  onChange: PropTypes.func,
  caseSensitive: PropTypes.bool,
  sortResults: PropTypes.bool,
  fuzzy: PropTypes.bool,
  unidecode: PropTypes.bool,
  throttle: PropTypes.number,
  filterKeys: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  value: PropTypes.string
}

export default Search
export {createFilter}
