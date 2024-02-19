import { gql } from "@apollo/client";

// Here we put mutations. Remove next line
export const ORDER = {
    ADD_ITEM_TO_ORDER: gql`
        mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
            addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
                __typename
                ... on Order {
                    id
                    active
                    totalQuantity
                }
            }
        }
    `
};
