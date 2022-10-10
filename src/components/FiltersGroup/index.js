import './index.css'

const FiltersGroup = props => {
  const {
    categoryDetails,
    ratingsList,
    activeCategory,
    activeRating,
    activeSearchValue,
    setFilterDefault,
    submitForm,
  } = props

  const selectCategory = event => {
    const id = event.target.value
    activeCategory(id)
  }

  const selectRating = event => {
    const id = event.target.value
    // console.log(event.target)
    activeRating(id)
  }

  const searchFilter = event => {
    activeSearchValue(event.target.value)
  }

  const clearFilter = () => {
    setFilterDefault()
  }

  const onSubmitForm = event => {
    event.preventDefault()
    submitForm()
  }

  return (
    <div className="filters-group-container">
      <h1>Filters Group</h1>
      {/* Replace this element with your code */}
      <form onSubmit={onSubmitForm}>
        <input type="search" placeholder="Search" onChange={searchFilter} />
        <br />
        <h1>Category</h1>
        <ul className="filterGroup-ul">
          {categoryDetails.map(each => (
            <li key={each.categoryId}>
              <button
                className="filterGroup-btn"
                value={each.categoryId}
                type="button"
                onClick={selectCategory}
              >
                {each.name}
              </button>
              <p>{each.name}</p>
            </li>
          ))}
        </ul>
        <h1>Rating</h1>
        <ul className="filterGroup-ul">
          {ratingsList.map(each => (
            <li key={each.ratingId}>
              {/* {console.log(each.ratingId)} */}
              <img
                className="star-logo"
                src={each.imageUrl}
                alt={`rating ${each.ratingId}`}
              />
              <button
                className="filterGroup-btn"
                value={each.ratingId}
                type="button"
                onClick={selectRating}
              >
                & up
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={clearFilter}>
          Clear Filters
        </button>
      </form>
    </div>
  )
}

export default FiltersGroup
