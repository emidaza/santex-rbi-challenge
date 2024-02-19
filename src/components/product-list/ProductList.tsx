import { NetworkStatus, useQuery } from '@apollo/client';
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState } from 'react';
import { ProductGqlOperations } from '../../enums/product-gql-operations.enum';
import { PRODUCTS } from '../../graphql/queries';
import { GqlPaginatedResponse, GqlQueryResponse } from '../../models/gql-base';
import { Product } from '../../models/product';
import LoaderIndicator from '../loader-indicator/LoaderIndicator';
import { ProductItem } from '../product-item/ProductItem';

export default function ProductList() {
  const pageSize = 20;
  const [pagesCount, setPagesCount] = useState(0);
  const { loading, error, data, refetch, networkStatus } = useQuery<
    GqlQueryResponse<
      GqlPaginatedResponse<Product>,
      ProductGqlOperations.products
    >
  >(PRODUCTS.GET_PRODUCTS, {
    variables: { take: pageSize, skip: 0 },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data) setPagesCount(Math.ceil(data.products.totalItems / pageSize));
  }, [data]);

  function getGridItems() {
    return data?.products.items.map((product: Product, index: number) => (
      <Grid item xs={3} key={index}>
        <ProductItem product={product}></ProductItem>
      </Grid>
    ));
  }

  function onPageChange(event: React.ChangeEvent<unknown>, value: number) {
    refetch({
      take: pageSize,
      skip: (value - 1) * pageSize,
    });
  }

  if (error) {
    return (
      <Container>
        <Typography sx={{ mt: 4 }} textAlign="center" variant="h5">
          There was an error loading the product lists, please try again later
        </Typography>
      </Container>
    );
  }

  return (
    <React.Fragment>
      <Typography variant="h5">Products</Typography>
      <Grid container spacing={4}>
        {getGridItems()}
      </Grid>
      <Stack alignItems="center">
        <Pagination
          sx={{ mt: 3 }}
          count={pagesCount}
          color="primary"
          onChange={(event, value) => onPageChange(event, value)}
        />
      </Stack>
      <LoaderIndicator
        open={loading || networkStatus === NetworkStatus.refetch}
      ></LoaderIndicator>
    </React.Fragment>
  );
}
