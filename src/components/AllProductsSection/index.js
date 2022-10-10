import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]
const fetchSuccessData = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: true,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: '',
    activeSearchValue: '',
    activeRatingId: '',
    fetchSuccess: fetchSuccessData.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  activeCategory = id => {
    this.setState({activeCategoryId: id}, this.getProducts)
  }

  activeRating = id => {
    this.setState({activeRatingId: id}, this.getProducts)
  }

  activeSearchValue = value => {
    this.setState({activeSearchValue: value})
  }

  setFilterDefault = () => {
    this.setState(
      {activeCategoryId: '', activeRatingId: '', activeSearchValue: ''},
      this.getProducts,
    )
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      activeCategoryId,
      activeSearchValue,
      activeRatingId,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${activeSearchValue}&rating=${activeRatingId}`
    console.log(apiUrl)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
        fetchSuccess: fetchSuccessData.success,
      })
    }
    if (response.status === 401) {
      this.setState({
        fetchSuccess: fetchSuccessData.failed,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId, fetchSuccess} = this.state

    // TODO: Add No Products View
    const noProducts = () => (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
        />
        <h1>No Products Found</h1>
        <p>We could not find any products. Try other filters.</p>
      </div>
    )
    console.log(productsList.length)

    switch (fetchSuccess) {
      case fetchSuccessData.success:
        return productsList.length > 0 ? (
          <div className="all-products-container">
            <ProductsHeader
              activeOptionId={activeOptionId}
              sortbyOptions={sortbyOptions}
              changeSortby={this.changeSortby}
              activeRating={this.activeRating}
            />

            <ul className="products-list">
              {productsList.map(product => (
                <ProductCard productData={product} key={product.id} />
              ))}
            </ul>
          </div>
        ) : (
          noProducts()
        )

      case fetchSuccessData.failed:
        return this.failedView()

      default:
        return null
    }
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  failedView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>oops! some thing went wrong</h1>
      <p>We are having some trouble</p>
    </div>
  )

  render() {
    const {isLoading} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryDetails={categoryOptions}
          ratingsList={ratingsList}
          activeCategory={this.activeCategory}
          activeRating={this.activeRating}
          activeSearchValue={this.activeSearchValue}
          setFilterDefault={this.setFilterDefault}
          submitForm={this.getProducts}
        />

        {isLoading ? this.renderLoader() : this.renderProductsList()}
      </div>
    )
  }
}

export default AllProductsSection
