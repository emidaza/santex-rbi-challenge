import { useMutation } from '@apollo/client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { OrderDispatchContext } from '../../context/order-context';
import { OrderDispatchTypes } from '../../enums/order-context.enum';
import { OrderGqlOperations } from '../../enums/order-gql-operations.enum';
import { ORDER } from '../../graphql/mutations';
import { GqlQueryResponse } from '../../models/gql-base';
import { Order } from '../../models/order';
import { Product } from '../../models/product';
import LoaderIndicator from '../loader-indicator/LoaderIndicator';
import Toast from '../toast/Toast';

const ProductCard = styled(Card)`
  height: 360px;
`;

const ProductCardFooter = styled(CardActions)`
  display: flex;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
`;

const ProductCardDivider = styled(Divider)`
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`;

export function ProductItem(props: { product: Product }) {
  const { product } = props;
  const productVariant = product.variants[0];
  const setOrder = useContext(OrderDispatchContext);

  const [addItemToOrder, { data, loading, error }] = useMutation<
    GqlQueryResponse<Order, OrderGqlOperations.AddItemToOrder>
  >(ORDER.ADD_ITEM_TO_ORDER);

  useEffect(() => {
    if (data && setOrder) {
      setOrder({
        type: OrderDispatchTypes.UpsertOrder,
        order: data.addItemToOrder as Order,
      });
    }
  }, [data, setOrder]);

  function handleBuyClick() {
    addItemToOrder({
      variables: { productVariantId: productVariant.id, quantity: 1 },
    }).catch((error) => console.log("A network error has ocurred"));
  }

  return (
    <React.Fragment>
      <ProductCard>
        <CardMedia
          sx={{ height: 140 }}
          image={product.featuredAsset.source}
          title={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="subtitle1" component="div" noWrap>
            {product.name}
          </Typography>
          <Box overflow="hidden" textOverflow="ellipsis" height={100}>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
          </Box>
        </CardContent>
        <ProductCardDivider orientation="horizontal" flexItem />
        <ProductCardFooter>
          <Typography
            variant="overline"
            color="text.secondary"
            fontWeight="bold"
          >
            ${productVariant.price}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleBuyClick()}
          >
            Buy
          </Button>
        </ProductCardFooter>
      </ProductCard>
      <LoaderIndicator open={loading}></LoaderIndicator>
      <Toast
        show={error !== undefined}
        message="The product couldn't be added to the order. Please try again later"
      ></Toast>
    </React.Fragment>
  );
}
