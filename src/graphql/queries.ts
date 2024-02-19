import { gql } from "@apollo/client";

// Here we put queries. Remove next line
export const PRODUCTS = {
  GET_PRODUCTS: gql`
  query GetProducts($take: Int, $skip: Int){
    products(options:{take: $take, skip: $skip}){
      totalItems
      items{
        name
        description
        featuredAsset {
          source
        }
        variants {
          price
          id
        }
      }
    }
  }
  `
}

export const ORDERS = {
  ACTIVE_ORDER: gql`
  query ActiveOrder {
    activeOrder {
      id
      active
      totalQuantity
    }
  }
  `
}